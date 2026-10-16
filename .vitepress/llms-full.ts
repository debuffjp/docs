import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** Guides in reading order: what an agent should know first comes first. */
const ORDER = [
  "getting-started",
  "why",
  "concepts",
  "drawing",
  "input",
  "assets",
  "tilemaps",
  "params",
  "scenarios",
  "agents",
  "plugins",
  "desktop",
  "no-build",
];

/**
 * Write `llms-full.txt`: every guide as plain markdown in one file, so an agent can read all of the
 * docs in a single request. Generated from the same sources as the pages, so it can't drift.
 */
export function writeLlmsFull(srcDir: string, outDir: string, canonical: string): void {
  const parts = [
    "# debuff: full documentation",
    "",
    `> All debuff guides in one file, generated from ${canonical}. Index: ${canonical}/llms.txt · API reference: ${canonical}/api/`,
    "",
  ];
  for (const name of ORDER) {
    const raw = readFileSync(join(srcDir, "guide", `${name}.md`), "utf8");
    const body = raw
      .replace(/^---\n[\s\S]*?\n---\n/, "") // frontmatter
      .replace(/^:::\s*\w+.*$/gm, "") // container openers like "::: info Status"
      .replace(/^:::\s*$/gm, "") // container closers
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    parts.push(`<!-- source: ${canonical}/guide/${name} -->`, "", body, "", "---", "");
  }
  writeFileSync(join(outDir, "llms-full.txt"), `${parts.join("\n").trim()}\n`);
}
