---
title: Getting started with Keiko
description: "Install keiko, expose your game's state, write your first test and run it with npx keiko."
---

# Getting started

## Requirements

- Node.js 22 or later.
- A game that loads through an `index.html` with `<script type="module" src="…">`, as Vite projects do. Keiko uses your project's Vite config if it has one, so aliases and plugins work.

## Install

```bash
npm install -D keiko
```

Using debuff? New projects already have keiko and example tests. Run them with `npx debuff test` and skip to [Playing the game](./playing).

## Expose your game's state

Tests assert on a snapshot of your game. Add one in development builds, as JSON-friendly data:

```ts
// src/main.ts
if (import.meta.env.DEV) {
  window.__KEIKO__ = {
    state: () => ({ player: { x: player.x, y: player.y, vx: player.vx }, score, lives }),
    scene: () => currentScene, // optional
  };
}
```

`import.meta.env.DEV` is false in production builds, so bundlers drop this code. Put in what you'll want to check: positions, speeds, counts, flags. For TypeScript, add `import type {} from "keiko";` to that file to type `window.__KEIKO__`.

You don't need anything else to play the game: Keiko steps your `requestAnimationFrame` loop and sends real keyboard and pointer events. See [Exposing your game](./hooks) for params, commands and engines with their own fixed step.

## Write a test

Create `tests/game.test.ts`:

```ts
import { expect, play, test } from "keiko";

interface State {
  player: { x: number; y: number; vx: number };
  score: number;
  lives: number;
}

test("the player walks right while ArrowRight is held", async () => {
  const game = await play<State>();
  const start = game.state.player.x;
  game.hold("ArrowRight", "1s");
  expect(game.state.player.x).toBeAbove(start + 50);
});
```

If you use TypeScript, add `"tests"` to `include` in `tsconfig.json`.

## Run it

```bash
npx keiko
```

```text
keiko 稽古 · practice for web games

pass tests/game.test.ts › the player walks right while ArrowRight is held 41 ms

✔ 1 passed in 612 ms
```

Keiko finds `*.test.ts` (and `.js`, `.mts`, `.mjs`) files in `tests/` and `src/`. The first test takes longer while Vite warms up; after that each game boots in tens of milliseconds.

## What `play()` does

1. Opens a fresh headless page and loads your `index.html`'s markup.
2. Runs the page's module scripts (your game) through Vite, on a virtual clock with a seeded `Math.random()`.
3. Waits for the game's first network requests (assets, data) to finish, and for `ready` if you passed one.
4. Plays the first frame, as a browser paints before a player can act.

Each `play()` is a brand-new game. Nothing carries over between tests.

## Next

- [Playing the game](./playing): time, input, params and commands.
- [Asking game questions](./questions): `until`, `during` and `trace`.
- [Engine recipes](./engines): Phaser, PixiJS, KAPLAY, Excalibur, three.js.
