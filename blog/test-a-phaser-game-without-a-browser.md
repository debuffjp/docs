---
title: "How to test a Phaser game without a browser"
description: "Write fast, deterministic tests for a Phaser 4 game with keiko: run the real game in Node, hold keys, click, and check movement and timing, with no browser."
short: "Test a Phaser game without a browser"
category: keiko
date: 2026-10-17
---

# How to test a Phaser game without a browser

Phaser games are usually tested by playing them. That works until the game grows: a change to the jump breaks a level you didn't replay, or a refactor makes an enemy turn one frame late. This guide adds automated tests to a Phaser game with [keiko](/keiko/), which runs the real game in Node, with no browser and no changes to how Phaser runs.

It assumes a Vite project with Phaser 4. The same steps work for Phaser 3.

## 1. Install keiko

```bash
npm install -D keiko
```

## 2. Let tests read the game

keiko can already play your game: it steps Phaser's loop on a virtual clock and sends real keyboard and pointer events. To check what happened, expose a snapshot of the state you care about, in development builds only:

```ts
// src/main.ts
const game = new Phaser.Game(config);

if (import.meta.env.DEV) {
  window.__KEIKO__ = {
    state: () => {
      const level = game.scene.getScene("level") as Level;
      if (!level?.player) return undefined; // not built yet
      return {
        player: { x: Math.round(level.player.x), y: Math.round(level.player.y), onGround: level.player.body.blocked.down },
        score: level.score,
      };
    },
    scene: () => game.scene.getScenes(true)[0]?.scene.key,
  };
}
```

Phaser builds scenes over its first frames, so `state()` returns `undefined` until the level exists. Tests wait for that.

## 3. Write a test

```ts
// tests/player.test.ts
import { expect, play, test } from "keiko";

const ready = (g) => g.scene === "level" && g.state !== undefined;

test("the player runs right while the arrow key is held", async () => {
  const game = await play({ ready });
  const start = game.state.player.x;
  game.hold("ArrowRight", "1s");
  expect(game.state.player.x).toBeAbove(start + 100);
});

test("a jump leaves the ground and lands again", async () => {
  const game = await play({ ready });
  game.until((s) => s.player.onGround, { within: "2s" });
  game.press("Space");
  const y = game.trace("player.y", "1.5s");
  expect(y.start - y.min()).toBeAbove(40);
  expect(game.state.player.onGround).toBe(true);
});

test("clicking the coin collects it", async () => {
  const game = await play({ ready });
  game.tap(220, 140).wait(2);
  expect(game.state.score).toBe(1);
});
```

`game.hold`, `game.tap` and `game.wait` play frames: one step is one frame at 60 per second, and durations can be steps (`30`) or time (`"0.5s"`). Phaser's `delta` comes from the virtual clock, so movement is the same every run. Pointer coordinates are in game pixels, and keiko fills in `pageX`, which Phaser reads, so taps land exactly where you aim.

## 4. Run it

```bash
npx keiko
```

```text
pass tests/player.test.ts › the player runs right while the arrow key is held 212 ms
pass tests/player.test.ts › a jump leaves the ground and lands again 96 ms
pass tests/player.test.ts › clicking the coin collects it 41 ms

✔ 3 passed in 1180 ms
```

No browser is launched. Phaser runs with its WebGL or Canvas renderer against contexts that accept every call and draw nothing.

## 5. Make it deterministic

Phaser's random generator, `Phaser.Math.RND`, seeds itself from the clock unless you seed it. keiko fixes `Math.random()` and the clock for each game, but to make your game reproducible everywhere, including replays and bug reports, seed it yourself:

```ts
Phaser.Math.RND.sow(["my-game"]);
```

Then let keiko prove it:

```ts
test.deterministic("thirty seconds of play are reproducible", (game) => {
  game.hold("ArrowRight", "5s").tap("Space").wait("25s");
}, { play: { ready } });
```

If anything depends on unseeded randomness or the wall clock, keiko names the first value that differed and the frame where it happened.

## Next

- Test feel, not frames: [asking game questions](/keiko/questions) with `until`, `during` and `trace`.
- Expose params and commands to sweep jump heights or warp to a level: [Exposing your game](/keiko/hooks).
- Run it in CI: [Replays, CI and agents](/keiko/replays-and-ci).
