<script setup lang="ts">
import { onMounted, ref } from "vue";

/** A vertical timeline. Items fade up one after another as it scrolls into view, unless motion is reduced. */
defineProps<{ items: { year: string; text: string }[] }>();
const root = ref<HTMLElement>();
const shown = ref(false);

onMounted(() => {
  if (!("IntersectionObserver" in window)) return void (shown.value = true);
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      shown.value = true;
      io.disconnect();
    }
  }, { threshold: 0.15 });
  if (root.value) io.observe(root.value);
});
</script>

<template>
  <ol ref="root" class="timeline" :class="{ shown }">
    <li v-for="(item, i) in items" :key="i" :style="{ transitionDelay: `${i * 90}ms` }">
      <span class="dot" aria-hidden="true" />
      <span class="year">{{ item.year }}</span>
      <span class="text">{{ item.text }}</span>
    </li>
  </ol>
</template>

<style scoped>
.timeline {
  position: relative;
  list-style: none;
  margin: 24px 0;
  padding: 4px 0 4px 28px;
}
/* The spine: a neutral rule the dots sit on. */
.timeline::before {
  content: "";
  position: absolute;
  left: 7px;
  top: 10px;
  bottom: 10px;
  width: 2px;
  background: var(--vp-c-divider);
}
li {
  position: relative;
  margin: 0 0 18px;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.shown li { opacity: 1; transform: none; }
.dot {
  position: absolute;
  left: -26px;
  top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #cffb2d;
}
.year {
  display: block;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}
.text { display: block; line-height: 1.55; }
@media (prefers-reduced-motion: reduce) {
  li { opacity: 1; transform: none; transition: none; }
}
</style>
