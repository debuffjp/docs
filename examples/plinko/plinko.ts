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
/** Most balls added per frame, so the board fills gradually instead of jumping. */
const MAX_SPAWN = 250;

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

  // A full-width staggered peg grid, like a real Galton board: every ball meets pegs all the way down.
  const rowOffset = (r: number) => (r % 2 ? COL_GAP / 2 : 0) + (SIZE - Math.floor(SIZE / COL_GAP) * COL_GAP) / 2 + COL_GAP / 2;
  const pegsPerRow = (r: number) => Math.floor((SIZE - rowOffset(r)) / COL_GAP) + 1;

  const x = new Float32Array(MAX);
  const y = new Float32Array(MAX);
  const vx = new Float32Array(MAX);
  const vy = new Float32Array(MAX);
  const look = new Uint8Array(MAX);
  const bins = new Float64Array(BINS);
  let count = 0;
  let target = START;
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
    dropLeft += 400;
  });

  game
    .add({
      id: "plinko",
      update(dt) {
        // Grow slowly while the device keeps up; ease off when frames drop. `best` = most held at full speed.
        rampTimer += dt;
        if (rampTimer > 0.5) {
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
            const dx = bx - px;
            const dy = by - py;
            const d2 = dx * dx + dy * dy;
            if (d2 < min * min && d2 > 0.0001) {
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
        draw.alpha = BALL_ALPHA;
        for (let i = 0; i < count; i++) draw.sprite(ballImage, x[i] as number, y[i] as number, looks[look[i] as number]);
        draw.alpha = 1;
        for (let r = 0; r < ROWS; r++) {
          const off = rowOffset(r);
          for (let c = 0; c < pegsPerRow(r); c++) {
            // A light ring with a dark core: visible on the empty board and against a dense crowd alike,
            // so pegs never seem to blink as balls stream past.
            const px = off + c * COL_GAP;
            const py = TOP + r * ROW_GAP;
            draw.circle(px, py, PEG_R + 1, "#e7fd96");
            draw.circle(px, py, PEG_R - 0.5, INK);
          }
        }
      },
    })
    .go("plinko");

  return {
    play: () => game.start(),
    pause: () => game.stop(),
    dispose: () => game.dispose(),
  };
}
