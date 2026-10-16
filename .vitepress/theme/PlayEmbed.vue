<script setup lang="ts">
import { ref } from "vue";
import { withBase } from "vitepress";

const props = defineProps<{ src: string; title: string; ratio?: string }>();
/** Click to load: the game isn't fetched or run until the visitor asks, and can't grab the keyboard uninvited. */
const playing = ref(false);
</script>

<template>
  <div class="embed" :style="{ aspectRatio: props.ratio ?? '16 / 9' }">
    <iframe v-if="playing" :src="withBase(props.src)" :title="props.title" allow="gamepad; fullscreen" />
    <button v-else class="start" type="button" :aria-label="`Play ${props.title}`" @click="playing = true">
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 2.5v11a1 1 0 0 0 1.5.86l8.5-5.5a1 1 0 0 0 0-1.72L6 1.64A1 1 0 0 0 4.5 2.5z" /></svg>
      <span>Play {{ props.title }}</span>
    </button>
  </div>
</template>

<style scoped>
.embed {
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #0d1208;
  border: 1px solid #cffb2d33;
  margin: 16px 0;
}
iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}
.start {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 10px;
  color: #cffb2d;
  font: 600 14px var(--vp-font-family-base);
}
.start svg {
  width: 56px;
  height: 56px;
  padding: 16px;
  border-radius: 999px;
  background: #cffb2d;
  fill: #11140d;
}
.start:focus-visible {
  outline: 2px solid #e7fd96;
  outline-offset: -4px;
}
</style>
