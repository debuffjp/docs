---
title: keiko
description: "keiko (稽古, practice): fast, deterministic tests for web games. Play your real game in Node with no browser, with time, input and randomness under the test's control. Works with Phaser, PixiJS, KAPLAY, Excalibur, three.js and debuff."
---

# keiko

**稽古 (keiko): practice.** Fast, deterministic tests for web games.

keiko runs your real game in Node, with no browser and nothing drawn. Time, input and randomness only move when the test says so, so every run plays out the same way, and a typical test takes tens of milliseconds.

```ts
import { expect, play, test } from "keiko";

test("the player reaches top speed within a quarter second", async () => {
  const game = await play();
  game.press("ArrowRight");
  expect(game.until((s) => s.player.vx >= 140)).toBeAtMost(15);
});
```

<CopyCommand cmd="npm install -D keiko" />

[Get started](./getting-started) · [Engine recipes](./engines) · [API reference](./api)

## Why keiko

Most game bugs are about **behaviour over time**: the jump is a little lower than it was, the enemy turns one frame late, the dash goes through a wall at high speed, the run plays differently twice. Browser automation can't answer those questions well, because it runs in real time and can't step a game. Unit tests can't either, because they test functions, not the game.

keiko plays the game itself, frame by frame, and lets you ask game-shaped questions:

- **How long until?** `game.until((s) => s.player.onGround)` returns the steps it took.
- **Never?** `game.during("3s", (s) => s.player.x >= 0)` fails at the exact step an invariant broke.
- **How high, how fast?** `game.trace("player.y", "1s").min()` measures motion.
- **Across every value we might ship?** `test.sweep(…, { "player.jumpSpeed": [260, 290, 320] }, …)`.
- **The same every time?** `test.deterministic(…)` plays twice with different seeds and diffs every step.

When something fails, keiko shows the game at that moment: the tick, the scene, the state, the line in your test and the console.

## Any engine

keiko works through the web platform, not an engine API. Your game runs in a headless page where `requestAnimationFrame`, timers and the clock are virtual, input arrives as real DOM events, and Canvas 2D and WebGL accept every call. It's verified with:

| Engine | Keyboard | Pointer | Deterministic |
| --- | --- | --- | --- |
| [debuff](./engines#debuff) | ✔ | ✔ | ✔ |
| [Phaser 4](./engines#phaser) | ✔ | ✔ | ✔ |
| [PixiJS 8](./engines#pixijs) | ✔ | ✔ | ✔ |
| [KAPLAY](./engines#kaplay) | ✔ | ✔ | ✔ |
| [Excalibur](./engines#excalibur) | ✔ | ✔ | ✔ |
| [three.js](./engines#three-js) | ✔ | ✔ | ✔ |
| [Hand-written loops](./engines#a-hand-written-loop) | ✔ | ✔ | ✔ |

To read your game's state, expose a snapshot in development builds. That's the only change most games need:

```ts
if (import.meta.env.DEV) window.__KEIKO__ = { state: () => ({ player: { x: player.x, y: player.y }, score }) };
```

## Made for agents too

keiko's results are structured: `npx keiko --json` reports every failure with its message, source line and the game's state. Coding agents can write a test, watch it fail, fix the game and prove it, without a browser. In debuff projects, the MCP server's `run_tests` tool runs them directly.

## Where it fits

keiko covers what the game **does**. It doesn't look at pixels or listen to sound; for that, use screenshot tests in a real browser, such as debuff's [scenarios](/docs/scenarios). Most projects want both: many fast logic tests, a few visual checks.

keiko is MIT licensed and developed in the [debuff repository](https://github.com/debuffjp/debuff/tree/main/tooling/keiko).
