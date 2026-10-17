<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useData } from "vitepress";

// The home hero's name, line and tagline. The letters of "debuff" hop and squash like buff when the
// pointer comes near, and settle back when it leaves. No motion for readers who prefer less.
const { frontmatter } = useData();
let letters: HTMLElement[] = [];
const heading = ref<HTMLElement>();
let raf = 0;
let px = -1e4;
let py = -1e4;
const lift: number[] = [];
const vel: number[] = [];

function frame() {
  raf = 0;
  let moving = false;
  letters.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
    const target = Math.max(0, 1 - d / 180); // 0 far away, 1 under the pointer
    // A damped spring, so letters overshoot a little and wobble to rest, like buff landing.
    let k0 = lift[i] ?? 0;
    let v = ((vel[i] ?? 0) + (target - k0) * 0.18) * 0.78;
    k0 += v;
    if (Math.abs(v) < 0.001 && Math.abs(target - k0) < 0.002) {
      k0 = target;
      v = 0;
    } else moving = true;
    lift[i] = k0;
    vel[i] = v;
    const k = lift[i];
    // Up and slightly stretched as it rises, like a hop.
    el.style.transform = `translateY(${-k * 0.22}em) scale(${1 - k * 0.08}, ${1 + k * 0.12})`;
  });
  if (moving) raf = requestAnimationFrame(frame);
}

function onMove(e: PointerEvent) {
  px = e.clientX;
  py = e.clientY;
  if (!raf) raf = requestAnimationFrame(frame);
}

let reduce: MediaQueryList | undefined;
onMounted(() => {
  letters = [...(heading.value?.querySelectorAll<HTMLElement>(".letter") ?? [])];
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduce.matches) return;
  window.addEventListener("pointermove", onMove, { passive: true });
});
onBeforeUnmount(() => {
  window.removeEventListener("pointermove", onMove);
  cancelAnimationFrame(raf);
});
</script>

<template>
  <h1 ref="heading" class="heading">
    <span class="name clip hop" :aria-label="frontmatter.hero.name">
      <span
        v-for="(ch, i) in frontmatter.hero.name"
        :key="i"
        class="letter"
        aria-hidden="true"
        >{{ ch }}</span
      >
    </span>
    <span v-if="frontmatter.hero.text" class="text">{{ frontmatter.hero.text }}</span>
  </h1>
  <p v-if="frontmatter.hero.tagline" class="tagline">{{ frontmatter.hero.tagline }}</p>
</template>

<style scoped>
.hop {
  display: inline-block;
}
.letter {
  display: inline-block;
  transform-origin: 50% 100%;
  will-change: transform;
  /* Each letter is clipped separately, so it keeps the gradient as it moves. */
  background: var(--vp-home-hero-name-background);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

<style>
/* VitePress's hero styles are scoped to its own markup, so the replacement slot repeats them. */
.VPHero .heading { display: flex; flex-direction: column; }
.VPHero .heading .name,
.VPHero .heading .text {
  width: fit-content;
  max-width: 392px;
  letter-spacing: -0.4px;
  line-height: 40px;
  font-size: 32px;
  font-weight: 700;
  white-space: pre-wrap;
}
.VPHero.has-image .heading .name,
.VPHero.has-image .heading .text,
.VPHero.has-image .tagline { margin: 0 auto; }
.VPHero .tagline {
  padding-top: 8px;
  max-width: 392px;
  line-height: 28px;
  font-size: 18px;
  font-weight: 500;
  white-space: pre-wrap;
  color: var(--vp-c-text-2);
}
@media (min-width: 640px) {
  .VPHero .heading .name,
  .VPHero .heading .text { max-width: 576px; line-height: 56px; font-size: 48px; }
  .VPHero .tagline { padding-top: 12px; max-width: 576px; line-height: 32px; font-size: 20px; }
}
@media (min-width: 960px) {
  .VPHero .heading .name,
  .VPHero .heading .text { line-height: 64px; font-size: 56px; }
  .VPHero .tagline { line-height: 36px; font-size: 24px; }
  .VPHero.has-image .heading .name,
  .VPHero.has-image .heading .text,
  .VPHero.has-image .tagline { margin: 0; }
}
</style>
