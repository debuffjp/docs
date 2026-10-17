---
title: Keiko API reference
description: "Complete keiko API: test, describe, hooks, play options, Playtest methods, Trace, expect matchers, errors, CLI and runTests."
---

# API reference

```ts
import { afterEach, beforeEach, describe, expect, play, sleep, test } from "keiko";
```

## Tests

| | |
| --- | --- |
| `test(name, fn, { timeout? })` | A test. `fn` is usually async. Default timeout 30 000 ms of real time |
| `test.only(name, fn)` | Run only focused tests |
| `test.skip(name, fn?)` | Registered, not run |
| `test.todo(name)` | A reminder in the report |
| `test.sweep(name, grid, fn, options?)` | One test per combination of param values; `fn(game, values)` |
| `test.deterministic(name, script, options?)` | Play `script(game)` twice and compare every step. `{ sameSeed: true }` keeps `Math.random` the same |
| `describe(name, fn)` | Group tests; `describe.only` and `describe.skip` apply to everything inside |
| `beforeEach(fn)` / `afterEach(fn)` | Run around each test in the file or `describe`. Outer `beforeEach` first; inner `afterEach` first, even after a failure |
| `sleep(ms)` | Wait in real time, even while a game runs |

## `play(options?)`

Returns `Promise<Playtest<S>>`. `S` types `game.state`.

| Option | Default | |
| --- | --- | --- |
| `page` | `"index.html"` | Page to boot |
| `params` | | `{ "group.key": value }`, set before the first step |
| `ready` | first loads done (debuff: a scene is active) | `(game) => boolean`; keiko plays frames while waiting |
| `timeout` | `10000` | Real-time limit for `ready`, in ms |
| `seed` | `1` | `Math.random` seed |
| `fps` | `60` | Virtual clock frame rate |
| `webgl` | `true` (debuff: `false`) | Offer WebGL contexts |

## `Playtest<S>`

**Reading:** `state`, `scene`, `tick`, `time`, `get(path)`, `param(path)`, `params()`, `window`, `stepSeconds`, `driver`.

**Playing** (each returns the playtest):

| | |
| --- | --- |
| `wait(duration = 1)` | Play |
| `press(code)`, `release(code)` | Hold or let go of a key |
| `hold(code, duration)` | Press, wait, release |
| `tap(code)`, `tap(x, y)` | One-step key or pointer press |
| `pointerDown(x, y)`, `pointerMove(x, y)`, `pointerUp()` | Pointer |
| `set(path, value)`, `set(values)` | Params |
| `command(name, ...args)` | Returns the command's result |
| `replay(fileOrScenario)` | Play scenario steps |
| `await settle(timeout?)` | Wait in real time for the game's requests to finish |

**Asking:**

| | Returns |
| --- | --- |
| `until(condition, { within?, message? })` | Steps taken. `TimeoutError` if not within `within` (default `"10s"`) |
| `during(duration, check, message?)` | The playtest. `InvariantError` at the step where `check` returned `false` or threw |
| `trace(pathOrFn, duration)` | A `Trace` |

A **duration** is a step count (`30`) or a time (`"0.5s"`, `"250ms"`).

## `Trace<T>`

`values`, `start`, `first`, `last`, `length`, `at(i)`, `min()`, `max()`, `range()`, `stepOf(valueOrPredicate)`, `every(fn)`, `some(fn)`, `changes()`, `timeAt(step)`, iterable.

## `expect(value)`

`toBe`, `toEqual`, `toBeAbove`, `toBeBelow`, `toBeAtLeast`, `toBeAtMost`, `toBeBetween`, `toBeCloseTo(target, tolerance = 0.001)`, `toBeTruthy`, `toBeFalsy`, `toBeDefined`, `toBeUndefined`, `toContain`, `toHaveLength`, `toMatch`, `toThrow(message?)`, and `.not`.

## Errors

| | |
| --- | --- |
| `ExpectationError` | `actual`, `expected` |
| `GameError` | The game threw: `tick`, `scene`, `cause` |
| `TimeoutError` | `until` ran out of time |
| `InvariantError` | `during` caught a broken invariant |
| `MissingHookError` | A test used a hook the game doesn't expose |

## `window.__KEIKO__`

`state()`, `scene()`, `step(n)` + `stepSeconds`, `press(code)`, `release(code)`, `pointerDown(x, y)`, `pointerMove(x, y)`, `pointerUp()`, `params()`, `setParam(group, key, value)`, `command(name, ...args)`. All optional. See [Exposing your game](./hooks).

## CLI

```text
keiko [files or folders...] [options]

  -t, --filter <text>   Only tests whose name contains this text
      --root <dir>      Project root (default: current folder)
      --json            Machine-readable report
      --debuff          Drive through debuff's dev hooks (default: detected)
      --no-debuff       Drive through __KEIKO__ and the virtual clock
  -h, --help
```

## `keiko/runner`

```ts
import { findTests, formatResult, formatSummary, runTests } from "keiko/runner";

const report = await runTests({ root, files?, filter?, vite?, debuff?, onResult? });
// { ok, passed, failed, skipped, todo, durationMs, results, outside }
```
