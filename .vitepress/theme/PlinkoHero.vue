<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import type { Plinko } from "../../examples/plinko/plinko";

const canvas = ref<HTMLCanvasElement>();
const frame = ref<HTMLElement>();
const balls = ref(0);
const fps = ref(0);
const best = ref(0);
const waiting = ref(false);
const failed = ref(false);
let game: Plinko | undefined;
let observer: IntersectionObserver | undefined;
let visible = false;
let stopSync: (() => void) | undefined;

const fmt = (n: number) => n.toLocaleString("en-US");

function start() {
  waiting.value = false;
  if (visible) game?.play();
}

onMounted(async () => {
  try {
    // Loaded on the client only, after the page renders: the demo never blocks content.
    const { plinko } = await import("../../examples/plinko/plinko");
    if (!canvas.value) return;
    game = plinko(canvas.value, {
      onStats(b, f, top) {
        balls.value = b;
        fps.value = f;
        best.value = top;
      },
    });
  } catch {
    failed.value = true;
    return;
  }
  waiting.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Only run while on screen. A hidden page is debuff's job (it pauses itself), so ignore it here and
  // resume when the page shows again, or the board could stay paused.
  const sync = () => {
    if (document.hidden) return;
    if (visible && !waiting.value) game?.play();
    else game?.pause();
  };
  observer = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
    sync();
  });
  if (frame.value) observer.observe(frame.value);
  document.addEventListener("visibilitychange", sync);
  stopSync = () => document.removeEventListener("visibilitychange", sync);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  stopSync?.();
  game?.dispose();
});
</script>

<template>
  <figure class="plinko" ref="frame">
    <div class="board">
      <canvas ref="canvas" aria-label="plinko: balls falling through pegs, drawn by debuff. Click to drop more." />
      <button v-if="waiting" class="play" type="button" @click="start">Play the demo</button>
      <p v-if="failed" class="fallback">The demo needs WebGL2 or Canvas 2D, and couldn't start here.</p>
    </div>
    <figcaption>
      <span class="count"><strong>{{ fmt(balls) }}</strong> sprites</span>
      <span>{{ fps }} fps</span>
      <span v-if="best" class="best">{{ fmt(best) }} held at 60 fps</span>
      <span class="hint">click to drop more ·
        <a href="https://github.com/debuffjp/docs/blob/main/examples/plinko/plinko.ts">source</a></span>
    </figcaption>
  </figure>
</template>

<style scoped>
.plinko {
  margin: 0;
  width: min(100%, 420px);
}
.board {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 14px;
  overflow: hidden;
  background: #0d1208;
  border: 1px solid #cffb2d33;
}
.board canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
  cursor: crosshair;
  touch-action: manipulation;
}
.play {
  position: absolute;
  inset: auto 0 45% 0;
  margin: auto;
  width: fit-content;
  padding: 8px 16px;
  border-radius: 999px;
  background: #cffb2d;
  color: #11140d;
  font-weight: 600;
}
.fallback {
  position: absolute;
  inset: 40% 16px auto;
  text-align: center;
  color: #8a9479;
}
figcaption {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  margin-top: 8px;
  font: 12px/1.5 var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
}
.count strong {
  color: #cffb2d;
  font-size: 14px;
}
.best {
  color: var(--vp-c-text-1);
}
.hint {
  flex-basis: 100%;
}
.hint a {
  color: var(--vp-c-brand-1);
}
</style>
