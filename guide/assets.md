# Assets

Put source files in `assets/`. The CLI builds a manifest from them. Only files the manifest references are served in dev and shipped in builds, and your sources are never modified.

| File | Asset id | Group |
| --- | --- | --- |
| `assets/logo.png` | `logo` | `default` |
| `assets/level1/map.json` | `level1/map` | `level1` |
| `assets/hero@16x24.png` | `hero` (16×24 sprite grid) | `default` |

Folders become **preload groups**, so you can load a level's assets when you need them.

```ts
import { Assets } from "@debuffjp/assets";
import { Sprite } from "@debuffjp/core";

const assets = new Assets(await (await fetch("assets/manifest.json")).json());
await assets.load("default", ({ loaded, total }) => bar(loaded / total));

const hero = new Sprite({ frames: assets.frames("hero"), animations: { run: { frames: [0, 1, 2, 3], fps: 12 } } });
draw.sprite(assets.frame("coin"), x, y); // any image, wherever it lives
```

## Atlases, automatically

At build time (and in dev), the PNGs in each preload group are packed into one texture atlas. Players download one file instead of dozens, and the renderer binds fewer textures. Packing is lossless and padded against edge bleeding, and `frame()` / `frames()` work the same either way. Images over half the atlas size (backgrounds) stay standalone. Tune or disable it in `debuff.config.ts`:

```ts
export default defineConfig({ assets: { atlas: { maxSize: 2048, padding: 2, exclude: ["ui/"] } } }); // or atlas: false
```

`npx debuff assets` lists every asset, which importer produced it, its size, and anything that looks unused.

## New formats

Asset importers are plugins and can be written in any language. See [Plugins](./plugins#asset-importers).
