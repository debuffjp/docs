# debuff docs

Source for [debuff.jp](https://debuff.jp): the home page, guides, examples, benchmarks, roadmap and API reference. Built with [VitePress](https://vitepress.dev); the API reference is generated from the [debuff](https://github.com/debuffjp/debuff) sources with TypeDoc.

```bash
git clone https://github.com/debuffjp/debuff ../debuff   # API reference reads its sources
(cd ../debuff && npm ci)
npm install
npm run dev
```

| Path | What's there |
| --- | --- |
| `docs/` | Guides, served at `/docs/` (old `/guide/*` links redirect via `public/_redirects`) |
| `examples/` | Live demos embedded in pages, such as the plinko board (typechecked in `npm run build`) |
| `public/play/` | Production builds of playable example games |
| `.vitepress/theme/` | Theme components: `PlinkoHero`, `PlayEmbed`, `CopyCommand` |

`npm run build` also writes the sitemap, `llms.txt` and `llms-full.txt`. `npm run deploy` publishes to the Cloudflare Worker behind debuff.jp, and a GitHub Pages mirror is built by CI.

Fix anything you spot: every page has an "Edit this page" link.
