<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import type { Plinko } from "../../examples/plinko/plinko";

const canvas = ref<HTMLCanvasElement>();
const frame = ref<HTMLElement>();
const balls = ref(0);
const fps = ref(0);
const best = ref(0);
/** Opt-in: nothing moves until the visitor presses play (many fast particles). */
const playing = ref(false);
const started = ref(false);
const failed = ref(false);
let game: Plinko | undefined;
let observer: IntersectionObserver | undefined;
let visible = false;
let stopSync: (() => void) | undefined;

const fmt = (n: number) => n.toLocaleString("en-US");

// Run only while playing, on screen and in a visible tab.
function sync() {
  if (document.hidden) return;
  if (playing.value && visible) game?.play();
  else game?.pause();
}

function toggle() {
  playing.value = !playing.value;
  started.value = true;
  sync();
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
    // A still preview: two seconds of simulation, stepped once, so the board isn't empty.
    game.still(120);
  } catch {
    failed.value = true;
    return;
  }
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
      <canvas ref="canvas" aria-label="plinko: balls falling through pegs, drawn by debuff. Click the board to drop more." />
      <button v-if="!started && !failed" class="play" type="button" aria-label="Play the demo" title="Play" @click="toggle">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 2.5v11a1 1 0 0 0 1.5.86l8.5-5.5a1 1 0 0 0 0-1.72L6 1.64A1 1 0 0 0 4.5 2.5z" /></svg>
      </button>
      <button
        v-else-if="!failed"
        class="toggle"
        type="button"
        :aria-label="playing ? 'Pause the demo' : 'Play the demo'"
        :title="playing ? 'Pause' : 'Play'"
        @click.stop="toggle"
      >
        <svg v-if="playing" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1" /><rect x="9.5" y="2" width="3.5" height="12" rx="1" /></svg>
        <svg v-else viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11a1 1 0 0 0 1.5.86l9-5.5a1 1 0 0 0 0-1.72l-9-5.5A1 1 0 0 0 4 2.5z" /></svg>
      </button>
      <p v-if="failed" class="fallback">The demo needs WebGL2 or Canvas 2D, and couldn't start here.</p>
    </div>
    <figcaption>
      <span class="count"><strong>{{ fmt(balls) }}</strong> sprites</span>
      <span v-if="playing">{{ fps }} fps</span>
      <span v-if="best && started" class="best">{{ fmt(best) }} held at 60 fps</span>
      <span class="hint">click the board to drop more ·
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
  inset: 0;
  margin: auto;
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #cffb2d;
  color: #11140d;
  box-shadow: 0 6px 24px #0008;
}
.play svg {
  width: 26px;
  height: 26px;
  fill: currentColor;
}
.toggle {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #11140dcc;
  border: 1px solid #cffb2d66;
  color: #cffb2d;
}
.toggle svg {
  width: 14px;
  height: 14px;
  fill: currentColor;
}
.toggle:focus-visible,
.play:focus-visible {
  outline: 2px solid #e7fd96;
  outline-offset: 2px;
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
