/**
 * plinko: a debuff stress test you can play. Balls fall through a peg board into bins, and the game
 * keeps adding balls while it holds 60 fps, so the counter shows how many sprites debuff draws on this
 * device. Click or tap to drop more where you point.
 *
 * Built to be calm to watch: one soft colour at low, fixed opacity (no strobing confetti, brightness never
 * pulses with the count),
 * balls added and removed gradually (no sudden flashes), and a walled board so nothing leaves the frame.
 *
 * Only @debuffjp/core. Each ball is one `draw.sprite` call; physics is plain arrays, no allocation per frame.
 */
import { Game } from "@debuffjp/core";

const SIZE = 480;
const BALL_R = 2.5;
const PEG_R = 2.5;
const ROWS = 13;
const ROW_GAP = 26;
const COL_GAP = 30;
const TOP = 70;
const BIN_TOP = TOP + (ROWS - 1) * ROW_GAP + 18;
const BINS = 16;
const BIN_W = SIZE / BINS;
const FLOOR = SIZE - 6;
const GRAVITY = 520;
const MAX = 250_000;
const START = 300;
/**
 * Calm mode (the default): a few hundred bigger balls, so the board reads as a gentle plinko game.
 * Tens of thousands of tiny moving dots make pixels pop on and off everywhere at once, which looks
 * like flicker; that load only runs when a visitor asks for the stress test.
 */
const CALM = 350;
/** Most balls added per frame, so the board fills gradually instead of jumping. */
const MAX_SPAWN = 250;
/** A two-armed paddle spinning mid-board, so the stream gets batted around instead of pouring straight down. */
const SPIN_X = SIZE / 2;
const SPIN_Y = TOP + 6 * ROW_GAP;
const SPIN_LEN = 52; // arm length from the hub
const SPIN_HALF = 3; // half the arm thickness
const SPIN_SPEED = 1.4; // radians per second
/** Pegs inside the paddle's sweep are left out. */
const SPIN_CLEAR = SPIN_LEN + 8;

// One hue. Many saturated colours churning in a dense field read as strobing static; a single soft
// lime at low opacity lets density build into a steady glow instead.
const TINTS = [0xcffb2dff];
/** Per-ball opacity: low enough that one moving ball barely registers against the board. */
const BALL_ALPHA = 0.3;
const INK = "#0d1208";

export interface Plinko {
  /** Start or resume the simulation. */
  play(): void;
  pause(): void;
  /** Advance `steps` fixed steps without the loop (a still preview frame before playing). */
  still(steps: number): void;
  /** Stress test on: keep adding balls while the device holds 60 fps. Off: drain back to a calm board. */
  stress(on: boolean): void;
  dispose(): void;
}

export function plinko(canvas: HTMLCanvasElement, options: { onStats?: (balls: number, fps: number, best: number) => void } = {}): Plinko {
  const game = new Game({ canvas, width: SIZE, height: SIZE, scale: "fit", background: INK, splash: false });
  const rnd = () => game.random.next();

  // One small white disc, tinted per ball at draw time.
  const ballImage = document.createElement("canvas");
  ballImage.width = ballImage.height = BALL_R * 4;
  const bctx = ballImage.getContext("2d");
  if (bctx) {
    bctx.fillStyle = "#fff";
    bctx.beginPath();
    bctx.arc(BALL_R * 2, BALL_R * 2, BALL_R * 2 - 0.5, 0, Math.PI * 2);
    bctx.fill();
  }
  const ballScale = 0.5; // drawn at half size: crisp on high-DPI screens
  // One reusable options object per colour: drawing a ball allocates nothing.
  const looks = TINTS.map((t) => ({ scaleX: ballScale, scaleY: ballScale, tint: t }));
  // Calm balls: bigger and more opaque, so a few hundred read as solid, softly moving marbles.
  const calmLooks = TINTS.map((t) => ({ scaleX: 0.85, scaleY: 0.85, tint: t }));

  // A full-width staggered peg grid, like a real Galton board: every ball meets pegs all the way down.
  const rowOffset = (r: number) => (r % 2 ? COL_GAP / 2 : 0) + (SIZE - Math.floor(SIZE / COL_GAP) * COL_GAP) / 2 + COL_GAP / 2;
  const pegsPerRow = (r: number) => Math.floor((SIZE - rowOffset(r)) / COL_GAP) + 1;
  const pegClear = (px: number, py: number) => (px - SPIN_X) ** 2 + (py - SPIN_Y) ** 2 < SPIN_CLEAR * SPIN_CLEAR;
  let spin = 0;

  const x = new Float32Array(MAX);
  const y = new Float32Array(MAX);
  const vx = new Float32Array(MAX);
  const vy = new Float32Array(MAX);
  const look = new Uint8Array(MAX);
  const bins = new Float64Array(BINS);
  let count = 0;
  let stressing = false;
  let target = CALM;
  let best = 0;
  let rampTimer = 0;
  let statTimer = 0;
  let tintIndex = 0;
  let dropAt = -1;
  let dropLeft = 0;

  const spawn = (i: number, at = SIZE / 2) => {
    x[i] = Math.min(SIZE - 20, Math.max(20, at + (rnd() - 0.5) * 30));
    y[i] = 8 + rnd() * 24;
    vx[i] = (rnd() - 0.5) * 30;
    vy[i] = rnd() * 30;
    look[i] = tintIndex++ % TINTS.length;
  };

  // A click queues a drop that trickles in over a few frames (no burst flash).
  canvas.addEventListener("pointerdown", (e) => {
    dropAt = game.toLogical(e.clientX, e.clientY).x;
    dropLeft += stressing ? 400 : 40;
  });

  game
    .add({
      id: "plinko",
      update(dt) {
        // Grow slowly while the device keeps up; ease off when frames drop. `best` = most held at full speed.
        spin += SPIN_SPEED * dt;
        const cosA = Math.cos(spin);
        const sinA = Math.sin(spin);
        rampTimer += dt;
        if (!stressing) {
          target = CALM;
        } else if (rampTimer > 0.5) {
          rampTimer = 0;
          const { fps, workP95Ms } = game.stats.summary();
          if (fps >= 57 && workP95Ms < 12) {
            best = Math.max(best, count);
            target = Math.min(MAX, Math.ceil(target * 1.06) + 50);
          } else if (fps > 0 && fps < 50) {
            target = Math.max(START, Math.floor(target * 0.95));
          }
        }
        let spawned = 0;
        while (dropLeft > 0 && count < MAX && spawned < MAX_SPAWN) {
          spawn(count++, dropAt);
          dropLeft--;
          spawned++;
        }
        target = Math.max(target, count);
        while (count < target && spawned < MAX_SPAWN) {
          spawn(count++);
          spawned++;
        }

        const g = GRAVITY * dt;
        const min = BALL_R + PEG_R;
        for (let i = 0; i < count; i++) {
          let bx = x[i] as number;
          let by = y[i] as number;
          let bvx = vx[i] as number;
          let bvy = (vy[i] as number) + g;
          bx += bvx * dt;
          by += bvy * dt;
          // Nearest peg: nearest row, then nearest column in that row's stagger.
          const r = Math.round((by - TOP) / ROW_GAP);
          if (r >= 0 && r < ROWS) {
            const py = TOP + r * ROW_GAP;
            const off = rowOffset(r);
            const c = Math.max(0, Math.min(pegsPerRow(r) - 1, Math.round((bx - off) / COL_GAP)));
            const px = off + c * COL_GAP;
            const cleared = pegClear(px, py);
            const dx = bx - px;
            const dy = by - py;
            const d2 = dx * dx + dy * dy;
            if (!cleared && d2 < min * min && d2 > 0.0001) {
              const d = Math.sqrt(d2);
              const nx = dx / d;
              const ny = dy / d;
              bx = px + nx * min;
              by = py + ny * min;
              const dot = bvx * nx + bvy * ny;
              if (dot < 0) {
                bvx = (bvx - 1.5 * dot * nx) * 0.85 + (rnd() - 0.5) * 20;
                bvy = (bvy - 1.5 * dot * ny) * 0.6;
              }
            }
          }
          // The paddle: two arms through the hub. Push the ball out of an arm and add the arm's own
          // surface speed (spin × radius), so balls get flung rather than just sliding off.
          const rx = bx - SPIN_X;
          const ry = by - SPIN_Y;
          const reach = SPIN_LEN + BALL_R + SPIN_HALF;
          if (rx * rx + ry * ry < reach * reach) {
            for (let arm = 0; arm < 2; arm++) {
              // Arm direction: angle spin, and spin + 90°.
              const ux = arm === 0 ? cosA : -sinA;
              const uy = arm === 0 ? sinA : cosA;
              const along = Math.max(-SPIN_LEN, Math.min(SPIN_LEN, rx * ux + ry * uy));
              const cx = rx - ux * along;
              const cy = ry - uy * along;
              const dist2 = cx * cx + cy * cy;
              const hit = BALL_R + SPIN_HALF;
              if (dist2 < hit * hit && dist2 > 0.0001) {
                const dist = Math.sqrt(dist2);
                const nx = cx / dist;
                const ny = cy / dist;
                bx += nx * (hit - dist);
                by += ny * (hit - dist);
                // Surface velocity of the arm at the contact point.
                const svx = -SPIN_SPEED * (uy * along);
                const svy = SPIN_SPEED * (ux * along);
                const rvx = bvx - svx;
                const rvy = bvy - svy;
                const dot = rvx * nx + rvy * ny;
                if (dot < 0) {
                  bvx = svx + (rvx - 1.6 * dot * nx) * 0.9;
                  bvy = svy + (rvy - 1.6 * dot * ny) * 0.9;
                }
              }
            }
          }
          // Walls keep everything inside the frame.
          if (bx < BALL_R + 2) {
            bx = BALL_R + 2;
            bvx = Math.abs(bvx) * 0.5;
          } else if (bx > SIZE - BALL_R - 2) {
            bx = SIZE - BALL_R - 2;
            bvx = -Math.abs(bvx) * 0.5;
          }
          if (by >= FLOOR) {
            const b = Math.max(0, Math.min(BINS - 1, Math.floor(bx / BIN_W)));
            bins[b] = (bins[b] as number) + 1;
            if (count > target) {
              // Easing off: let this ball leave through its bin instead of removing balls mid-air.
              const last = --count;
              x[i] = x[last] as number;
              y[i] = y[last] as number;
              vx[i] = vx[last] as number;
              vy[i] = vy[last] as number;
              look[i] = look[last] as number;
              i--;
            } else spawn(i);
            continue;
          }
          x[i] = bx;
          y[i] = by;
          vx[i] = bvx;
          vy[i] = bvy;
        }
        // Bins slowly forget, so the bars show the recent shape (a bell curve).
        for (let b = 0; b < BINS; b++) bins[b] = (bins[b] as number) * (1 - dt * 0.15);

        statTimer += dt;
        if (statTimer > 0.25) {
          statTimer = 0;
          options.onStats?.(count, game.stats.summary().fps, best);
        }
      },
      render(draw) {
        let most = 1;
        for (let b = 0; b < BINS; b++) most = Math.max(most, bins[b] as number);
        for (let b = 0; b < BINS; b++) {
          const h = ((bins[b] as number) / most) * (SIZE - BIN_TOP - 8);
          draw.rect(b * BIN_W + 2, SIZE - h, BIN_W - 4, h, "#cffb2d26");
        }
        for (let b = 1; b < BINS; b++) draw.rect(b * BIN_W - 1, BIN_TOP, 2, SIZE - BIN_TOP, "#e7fd9640");
        // Fixed opacity, normal blending: dense areas fill in calmly, brightness never pulses.
        draw.alpha = stressing ? BALL_ALPHA : 0.9;
        const set = stressing ? looks : calmLooks;
        for (let i = 0; i < count; i++) draw.sprite(ballImage, x[i] as number, y[i] as number, set[look[i] as number]);
        draw.alpha = 1;
        for (let r = 0; r < ROWS; r++) {
          const off = rowOffset(r);
          for (let c = 0; c < pegsPerRow(r); c++) {
            // A light ring with a dark core: visible on the empty board and against a dense crowd alike,
            // so pegs never seem to blink as balls stream past.
            const px = off + c * COL_GAP;
            const py = TOP + r * ROW_GAP;
            if (pegClear(px, py)) continue;
            draw.circle(px, py, PEG_R + 1, "#e7fd96");
            draw.circle(px, py, PEG_R - 0.5, INK);
          }
        }
        draw.push();
        draw.translate(SPIN_X, SPIN_Y);
        draw.rotate(spin);
        for (let arm = 0; arm < 2; arm++) {
          draw.rect(-SPIN_LEN - 1, -SPIN_HALF - 1, SPIN_LEN * 2 + 2, SPIN_HALF * 2 + 2, "#e7fd96");
          draw.rect(-SPIN_LEN + 1, -SPIN_HALF + 1, SPIN_LEN * 2 - 2, SPIN_HALF * 2 - 2, INK);
          draw.rotate(Math.PI / 2);
        }
        draw.pop();
        draw.circle(SPIN_X, SPIN_Y, 5, "#e7fd96");
        draw.circle(SPIN_X, SPIN_Y, 2.5, INK);
      },
    })
    .go("plinko");

  return {
    play: () => game.start(),
    pause: () => game.stop(),
    still: (steps) => game.step(steps),
    stress(on) {
      stressing = on;
      target = on ? Math.max(START, count) : CALM;
    },
    dispose: () => game.dispose(),
  };
}
