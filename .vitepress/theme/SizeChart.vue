<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

/**
 * Bundle size bars: each library's complete prebuilt bundle, brotli, measured 2026-10-17.
 * `only` limits the chart to debuff plus the named libraries.
 */
const props = defineProps<{ only?: string }>();
const ALL = [
  { name: "debuff", file: "all debuff packages", kb: 20 },
  { name: "KAPLAY", file: "kaplay.mjs", kb: 59 },
  { name: "Excalibur", file: "excalibur.min.js", kb: 118 },
  { name: "PixiJS", file: "pixi.min.js", kb: 185 },
  { name: "Phaser", file: "phaser.min.js", kb: 276 },
  // Shown only when a post names them in `only`.
  { name: "LittleJS", file: "littlejs.esm.min.js", kb: 138, optIn: true },
  { name: "three.js", file: "three.module.js, minified", kb: 151, optIn: true },
  { name: "melonJS", file: "melonjs, bundled and minified", kb: 211, optIn: true },
];
const rows = computed(() => {
  const keep = props.only?.split(",").map((s) => s.trim().toLowerCase());
  return ALL.filter((r) => r.name === "debuff" || (keep ? keep.includes(r.name.toLowerCase()) : !r.optIn)).sort((a, b) => a.kb - b.kb);
});
const max = computed(() => Math.max(...rows.value.map((r) => r.kb)));
const root = ref<HTMLElement>();
const shown = ref(false);

// Grow the bars once the chart scrolls into view; show them at once without IntersectionObserver.
onMounted(() => {
  if (!("IntersectionObserver" in window)) return void (shown.value = true);
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      shown.value = true;
      io.disconnect();
    }
  });
  if (root.value) io.observe(root.value);
});
</script>

<template>
  <figure ref="root" class="size-chart" :class="{ shown }">
    <figcaption>Full runtime download, brotli (kB, smaller is better)</figcaption>
    <div v-for="r in rows" :key="r.name" class="row" :class="{ us: r.name === 'debuff' }">
      <span class="label">{{ r.name }}</span>
      <span class="track">
        <span class="bar" :style="{ width: `${(r.kb / max) * 100}%` }" />
      </span>
      <span class="value">{{ r.kb }} kB</span>
    </div>
    <p class="note">
      Each library's complete prebuilt bundle ({{ rows.map((r) => r.file).join(", ") }}), compressed with brotli and measured on
      17 October 2026. Tree-shaken games ship less.
    </p>
  </figure>
</template>

<style scoped>
.size-chart {
  margin: 24px 0;
  padding: 20px 24px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}
figcaption {
  margin-bottom: 12px;
  font-weight: 600;
  font-size: 15px;
}
.row {
  display: grid;
  grid-template-columns: 84px 1fr 56px;
  align-items: center;
  gap: 12px;
  margin: 8px 0;
  font-size: 14px;
}
.label { color: var(--vp-c-text-1); }
.value {
  text-align: right;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
}
.us .label, .us .value { font-weight: 700; color: var(--vp-c-text-1); }
.track {
  height: 14px;
  border-radius: 7px;
  background: var(--vp-c-default-soft);
  overflow: hidden;
}
.bar {
  display: block;
  height: 100%;
  border-radius: 7px;
  background: var(--vp-c-text-3);
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.us .bar { background: #cffb2d; }
.shown .bar { transform: scaleX(1); }
@media (prefers-reduced-motion: reduce) {
  .bar { transition: none; transform: scaleX(1); }
}
.note {
  margin: 12px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}
@media (max-width: 480px) {
  .size-chart { padding: 16px; }
  .row { grid-template-columns: 70px 1fr 50px; gap: 8px; }
}
</style>
