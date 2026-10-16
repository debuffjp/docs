---
description: "The core ideas in debuff: the Game, scenes, the fixed-step loop, camera, seeded random, params, hooks and how they fit together."
---

# Core concepts

## Game

`Game` owns the canvas, the loop and the shared services: `camera`, `random`, `params`, `stats`, `hooks`, `inspect`.

```ts
import { Game } from "@debuffjp/core";

const game = new Game({ canvas, width: 320, height: 180, scale: "integer", pixelArt: true });
```

Game code always works in **logical units** (here 320×180). The canvas scales to its container and keeps its backing store sharp on high-DPI screens.

| `scale` | Behaviour |
| --- | --- |
| `fit` (default) | Fill the container, keep the aspect ratio |
| `integer` | Whole-pixel scales only, for crisp pixel art |
| `none` | Logical size in CSS pixels |

## Scenes

A scene is a plain object. Every method is optional:

```ts
game
  .add({
    id: "play",
    enter() {},
    update(dt) {}, // fixed step, seconds
    render(draw, alpha) {}, // draw in logical units; alpha interpolates between steps
    exit() {},
    inspect: () => ({ score }), // JSON for tools and tests
  })
  .go("play");
game.start();
```

## The fixed-step loop

The simulation advances in exact steps (default 1/60 s), whatever the display's refresh rate. Rendering gets `alpha` so movement can be interpolated smoothly. Combined with the seeded `game.random`, the same inputs always produce the same game, which is what makes scenario tests reproducible.

- `game.freeze(0.08)`: hit-stop. Simulation pauses, rendering continues.
- `game.timeScale = 0.5`: slow motion.
- The loop pauses automatically when the tab is hidden.

## Hooks and plugins

`game.hooks` exposes `beforeUpdate`, `afterUpdate`, `beforeRender`, `afterRender` and `sceneChange`. `game.use(plugin)` installs reusable behaviour built on them. See [Plugins](./plugins).
