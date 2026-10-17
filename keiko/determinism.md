---
title: Sweeps and determinism
description: "Run the same keiko test across param values with test.sweep, and prove a game is deterministic with test.deterministic."
---

# Sweeps and determinism

## Sweeps: every value you might ship

Tuning changes numbers, and a mechanic that works at today's jump speed can break at tomorrow's. `test.sweep` runs the same test across params, one test per combination, each on a fresh game with those params set:

```ts
test.sweep(
  "jump height follows jump speed",
  { "player.jumpSpeed": [200, 290, 400] },
  (game, values) => {
    game.press("Space");
    const y = game.trace("player.y", "1s");
    const v = Number(values["player.jumpSpeed"]);
    const g = Number(game.param("player.gravity"));
    expect(y.start - y.min()).toBeCloseTo((v * v) / (2 * g), 6); // v² / 2g
  },
);
```

```text
pass jump height follows jump speed [player.jumpSpeed=200]
pass jump height follows jump speed [player.jumpSpeed=290]
pass jump height follows jump speed [player.jumpSpeed=400]
```

With several params, every combination runs:

```ts
test.sweep("clears the first gap", { "player.jumpSpeed": [260, 290, 320], "player.gravity": [800, 900] }, (game) => {
  game.hold("ArrowRight", "0.4s").tap("Space");
  game.until((s) => s.player.x > 120, { within: "2s" });
});
```

Sweeps need the game to expose params; see [Exposing your game](./hooks#params). Pass `{ play: { … } }` as a fourth argument for other `play()` options.

## Determinism: the same every time

Replays, recorded bug reports, multiplayer lockstep and keiko tests themselves rely on one property: **the same input gives the same game**. It breaks quietly, through a `Math.random()` in an enemy's AI or a `Date.now()` in a cooldown.

`test.deterministic` plays a script twice on fresh games and compares the state after every step. The second run gets a different `Math.random()` seed and a different date, so anything that depends on unseeded randomness or the wall clock shows up:

```ts
test.deterministic("ten seconds of play are reproducible", (game) => {
  game.hold("ArrowRight", "2s").tap("Space").wait("8s");
});
```

```text
✖ the two runs diverged at tick 37: state.enemies.0.x was 112 in the first run and 118 in the second.
  Look for Math.random(), Date.now() or real-time timers in game logic: use a seeded generator
  and the time step your loop passes in.
```

### Fixing what it finds

- **Randomness:** use a seeded generator (debuff's `game.random`, Phaser's `Phaser.Math.RND.sow([seed])`, or a small one like mulberry32) and seed it once.
- **Time:** use the `dt` your loop receives, not `Date.now()` differences.
- **Iteration order:** iterate arrays rather than objects whose keys change shape.

If your engine seeds its own generator from `Math.random()` on purpose, check everything else with `{ sameSeed: true }`:

```ts
test.deterministic("physics is reproducible", (game) => game.hold("ArrowRight", "3s"), { sameSeed: true });
```
