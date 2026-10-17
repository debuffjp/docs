import { createContentLoader } from "vitepress";

export interface Post {
  title: string;
  description: string;
  url: string;
  date: string;
  category: string;
  /** Position in the carousel (1 first); absent means not pinned. */
  pinned?: number;
}

declare const data: Post[];
export { data };

/** Every post in blog/, newest first. Pinning is a frontmatter field: `pinned: 1`. */
export default createContentLoader("blog/*.md", {
  transform(raw): Post[] {
    return raw
      .filter((page) => !page.url.endsWith("/blog/"))
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title,
        description: frontmatter.description,
        url,
        category: frontmatter.category ?? "Guides",
        date: new Date(frontmatter.date).toISOString().slice(0, 10),
        pinned: typeof frontmatter.pinned === "number" ? frontmatter.pinned : undefined,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  },
});
