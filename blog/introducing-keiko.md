---
title: "Introducing Keiko: fast, deterministic tests for web games"
description: "keiko runs your real web game in Node with no browser, on a virtual clock, so you can test timing, motion and rules in milliseconds. It works with Phaser, PixiJS, KAPLAY, Excalibur, three.js and debuff."
short: "Introducing Keiko"
category: Keiko
date: 2026-10-17
---

# Introducing Keiko

Games are hard to test for a reason that has nothing to do with games being special: they run on time. A browser plays a game in real time, at whatever frame rate the machine manages, with input arriving whenever it arrives. Run the same test twice and you get two slightly different games.

So most web games aren't tested at all, beyond someone playing them. Bugs that live in timing, like a jump that got a little lower or a dash that clips through walls at high speed, are found by players.

**Keiko** (稽古, Japanese for "practice") is our answer. It's a test runner that plays your real game in Node, with no browser, and puts time under the test's control.

```ts
import { expect, play, test } from "keiko";

test("the player reaches top speed within a quarter second", async () => {
  const game = await play();
  game.press("ArrowRight");
  expect(game.until((s) => s.player.vx >= 140)).toBeAtMost(15);
});
```

```bash
npm install -D keiko
npx keiko
```

## Time belongs to the test

Keiko loads your game's `index.html` into a headless page and runs its scripts. Everything that tells time is virtual: `requestAnimationFrame`, `setTimeout` and `setInterval`, `performance.now()`, `Date.now()`. `Math.random()` is seeded. A frame only happens when the test asks for one.

That makes a game a deterministic function of its input, and tests become exact. Ten seconds of play take a fraction of a second, and they come out the same every time.

## Questions games actually ask

Most test runners give you `expect(value).toBe(…)`. Games need more than snapshots, so keiko adds ways to watch play unfold:

- `until` measures **how long** something takes: time to top speed, time to land.
- `during` checks that something **never** happens: leaving the screen, negative health.
- `trace` records a value **over time**, for jump heights and speed curves.
- `test.sweep` runs a test across **every param value** you might ship.
- `test.deterministic` plays a script twice, with different random seeds, and **diffs every frame**.

When something fails, keiko shows you the game at that moment:

```text
fail tests/movement.test.ts › stops in speed ÷ acceleration [player.speed=300] 40 ms
  ExpectationError: expected 60 to be 0
  at tests/movement.test.ts:33:21
  game tick 42 (0.70s) · scene play
  state {"player":{"x":309,"vx":60},"pops":0,"particles":0}
```

## Any engine

Keiko doesn't use an engine's API. It works through the platform every web game already uses: frames, timers, DOM events, Canvas 2D and WebGL, which in keiko accept every call and draw nothing. We've verified it with Phaser, PixiJS, KAPLAY, Excalibur, three.js and hand-written loops. Each needs one line to let tests read its state:

```ts
if (import.meta.env.DEV) window.__KEIKO__ = { state: () => ({ player: { x: player.x, y: player.y }, score }) };
```

The [engine recipes](/keiko/engines) have a working game and test for each.

## Built with debuff, for everyone

Keiko started inside [debuff](/), our toolkit for 2D browser games, and debuff integrates it deeply: `npx debuff test`, a `run_tests` tool for coding agents, and example tests in every new project. But keiko doesn't depend on debuff, and it's documented as its own tool. If you have a web game, it's for you.

It's especially good with coding agents. There's no browser to drive, feedback takes milliseconds, and failures describe the game rather than a stack trace. An agent can write a test, watch it fail, change the game and prove the fix.

## What it doesn't do

Keiko doesn't render or play sound, so it can't tell you whether something looks or sounds right. Keep a few screenshot tests in a real browser for that. Use keiko for the hundreds of things your game *does*.

[Read the docs](/keiko/) or [get started](/keiko/getting-started).
