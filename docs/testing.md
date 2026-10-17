---
description: "Fast logic tests for browser games with keiko: play the real game in Node with no browser, on a virtual clock, and assert on timing, motion and state. Works with debuff and any other web game."
---

# Logic tests with Keiko

**Keiko** (稽古, "practice") runs your real game in Node, with no browser and nothing drawn. Time, input and randomness only move when the test says so, so every run plays out the same way, and a typical test takes tens of milliseconds.

```ts
// tests/movement.test.ts
import { expect, play, test } from "keiko";

test("buff reaches top speed within a quarter second", async () => {
  const game = await play();
  game.press("ArrowRight");
  expect(game.until((s) => s.player.vx >= 140)).toBeAtMost(15);
});
```

<CopyCommand cmd="npx debuff test" />

Use logic tests for how the game **behaves**: movement, timing, rules, scenes, params. Use [scenarios](./scenarios) for how it **looks**, since they compare screenshots in a real browser. New projects have both, and `npm test` runs logic tests first, then scenarios.

Keiko is its own package and works with any web game, not just debuff. This page covers using it in a debuff project; the [keiko docs](/keiko/) are the full guide and reference.

## Your first test

New projects from `npm create debuff` already have `tests/` with examples. In an older project:

```bash
npm install -D keiko
```

Then add `"tests"` to `include` in `tsconfig.json`, and create `tests/game.test.ts`:

```ts
import { expect, play, test } from "keiko";

test("the game starts in the play scene", async () => {
  const game = await play();
  expect(game.scene).toBe("play");
});
```

`play()` boots the code your `index.html` loads, through the same Vite setup as `npm run dev`, in a fresh headless page. The game is paused at tick 0 until the test plays it. `game.state` is whatever your scene's `inspect()` returns, so put what you want to test there:

```ts
inspect: () => ({ player: { x: Math.round(player.x), vx: Math.round(player.vx) }, score }),
```

Give `play` the shape for autocompletion: `play<{ player: { x: number; vx: number }; score: number }>()`.

## Playing the game

Every call that plays returns the game, so short scripts read as one line:

```ts
game.press("ArrowRight").wait("0.5s").release("ArrowRight");
game.hold("ArrowLeft", 30);      // press, play 30 steps, release
game.tap("Space");               // a press for one step
game.tap(160, 90);               // a pointer press at logical coordinates
game.set("player.speed", 300);   // params, validated against their ranges
game.command("warp", "hollow");  // a command from devTools({ commands })
```

Durations are steps (`30`) or time (`"0.5s"`, `"250ms"`). At the default 60 steps per second, `"0.5s"` is 30 steps.

## Asking game questions

Snapshots tell you where things are. Games usually need to know how things *move*.

**How long until?** `until` plays until a condition holds and returns the steps it took, or fails with the last state if it never does:

```ts
game.press("ArrowRight");
const steps = game.until((s) => s.player.vx >= 140, { within: "1s" });
expect(steps * game.stepSeconds).toBeBelow(0.25);
```

**Never?** `during` checks an invariant after every step and fails at the step where it broke:

```ts
game.press("ArrowLeft");
game.during("3s", (s) => s.player.x >= 8, "buff stays on screen");
```

**How high? How fast?** `trace` records a value every step:

```ts
game.press("Space");
const y = game.trace("player.y", "1.5s");
expect(y.start - y.min()).toBeAbove(30); // rises at least 30 px (y grows downward)
expect(y.last).toBe(y.start);            // and lands where it took off
```

A trace has `start`, `first`, `last`, `at(i)`, `min()`, `max()`, `range()`, `stepOf()`, `every()`, `some()` and `changes()`.

## Sweeps: every value you might ship

Tuning changes numbers. A sweep runs the same test across params, one test per combination, so you know the mechanic holds across the range, not just at today's defaults:

```ts
test.sweep("jump height follows jump speed", { "player.jumpSpeed": [200, 290, 400] }, (game, values) => {
  game.press("Space");
  const y = game.trace("player.y", "1s");
  const v = Number(values["player.jumpSpeed"]);
  const g = Number(game.param("player.gravity"));
  expect(y.start - y.min()).toBeCloseTo((v * v) / (2 * g), 6);
});
```

A failure names the combination that broke: `jump height follows jump speed [player.jumpSpeed=400]`.

## Determinism

Replays, scenarios and bug reports only work if the same input always gives the same game. `test.deterministic` plays a script twice and compares the state after every step. The second run gets a different `Math.random()` seed and date, so logic that sneaks around `game.random` or the fixed step is caught:

```ts
test.deterministic("ten seconds of play are reproducible", (game) => {
  game.hold("ArrowRight", "2s").tap("Space").wait("8s");
});
```

```text
✖ the two runs diverged at tick 37: state.enemies.0.x was 112 in the first run and 118 in the second.
```

## Bugs become tests

A replay saved from the dev overlay, a moment an agent reproduced with `game_replay`, or a crash `debuff fuzz` found: they're all scenario files, and `replay` plays them in milliseconds:

```ts
test("the wall-clip bug stays fixed", async () => {
  const game = await play();
  game.replay(".debuff/fuzz/stuck-run-2.json");
  expect(game.state.player.x).toBeAtLeast(8);
});
```

`capture` steps are skipped, since nothing is drawn.

## When a test fails

Every failure shows the game at the moment it broke:

```text
fail tests/movement.test.ts › stops in speed ÷ acceleration [player.speed=300] 40 ms
  ExpectationError: expected 60 to be 0
  at tests/movement.test.ts:33:21
  game tick 42 (0.70s) · scene play
  state {"player":{"x":309,"vx":60},"pops":0,"particles":0}
```

If the game itself throws, the error says which step and scene, with the line in your game's source. Console output from the test and the game is shown for failing tests only.

## Running tests

```bash
npx debuff test                    # every test in tests/ and src/
npx debuff test tests/jump.test.ts # some files
npx debuff test -t pause           # tests whose name contains "pause"
npx debuff test --json             # a report for tools and agents
```

Agents run them with the MCP server's `run_tests` tool, and the `add-mechanic`, `fix-errors` and `tune-feel` workflows ask for a test for each change. See [Working with AI agents](./agents).

## Other engines

Keiko drives games through the web platform rather than an engine API, so it isn't tied to one engine. It's verified with Phaser, PixiJS, KAPLAY, Excalibur and three.js; see the [engine recipes](/keiko/engines).

- `requestAnimationFrame`, `performance.now()` and `Date.now()` run on a virtual clock, and `Math.random()` is seeded. Each step is one frame.
- Input arrives as real keyboard and pointer events.
- To read state, expose a snapshot as `window.__KEIKO__` in development builds:

```ts
if (import.meta.env.DEV) {
  window.__KEIKO__ = {
    state: () => ({ player: { x: player.x, y: player.y }, score }),
    scene: () => game.scene.getScenes(true)[0]?.scene.key,
  };
}
```

Then run `npx keiko`. Every hook is optional; see [Exposing your game](/keiko/hooks).

## What isn't covered

Nothing is drawn or heard: rendering and audio contexts accept every call and do nothing. Use scenarios for anything visual. More in [How keiko works](/keiko/how-it-works).
