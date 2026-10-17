---
title: Exposing your game
description: "The window.__KEIKO__ hooks: state, scene, params, commands, custom stepping and input, for testing any web game with keiko."
---

# Exposing your game

keiko can play any game without help: it steps the virtual clock and sends real input events. To **read** the game and reach its tuning, add `window.__KEIKO__` in development builds. Every hook is optional.

```ts
if (import.meta.env.DEV) {
  window.__KEIKO__ = {
    state: () => ({ player: { x: player.x, y: player.y }, score }),
    scene: () => currentScene,
    params: () => ({ player: { speed: tuning.speed, gravity: tuning.gravity } }),
    setParam: (group, key, value) => {
      if (group === "player") tuning[key] = value;
    },
    command: (name, ...args) => {
      if (name === "warp") return loadLevel(args[0]);
    },
  };
}
```

For types, add `import type {} from "keiko";` to that file. It's erased from the build.

## State

`state()` returns what tests read as `game.state`. Keep it small and JSON-friendly: numbers, strings, booleans, arrays and plain objects. Round values players can't see the difference in (`Math.round(x)`), so tests don't break on floating-point noise.

```ts
state: () => ({
  player: { x: Math.round(player.x), y: Math.round(player.y), onGround: player.onGround },
  enemies: enemies.map((e) => ({ kind: e.kind, hp: e.hp })),
  score,
}),
```

## Scene

`scene()` returns the active scene's or screen's name, read as `game.scene`. It's handy for `ready` and for assertions like "the game is over":

```ts
const game = await play({ ready: (g) => g.scene === "level-1" });
```

## Params

Params are the numbers you tune: speeds, gravity, timings. Exposing them lets tests set them (`game.set`, `play({ params })`) and sweep them (`test.sweep`):

```ts
params: () => ({ player: { ...tuning } }),
setParam: (group, key, value) => {
  if (group !== "player" || !(key in tuning)) throw new Error(`Unknown param ${group}.${key}`);
  tuning[key] = value;
},
```

Throwing on unknown params catches typos in tests.

## Commands

Commands let tests skip ahead: warp to a level, grant an item, set up a situation. Keep test-only shortcuts here rather than in your game's normal code paths:

```ts
command: (name, ...args) => {
  switch (name) {
    case "warp": return loadLevel(String(args[0]));
    case "give": return inventory.add(String(args[0]));
    default: throw new Error(`Unknown command ${name}`);
  }
},
```

## Engines with their own fixed step

By default one test step is one frame of the virtual clock, and your `requestAnimationFrame` loop runs. If your engine has a deterministic fixed-step update you can call directly, expose it, and steps go straight to it:

```ts
step: (n) => {
  for (let i = 0; i < n; i++) world.update(1 / 60);
},
stepSeconds: 1 / 60,
```

Timers still advance with each step.

## Input

Input arrives as DOM events by default. If your game reads input another way (a virtual controller, a network feed), take it directly:

```ts
press: (code) => controller.down(code),
release: (code) => controller.up(code),
pointerDown: (x, y) => cursor.press(x, y),
pointerMove: (x, y) => cursor.move(x, y),
pointerUp: () => cursor.release(),
```

## debuff games

debuff games don't need `__KEIKO__`: keiko drives them through debuff's dev tools, so state is the scene's `inspect()`, and params and commands are debuff's. See [the debuff recipe](./engines#debuff).
