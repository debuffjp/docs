# Assets

Put source files in `assets/`. The CLI builds a manifest from them. Only files the manifest references are served in dev and shipped in builds, and your sources are never modified.

| File | Asset id | Group |
| --- | --- | --- |
| `assets/logo.png` | `logo` | `default` |
| `assets/level1/map.json` | `level1/map` | `level1` |
| `assets/hero@16x24.png` | `hero` (16×24 sprite grid) | `default` |

Folders become **preload groups**, so you can load a level's assets when you need them.

```ts
import { Assets } from "@debuff/assets";
import { Sprite, sliceGrid } from "@debuff/core";

const assets = new Assets(await (await fetch("assets/manifest.json")).json());
await assets.load("default", ({ loaded, total }) => bar(loaded / total));

const { grid } = assets.entry("hero");
const hero = new Sprite({
  frames: sliceGrid(assets.image("hero"), grid!.frameWidth, grid!.frameHeight),
  animations: { run: { frames: [0, 1, 2, 3], fps: 12 } },
});
```

`npx debuff assets` lists every asset, which importer produced it, its size, and anything that looks unused.

## New formats

Asset importers are plugins and can be written in any language. See [Plugins](./plugins#asset-importers).
