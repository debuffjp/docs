---
title: "Testing game feel: assert on rules, not frames"
description: "How to write game tests that survive tuning: measure time-to-condition with until, check invariants with during, trace motion over time, and sweep params, with keiko."
short: "Testing game feel"
category: Keiko
date: 2026-10-17
---

# Testing game feel: assert on rules, not frames

The first game test most people write looks like this:

```ts
game.hold("ArrowRight", 30);
expect(game.state.player.x).toBe(230);
```

It passes, and then it breaks the first time someone touches the acceleration. The number 230 was never a rule; it was a measurement of today's tuning. Tests like this make tuning painful, so people stop tuning or stop testing.

Feel lives in rules: **how quickly** the player reaches top speed, **how high** a jump goes relative to its speed, **whether** the player can ever pass through a wall. Here's how to test those with [keiko](/keiko/).

## Time to a condition

"The player reaches top speed in under a quarter second" is a rule about time. `until` plays until a condition holds and tells you how long it took:

```ts
game.press("ArrowRight");
const steps = game.until((s) => s.player.vx >= game.param("player.speed"), { within: "1s" });
expect(steps * game.stepSeconds).toBeBelow(0.25);
```

The test reads the top speed from the game's own params, so it keeps working when you change it.

## Physics as a formula

A jump with launch speed *v* and gravity *g* peaks at *v²/2g*. If that's how your jump is meant to work, test the formula, not the pixels:

```ts
test.sweep("jump height follows v²/2g", { "player.jumpSpeed": [200, 290, 400] }, (game, values) => {
  game.press("Space");
  const y = game.trace("player.y", "1s");
  const v = Number(values["player.jumpSpeed"]);
  const g = Number(game.param("player.gravity"));
  expect(y.start - y.min()).toBeCloseTo((v * v) / (2 * g), 6);
});
```

`trace` records the player's height every frame; `test.sweep` runs the check at three jump speeds. If a future change adds an air-control quirk that clips the apex at high speeds, this test says which speed broke.

## Things that must never happen

Some rules are invariants: the player never leaves the level, health never goes negative, the camera never shows outside the map. `during` checks them after every frame:

```ts
game.press("ArrowLeft");
game.during("5s", (s) => s.player.x >= 0, "the player stays inside the level");
```

When it breaks, it tells you the exact frame, which is often the clue you need for a tunnelling bug.

## Stopping distance

Deceleration is a rule too: with acceleration *a* and speed *v*, stopping takes *v/a* seconds.

```ts
test.sweep("stops in speed ÷ acceleration", { "player.speed": [80, 140, 300] }, (game) => {
  game.hold("ArrowRight", "0.5s");
  const steps = game.until((s) => s.player.vx === 0, { within: "1s" });
  const expected = Number(game.param("player.speed")) / Number(game.param("player.accel"));
  expect(steps * game.stepSeconds).toBeCloseTo(expected, game.stepSeconds);
});
```

When we wrote the first version of this test, it asserted "stops within a fifth of a second", and it failed at speed 300. That wasn't a bug in the game: the claim was wrong. Writing the rule down properly is half the value of the test.

## When a frame-exact test is right

Sometimes exact numbers are the point: a fighting game's frame data, a puzzle's solution, a replay that must match. Then pin them down, and make sure the game is deterministic first:

```ts
test.deterministic("the opening is frame-exact", (game) => {
  game.hold("ArrowRight", 20).tap("KeyZ").wait(40);
});
```

## The habit

1. Write the rule in words: "the player reaches top speed in under a quarter second".
2. Find the measurement that captures it: time, height, distance or an invariant.
3. Read numbers from the game's params instead of copying them.
4. Sweep the params you expect to tune.

Tests written this way get **more** useful as you tune, because they tell you which rules a change bent.

More in [Asking game questions](/keiko/questions) and [Sweeps and determinism](/keiko/determinism).
