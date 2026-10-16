<script setup lang="ts">
import { withBase } from "vitepress";
</script>

<template>
  <div class="not-found">
    <img :src="withBase('/buff-confused.svg')" alt="buff looking confused" width="120" height="120" />
    <h1>404</h1>
    <p>buff looked everywhere, but this page isn't here.</p>
    <a :href="withBase('/')">take me home</a>
  </div>
</template>

<style scoped>
.not-found { display: grid; place-items: center; gap: 12px; padding: 96px 24px; text-align: center; }
.not-found img { animation: wobble 2.4s ease-in-out infinite; }
h1 { font-family: var(--vp-font-family-display); font-size: 72px; font-weight: 800; line-height: 1; color: var(--vp-c-brand-1); margin: 8px 0 0; }
p { color: var(--vp-c-text-2); font-size: 18px; margin: 0; }
a { margin-top: 12px; padding: 8px 18px; border-radius: 999px; background: var(--vp-c-brand-1); color: #11140d; font-weight: 600; text-decoration: none; }
@keyframes wobble { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg) translateY(-4px); } }
@media (prefers-reduced-motion: reduce) { .not-found img { animation: none; } }
</style>
