---
title: "Testing a game with deterministic replays and fuzzing"
description: "Games are hard to test, but deterministic games aren't. How a fixed-step clock and seeded RNG enable scenario tests, exact replays and fuzz playtesting for 2D web games."
short: "Replays and fuzzing"
category: Guides
date: 2026-10-17
---

# Testing a game with deterministic replays and fuzzing

Most game bug reports go like this: "I fell through the floor near the second door, I think I was holding left?" Nobody can reproduce it, so nobody fixes it.

The root problem is that most games aren't **deterministic**. Frame timing varies, `Math.random()` gives different numbers every run, and the same inputs produce different outcomes. Fix that, and a whole set of testing tools becomes possible.

## Determinism: the foundation

debuff runs game logic on a **fixed-step clock** (60 steps a second, whatever the display's refresh rate) with a **seeded RNG**. Rendering interpolates between steps so motion stays smooth, but the simulation always advances in identical steps.

So a recording of the seed plus the inputs is a *complete* recording of a session. Play it back and you get the exact same game, every time.

## Scenarios: tests for game feel

A scenario is a JSON script of inputs, waits and expectations, run headless:

```json
{
  "steps": [
    { "press": "ArrowRight" },
    { "wait": 40 },
    { "release": "ArrowRight" },
    { "expect": { "state.player.x": { "gt": 80 } } },
    { "capture": "after-run" }
  ]
}
```

```bash
npx debuff scenario            # run and compare against baselines
npx debuff scenario --update   # accept intentional changes
```

`expect` checks game state, `capture` compares a screenshot with a stored baseline, and `set` changes a param mid-run, so you can test that a higher `jumpSpeed` actually clears a gap. Scenarios run in CI, and they give coding agents a way to prove their changes work.

## Replays: bring the bug back exactly

The dev panel can record a session, then save or copy it as a replay. Attach the file to a bug report and anyone can watch the exact bug happen. Agents can load replays too, through the MCP server's `game_replay` tool.

A replay is just inputs plus a seed, so it can become a scenario as well. Today's bug becomes tomorrow's regression test.

## Fuzzing: random hands, real bugs

Players do things you'd never script. `debuff fuzz` does them too. It plays the game headlessly with random input and reports three kinds of finding:

- **errors**: crashes, with the explained error (whose bug, which line)
- **stuck states**: the game's state stops changing for too long
- **loops**: the state flips between the same values with no new input

Every finding comes with a scenario file that replays the run up to that point.

```bash
npx debuff fuzz --seconds 120 --runs 5
npx debuff fuzz --seed 1234            # repeat a run exactly
```

Because the inputs are seeded too, the same seed always gives the same inputs. Run it in CI, or ask your agent to fuzz the game after a big change.

> `debuff fuzz` lands in the next release.

## Get started

```bash
npm create debuff@latest my-game
```

New projects ship with a scenario you can copy from.
