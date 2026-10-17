---
title: Asking game questions
description: "Test game feel and behaviour over time with keiko: until for timing, during for invariants, trace for motion, plus expect matchers."
---

# Asking game questions

A snapshot tells you where things are. Games are about how things **move**, so keiko has three ways to watch play unfold.

## `until`: how long until?

`until` plays until a condition holds and returns how many steps it took. It fails, with the last state, if the condition doesn't hold within `within` (default `"10s"`):

```ts
game.press("ArrowRight");
const steps = game.until((s) => s.player.vx >= 140, { within: "1s" });
expect(steps * game.stepSeconds).toBeBelow(0.25); // top speed in under a quarter second
```

This is how to test **feel**. "Where is the player after 15 steps" breaks whenever you tune; "the player reaches top speed in under a quarter second" is the rule you actually care about.

```text
TimeoutError: (s) => s.player.onGround didn't hold within 120 steps (2.00s).
Last state: {"player":{"x":212,"y":-40,"onGround":false}}
```

## `during`: never?

`during` plays for a while and checks an invariant after every step. Return `false`, or throw (so `expect` works inside), to fail. The error names the step:

```ts
game.press("ArrowLeft");
game.during("3s", (s) => s.player.x >= 0, "the player stays on screen");

game.during("10s", (s) => {
  expect(s.lives).toBeAtLeast(0);
  expect(s.enemies.length).toBeAtMost(20);
});
```

```text
InvariantError: the player stays on screen broke after 97 steps (1.62s) (tick 98).
State: {"player":{"x":-3,"y":120}}
```

## `trace`: how high, how fast?

`trace` plays for a while and records a value after every step, by path or function:

```ts
game.press("Space");
const y = game.trace("player.y", "1.5s");

expect(y.start - y.min()).toBeAbove(40);    // rises at least 40 px (y grows downward)
expect(y.stepOf(y.min())).toBeBelow(30);    // peaks within half a second
expect(y.last).toBe(y.start);               // lands where it took off
```

A trace has `start` (the value before the first step), `first`, `last`, `at(i)`, `min()`, `max()`, `range()`, `stepOf(valueOrPredicate)`, `every()`, `some()`, `changes()` and `timeAt(step)`, and you can iterate it. Paths trace numbers by default; say otherwise with `trace<boolean>("player.onGround", "1s")`.

## `expect`

| Matcher | Passes when |
| --- | --- |
| `toBe(v)` | `Object.is(actual, v)` |
| `toEqual(v)` | Structurally equal; the failure names the first path that differs |
| `toBeAbove(n)`, `toBeBelow(n)` | `>`, `<` |
| `toBeAtLeast(n)`, `toBeAtMost(n)` | `>=`, `<=` |
| `toBeBetween(min, max)` | Inclusive range |
| `toBeCloseTo(target, tolerance = 0.001)` | Within the tolerance |
| `toBeTruthy()`, `toBeFalsy()`, `toBeDefined()`, `toBeUndefined()` | |
| `toContain(item)`, `toHaveLength(n)`, `toMatch(re)` | Arrays and strings |
| `toThrow(message?)` | A function that throws |

Every matcher has `.not`. Game numbers are rarely exact, so prefer ranges for positions and speeds, and `toBe` for counts, flags and names.

## Writing good game tests

- **Assert on rules, not frames.** "Stops within speed ÷ acceleration" survives tuning; "x is 309 at tick 42" doesn't.
- **Use params in assertions.** Read `game.param("player.gravity")` instead of copying the number into the test.
- **Reach the interesting part quickly.** Use commands to warp to a level rather than playing through.
- **Name tests as behaviour.** The report reads like a spec: "a held jump rises at least 30 px and lands where it took off".
