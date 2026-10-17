<script setup lang="ts">
import { computed, ref } from "vue";
import { withBase } from "vitepress";
import { BLOG_CATEGORIES } from "../../blog/categories";
import { data as posts } from "../../blog/posts.data";

const pinned = computed(() => posts.filter((p) => p.pinned !== undefined).sort((a, b) => a.pinned! - b.pinned!));
const groups = computed(() =>
  BLOG_CATEGORIES.map((name) => ({ name, posts: posts.filter((p) => p.category === name) })).filter((g) => g.posts.length),
);
const current = ref(0);
const track = ref<HTMLElement>();

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

/** Show slide `i`. Smooth scrolling only when the reader hasn't asked for reduced motion. */
function go(i: number) {
  const n = pinned.value.length;
  current.value = (i + n) % n;
  const slide = track.value?.children[current.value] as HTMLElement | undefined;
  if (!slide || !track.value) return;
  const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  track.value.scrollTo({ left: slide.offsetLeft - track.value.offsetLeft, behavior: smooth ? "smooth" : "auto" });
}

/** Keep the dots in sync when the reader swipes or scrolls the track directly. */
function onScroll() {
  const el = track.value;
  if (!el) return;
  current.value = Math.round(el.scrollLeft / el.clientWidth);
}

function onKey(e: KeyboardEvent) {
  if (e.key === "ArrowRight") go(current.value + 1);
  else if (e.key === "ArrowLeft") go(current.value - 1);
  else return;
  e.preventDefault();
}
</script>

<template>
  <div class="blog">
    <section
      v-if="pinned.length"
      class="carousel"
      aria-roledescription="carousel"
      aria-label="Pinned posts"
      @keydown="onKey"
    >
      <div ref="track" class="track" @scroll.passive="onScroll">
        <article
          v-for="(post, i) in pinned"
          :key="post.url"
          class="slide"
          role="group"
          aria-roledescription="slide"
          :aria-label="`${i + 1} of ${pinned.length}`"
          :aria-hidden="i !== current"
        >
          <p class="kicker">Pinned · {{ formatDate(post.date) }}</p>
          <h2><a :href="withBase(post.url)" :tabindex="i === current ? 0 : -1">{{ post.title }}</a></h2>
          <p class="desc">{{ post.description }}</p>
          <a class="read" :href="withBase(post.url)" :tabindex="i === current ? 0 : -1" aria-hidden="true">Read the post</a>
        </article>
      </div>
      <div v-if="pinned.length > 1" class="controls">
        <button type="button" class="arrow" aria-label="Previous post" @click="go(current - 1)">←</button>
        <div class="dots">
          <button
            v-for="(post, i) in pinned"
            :key="post.url"
            type="button"
            class="dot"
            :aria-label="`Show post ${i + 1}: ${post.title}`"
            :aria-current="i === current"
            @click="go(i)"
          />
        </div>
        <button type="button" class="arrow" aria-label="Next post" @click="go(current + 1)">→</button>
      </div>
    </section>

    <section v-for="g in groups" :key="g.name" class="group">
      <h2 :id="g.name.toLowerCase().replace(/\s+/g, '-')" class="all">{{ g.name }}</h2>
      <ul class="list">
        <li v-for="post in g.posts" :key="post.url">
          <a :href="withBase(post.url)">{{ post.title }}</a>
          <time :datetime="post.date">{{ formatDate(post.date) }}</time>
          <p>{{ post.description }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.carousel {
  margin: 24px 0 40px;
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}
.track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.track::-webkit-scrollbar { display: none; }
.slide {
  flex: 0 0 100%;
  scroll-snap-align: start;
  padding: 32px 32px 16px;
}
.kicker {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.slide h2 {
  margin: 8px 0 12px;
  padding: 0;
  border: 0;
  font-size: 28px;
  line-height: 1.2;
}
.slide h2 a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}
.slide h2 a:hover { text-decoration: underline; }
.desc {
  margin: 0 0 20px;
  color: var(--vp-c-text-2);
  max-width: 60ch;
}
.read {
  display: inline-block;
  padding: 8px 18px;
  border-radius: 999px;
  background: #cffb2d;
  color: #11140d;
  font-weight: 600;
  text-decoration: none;
}
.read:hover { background: #ddfc6c; }
.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 32px 24px;
}
.arrow {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.arrow:hover { background: var(--vp-c-default-soft); }
.dots { display: flex; gap: 8px; }
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-text-3);
}
.dot[aria-current="true"] { background: var(--vp-c-brand-1); }
.carousel button:focus-visible,
.carousel a:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
.all { margin-top: 0; }
.list { list-style: none; padding: 0; }
.list li { margin: 0 0 24px; }
.list li a { font-weight: 600; font-size: 18px; }
.list time {
  display: block;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.list p { margin: 4px 0 0; }
@media (max-width: 640px) {
  .slide { padding: 24px 20px 12px; }
  .slide h2 { font-size: 22px; }
  .controls { padding: 0 20px 20px; }
}
</style>
