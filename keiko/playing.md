---
title: Playing the game
description: "Drive a game in keiko tests: durations, keyboard and pointer input, params, commands, and waiting for lazy loads."
---

# Playing the game

`play()` returns a **playtest**: your game, paused, waiting for instructions. Methods that play return the playtest, so short scripts read as one line:

```ts
const game = await play();
game.press("ArrowRight").wait("0.5s").release("ArrowRight").tap("Space");
```

## Time

Nothing moves until the test plays it. A **duration** is a number of steps or a time:

```ts
game.wait();        // one step
game.wait(30);      // 30 steps
game.wait("0.5s");  // half a second: 30 steps at 60 per second
game.wait("250ms"); // 15 steps
```

A step is one frame of the virtual clock (1/60 s by default, `play({ fps })` to change it), or one fixed step of an engine that steps itself, such as debuff. `game.stepSeconds` tells you which.

During a step, keiko advances `performance.now()` and `Date.now()`, fires the timers (`setTimeout`, `setInterval`, `requestIdleCallback`) that fall due, then runs `requestAnimationFrame` callbacks, as a browser does. Gameplay built on timers ("a wave every 2 seconds") steps exactly like gameplay in your loop.

## Keyboard

Keys are `KeyboardEvent.code` values: `"ArrowLeft"`, `"KeyZ"`, `"Space"`, `"Enter"`, `"Escape"`, `"ShiftLeft"`, `"Digit1"`.

```ts
game.press("ArrowRight");          // hold down
game.release("ArrowRight");        // let go
game.hold("KeyZ", "0.2s");         // press, wait, release
game.tap("Space");                 // a press for one step
```

Each key arrives as real `keydown`/`keyup` events with `code`, `key` and the legacy `keyCode`, sent to the focused element or the game's canvas and bubbling to `document` and `window`. So it works whether your game listens on the window, the document or the canvas.

## Pointer

Coordinates are in the canvas's own pixels:

```ts
game.tap(160, 90);            // press and release, one step
game.pointerDown(40, 40);     // hold
game.pointerMove(120, 40);    // drag
game.pointerUp();
```

Keiko sends pointer, mouse and click events to the first `<canvas>`, with every position field a browser fills in (`clientX`, `pageX`, `offsetX`, `x`). The canvas reports its own size as its position on the page, so engines that map through the canvas's box get the point you aimed at.

## Params

If your game exposes tunable values ([how](./hooks#params)), tests can read and set them:

```ts
game.set("player.speed", 300);
game.set({ "player.gravity": 1200, "player.coyote": 0 });
game.param("player.speed"); // 300
game.params();              // { player: { speed: 300, gravity: 1200, coyote: 0 } }

const tuned = await play({ params: { "player.jumpSpeed": 320 } }); // set before the first step
```

## Commands

Commands are shortcuts your game offers to tests, like warping to a level or granting an item, so tests don't have to play through the whole game to reach what they check:

```ts
game.command("warp", "level-3");
```

## Waiting for loads

`play()` waits for the game's first requests to finish. If the game loads more later (a level's assets on demand), wait for those with `settle()`. It waits in real time; game time doesn't move:

```ts
game.command("load-level", 2);
await game.settle();
game.wait("1s");
```

To wait in real time for any other reason, use keiko's `sleep(ms)`. Inside a running game, `setTimeout` is the game's virtual timer.

## Randomness and the clock

`Math.random()` is seeded (`play({ seed })`, default 1) and `Date.now()` starts at a fixed date, so a game that uses them still plays the same way each run. To catch logic that *depends* on them, see [Determinism](./determinism).

## Reading the game

```ts
game.state;               // your snapshot: __KEIKO__.state(), or debuff's inspect()
game.scene;               // __KEIKO__.scene(), or debuff's active scene
game.tick;                // steps played since boot
game.time;                // simulated seconds since boot
game.get("state.player.x");
game.window;              // the page, for globals and the DOM
```
