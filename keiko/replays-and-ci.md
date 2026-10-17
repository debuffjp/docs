---
title: Replays, CI and agents
description: "Turn recorded sessions into keiko regression tests, run keiko in CI with JSON reports, and let coding agents write and run tests."
---

# Replays, CI and agents

## Bugs become tests

`game.replay()` plays a list of steps: a JSON file or an object. It's the scenario format debuff uses for overlay replays and fuzz findings, and any tool can write it:

```json
{
  "steps": [
    { "press": "ArrowRight" },
    { "wait": 40 },
    { "release": "ArrowRight" },
    { "tap": [160, 90] },
    { "set": { "player.speed": 300 } },
    { "command": "warp", "args": ["level-2"] },
    { "expect": { "state.player.x": { "gt": 80 } } }
  ]
}
```

```ts
test("the wall-clip bug stays fixed", async () => {
  const game = await play();
  game.replay("bugs/wall-clip.json");
  expect(game.state.player.x).toBeAtLeast(8);
});
```

Steps are `wait`, `press`, `release`, `tap`, `pointerDown`, `pointerMove`, `pointerUp`, `set`, `command` and `expect` (with `eq`, `gt`, `gte`, `lt`, `lte` and `approx` comparisons). `capture` steps are skipped, since nothing is drawn.

A good habit: when you find a bug, record the inputs that cause it, make a test that replays them and fails, fix the game, and keep the test.

## Running in CI

```bash
npx keiko
```

keiko exits with 1 when a test fails, so it gates CI as is. Useful flags:

```bash
npx keiko tests/levels        # a folder
npx keiko -t "boss"           # tests whose name contains "boss"
npx keiko --json > report.json
```

The JSON report lists every result with its status and duration; failures carry the message, `where` (the source line in your test), the game's tick, time, scene and state, and the console output. Errors a game raised outside any test are in `outside`.

A GitHub Actions step:

```yaml
- run: npm ci
- run: npx keiko
```

No browser to install: keiko runs in Node.

## From code

Tools can run tests directly:

```ts
import { formatResult, runTests } from "keiko/runner";

const report = await runTests({ root: process.cwd(), onResult: (r) => console.log(formatResult(r)) });
process.exitCode = report.ok ? 0 : 1;
```

## Coding agents

keiko suits agents well: no browser, fast feedback, and failures that describe the game instead of a stack trace. A loop that works:

1. Write a test for the behaviour you want, and run it to watch it fail.
2. Change the game.
3. Run the tests until they pass, then keep the test.

Tell your agent to run `npx keiko --json` after every change. In debuff projects the MCP server's `run_tests` tool does this, and new projects' `AGENTS.md` already asks agents to write a test for each mechanic.
