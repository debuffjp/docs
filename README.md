# Debuff docs

Source for the Debuff documentation site. Built with [VitePress](https://vitepress.dev); the API reference is generated from the [debuff](https://github.com/debuffjp/debuff) sources with TypeDoc.

```bash
git clone https://github.com/debuffjp/debuff ../debuff   # API reference reads its sources
(cd ../debuff && npm ci)
npm install
npm run dev
```

Guides live in `guide/`. Fix anything you spot: every page has an "Edit this page" link.
