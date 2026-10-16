<script setup lang="ts">
import { ref } from "vue";

/** `label` is what is shown (defaults to the command); `cmd` is what gets copied. */
const props = defineProps<{ cmd: string; label?: string; size?: "sm" | "lg" }>();
const copied = ref(false);
const text = ref<HTMLElement>();
let timer: ReturnType<typeof setTimeout> | undefined;

/** Clipboard API first; older or locked-down browsers fall back to a hidden text field. Always copies `cmd`. */
async function write(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.append(field);
    field.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    field.remove();
    return ok;
  }
}

async function copy() {
  if (!(await write(props.cmd))) {
    // Nothing worked: select the command so it can be copied by hand.
    const range = document.createRange();
    if (text.value) range.selectNodeContents(text.value);
    getSelection()?.removeAllRanges();
    getSelection()?.addRange(range);
    return;
  }
  copied.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => (copied.value = false), 1600);
}
</script>

<template>
  <button class="cmd" :class="props.size ?? 'sm'" type="button" :title="`Copy: ${props.cmd}`" @click="copy">
    <span class="prompt" aria-hidden="true">$</span>
    <code ref="text">{{ props.label ?? props.cmd }}</code>
    <span class="state" aria-live="polite">
      <template v-if="copied">copied</template>
      <svg v-else viewBox="0 0 16 16" aria-label="copy" role="img"><path d="M5 2h7a2 2 0 0 1 2 2v7h-1.5V4a.5.5 0 0 0-.5-.5H5zM2 6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm2-.5a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5z" /></svg>
    </span>
  </button>
</template>

<style scoped>
.cmd {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  text-align: left;
  transition: border-color 0.2s;
}
.cmd:hover,
.cmd:focus-visible {
  border-color: var(--vp-c-brand-1);
}
.cmd:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
.cmd.sm {
  font-size: 12px;
}
.cmd.lg {
  font-size: 16px;
  padding: 12px 16px;
  border-radius: 12px;
}
.prompt {
  color: var(--vp-c-brand-1);
  user-select: none;
}
code {
  background: none !important;
  padding: 0;
  font-size: inherit;
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
.state {
  margin-left: auto;
  min-width: 3.4em;
  display: inline-flex;
  justify-content: flex-end;
  color: var(--vp-c-brand-1);
  font-size: 11px;
}
.state svg {
  width: 14px;
  height: 14px;
  fill: var(--vp-c-text-3);
}
.cmd:hover .state svg {
  fill: var(--vp-c-brand-1);
}
@media (prefers-reduced-motion: reduce) {
  .cmd {
    transition: none;
  }
}
</style>
