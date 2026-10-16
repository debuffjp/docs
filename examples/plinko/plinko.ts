/**
 * plinko: a debuff stress test you can play. Balls fall through pegs into bins, and the game keeps
 * adding balls while it holds 60 fps, so the counter shows how many sprites debuff draws on this
 * device. Click or tap to drop a burst where you point.
 *
 * Only @debuffjp/core. Each ball is one `draw.sprite` call; physics is plain arrays, no allocation per frame.
 */
import { Game } from "@debuffjp/core";

const SIZE = 480;
const BALL_R = 3;
const PEG_R = 2.5;
const ROWS = 12;
const ROW_GAP = 27;
const COL_GAP = 30;
const TOP = 86;
const BIN_TOP = TOP + ROWS * ROW_GAP + 14;
const BINS = 16;
const GRAVITY = 520;
const MAX = 250_000;
const START = 400;

// The debuff palette, as 0xRRGGBBAA tints for a white ball sprite.
const TINTS = [0xcffb2dff, 0x38bdf8ff, 0xf472b6ff, 0xfbbf24ff, 0xa78bfaff];
const INK = "#0d1208";

export interface Plinko {
  /** Start or resume the simulation. */
  play(): void;
  pause(): void;
  dispose(): void;
}

export function plinko(canvas: HTMLCanvasElement, options: { onStats?: (balls: number, fps: number, best: number) => void } = {}): Plinko {
  const game = new Game({ canvas, width: SIZE, height: SIZE, scale: "fit", background: INK, splash: false });

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

  // Pegs on a staggered lattice; a ball only ever tests the few pegs near it.
  const pegX: number[][] = [];
  for (let r = 0; r < ROWS; r++) {
    const row: number[] = [];
    const n = 7 + r;
    const offset = SIZE / 2 - ((n - 1) * COL_GAP) / 2;
    for (let c = 0; c < n; c++) row.push(offset + c * COL_GAP);
    pegX.push(row);
  }

  const x = new Float32Array(MAX);
  const y = new Float32Array(MAX);
  const vx = new Float32Array(MAX);
  const vy = new Float32Array(MAX);
  // One reusable options object per colour: drawing a ball allocates nothing.
  const looks = TINTS.map((t) => ({ scaleX: ballScale, scaleY: ballScale, tint: t }));
  const look = new Uint8Array(MAX);
  const bins = new Float64Array(BINS);
  let count = 0;
  let target = START;
  let best = 0;
  let rampTimer = 0;
  let statTimer = 0;
  let tintIndex = 0;

  const spawn = (i: number, at = SIZE / 2) => {
    x[i] = at + (game.random.next() - 0.5) * 24;
    y[i] = 20 + game.random.next() * 30;
    vx[i] = (game.random.next() - 0.5) * 30;
    vy[i] = game.random.next() * 40;
    look[i] = tintIndex++ % TINTS.length;
  };

  const burst = (at: number, n: number) => {
    for (let k = 0; k < n && count < MAX; k++) spawn(count++, at);
    target = Math.max(target, count);
  };

  canvas.addEventListener("pointerdown", (e) => {
    const p = game.toLogical(e.clientX, e.clientY);
    burst(p.x, 400);
  });

  game
    .add({
      id: "plinko",
      update(dt) {
        // Grow while the device keeps up, back off when frames drop. `best` is the most held at full speed.
        rampTimer += dt;
        if (rampTimer > 0.25) {
          rampTimer = 0;
          const { fps, workP95Ms } = game.stats.summary();
          if (fps >= 57 && workP95Ms < 12) {
            target = Math.min(MAX, Math.ceil(target * 1.12));
            best = Math.max(best, count);
          } else if (fps > 0 && fps < 50) {
            target = Math.max(START, Math.floor(target * 0.9));
          }
        }
        while (count < target) spawn(count++);
        if (count > target) count = target;

        const g = GRAVITY * dt;
        for (let i = 0; i < count; i++) {
          let bx = x[i] as number;
          let by = y[i] as number;
          let bvx = vx[i] as number;
          let bvy = (vy[i] as number) + g;
          bx += bvx * dt;
          by += bvy * dt;
          // Nearest peg row, then the nearest peg in it.
          const r = Math.round((by - TOP) / ROW_GAP);
          const row = pegX[r];
          if (row) {
            const py = TOP + r * ROW_GAP;
            const first = row[0] as number;
            const c = Math.max(0, Math.min(row.length - 1, Math.round((bx - first) / COL_GAP)));
            const px = row[c] as number;
            const dx = bx - px;
            const dy = by - py;
            const d2 = dx * dx + dy * dy;
            const min = BALL_R + PEG_R;
            if (d2 < min * min && d2 > 0.0001) {
              const d = Math.sqrt(d2);
              const nx = dx / d;
              const ny = dy / d;
              bx = px + nx * min;
              by = py + ny * min;
              const dot = bvx * nx + bvy * ny;
              if (dot < 0) {
                bvx = (bvx - 1.5 * dot * nx) * 0.85 + (game.random.next() - 0.5) * 20;
                bvy = (bvy - 1.5 * dot * ny) * 0.6;
              }
            }
          }
          if (bx < BALL_R) {
            bx = BALL_R;
            bvx = Math.abs(bvx) * 0.5;
          } else if (bx > SIZE - BALL_R) {
            bx = SIZE - BALL_R;
            bvx = -Math.abs(bvx) * 0.5;
          }
          if (by > BIN_TOP + 20) {
            const b = Math.max(0, Math.min(BINS - 1, Math.floor((bx / SIZE) * BINS)));
            bins[b] = (bins[b] as number) + 1;
            spawn(i);
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
        const bw = SIZE / BINS;
        for (let b = 0; b < BINS; b++) {
          const h = ((bins[b] as number) / most) * (SIZE - BIN_TOP - 26);
          draw.rect(b * bw + 2, SIZE - h, bw - 4, h, b % 2 ? "#cffb2d33" : "#cffb2d55");
        }
        // Additive and translucent: where thousands overlap they glow, instead of flickering like static.
        draw.blend("add");
        // Fainter as the crowd grows, so overlap reads as a glow at any count, never a white-out.
        draw.alpha = Math.min(0.6, Math.max(0.05, 2500 / Math.max(1, count)));
        for (let i = 0; i < count; i++) {
          draw.sprite(ballImage, x[i] as number, y[i] as number, looks[look[i] as number]);
        }
        draw.alpha = 1;
        draw.blend("normal");
        // Pegs on top, so the board stays readable under any load.
        for (let r = 0; r < ROWS; r++) for (const px of pegX[r] ?? []) draw.circle(px, TOP + r * ROW_GAP, PEG_R, "#e7fd96");
      },
    })
    .go("plinko");

  return {
    play: () => game.start(),
    pause: () => game.stop(),
    dispose: () => game.dispose(),
  };
}
