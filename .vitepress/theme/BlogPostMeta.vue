<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase } from "vitepress";

// Above a blog post: a link back to the blog and the publication date.
const { page, frontmatter } = useData();
const isPost = computed(() => /^blog\/(?!index\.md$)/.test(page.value.relativePath));
const date = computed(() => new Date(frontmatter.value.date).toISOString().slice(0, 10));
const label = computed(() =>
  new Date(`${date.value}T00:00:00Z`).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }),
);
</script>

<template>
  <p v-if="isPost" class="post-meta">
    <a :href="withBase('/blog/')">Blog</a> · <time :datetime="date">{{ label }}</time>
  </p>
</template>

<style scoped>
.post-meta {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
</style>
