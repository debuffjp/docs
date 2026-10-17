<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase } from "vitepress";
import { data as posts } from "../../blog/posts.data";

// Under a blog post: up to three more posts, same category first, then the pinned ones.
const { page } = useData();
const here = computed(() => `/${page.value.relativePath.replace(/\.md$/, "")}`);
const current = computed(() => posts.find((p) => p.url === here.value));
const related = computed(() => {
  if (!current.value) return [];
  const others = posts.filter((p) => p.url !== here.value);
  const same = others.filter((p) => p.category === current.value!.category);
  const pinned = others.filter((p) => p.pinned !== undefined && !same.includes(p)).sort((a, b) => a.pinned! - b.pinned!);
  return [...same, ...pinned].slice(0, 3);
});
</script>

<template>
  <nav v-if="related.length" class="related" aria-label="More posts">
    <h2>Keep reading</h2>
    <ul>
      <li v-for="p in related" :key="p.url">
        <a :href="withBase(p.url)">
          <span class="cat">{{ p.category }}</span>
          <span class="title">{{ p.title }}</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.related { margin-top: 48px; }
.related h2 {
  margin: 0 0 16px;
  font-family: var(--vp-font-family-display);
  font-size: 20px;
  font-weight: 600;
}
ul {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  list-style: none;
  padding: 0;
  margin: 0;
}
a {
  display: block;
  height: 100%;
  padding: 16px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  transition: background 0.2s;
}
a:hover { background: var(--vp-c-default-soft); }
a:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
.cat { display: block; font-size: 12px; color: var(--vp-c-text-2); }
.title { display: block; margin-top: 4px; font-weight: 600; color: var(--vp-c-text-1); line-height: 1.4; }
</style>
