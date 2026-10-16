<script setup lang="ts">
import { withBase } from "vitepress";
import { onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps<{ src: string; title: string; ratio?: string }>();
/** Click to load: the game isn't fetched or run until the visitor asks, and can't grab the keyboard uninvited. */
const playing = ref(false);
/** Keys only reach the game while its frame has focus; show a hint when they wouldn't. */
const focused = ref(false);
const frame = ref<HTMLIFrameElement>();

function focusGame() {
  frame.value?.focus();
  frame.value?.contentWindow?.focus();
}

// The frame gaining or losing focus shows up as the page's active element changing.
function track() {
  focused.value = document.activeElement === frame.value;
}
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  timer = setInterval(track, 250);
});
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <div class="embed" :style="{ aspectRatio: props.ratio ?? '16 / 9' }">
    <template v-if="playing">
      <iframe ref="frame" :src="withBase(props.src)" :title="props.title" allow="gamepad; fullscreen" @load="focusGame" />
      <button v-if="!focused" class="refocus" type="button" @click="focusGame">Click to control the game</button>
    </template>
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
.refocus {
  position: absolute;
  left: 50%;
  bottom: 12px;
  transform: translateX(-50%);
  padding: 6px 14px;
  border-radius: 999px;
  background: #11140de6;
  border: 1px solid #cffb2d66;
  color: #cffb2d;
  font: 600 12px var(--vp-font-family-base);
}
.start:focus-visible,
.refocus:focus-visible {
  outline: 2px solid #e7fd96;
  outline-offset: 2px;
}
</style>
