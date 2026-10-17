---
title: "Build a game with Claude Code and debuff"
description: "A hands-on walkthrough: set up a debuff game with Claude Code, flag a moment and have the agent reproduce it with game_replay, tune params, and verify with scenarios and fuzz."
short: "Build a game with Claude Code"
category: Coding agents
date: 2026-10-17
pinned: 2
---

# Build a game with Claude Code and debuff

This walkthrough takes a new debuff project from an empty folder to a change that's been tuned, reproduced and verified, with Claude Code doing the implementation and you making the calls. It uses the `basic` template, where buff, the debuff mascot, slides left and right and pops. The same loop works in any debuff game.

You need Node.js and [Claude Code](https://claude.com/claude-code). Any MCP client works; the commands below are what Claude Code shows.

## 1. Set up

```bash
npm create debuff@latest my-game
cd my-game
npm install
```

The new project already has what the agent needs:

- `.mcp.json` starts the debuff MCP server, `@debuffjp/mcp`.
- `AGENTS.md` lists the commands, the layout, the work loop and the rules. `CLAUDE.md` points to it.
- `scenarios/move-and-pop.json` is a first test, with screenshot baselines.

Start the dev server and open the URL it prints:

```bash
npm run dev
```

Then start Claude Code in the same folder:

```bash
claude
```

Claude Code asks once whether to trust the project's MCP server. Approve it, and `/mcp` should list `debuff` as connected.

## 2. Live or headless

Ask the agent to look at the game. It calls `game_start`, which picks a mode for you:

- **Live**, when your browser has the game open under `npm run dev`. The agent attaches to your tab and pauses it. The dev overlay (toggle it with the backtick key) shows an **agent** badge, and its log tab lists everything the agent does, each with an undo. `game_stop` resumes your game and disconnects.
- **Headless**, when nothing is open, or when the agent asks for `mode: "headless"`. It gets a private copy in a headless browser, and time moves only when it calls `game_step`. That makes it good for checks that must come out the same every time.

Use live when you want to watch and steer, and headless for unattended work like fuzzing or checking a fix.

## 3. Flag a moment and have the agent reproduce it

Play for a bit. When something looks or feels wrong, open the overlay's **log** tab, type into the field ("flag this moment for the agent…"), and press <kbd>Enter</kbd>:

> buff overshoots when I let go of the arrow key

Then tell the agent to look at your notes. It calls `game_notes` and gets your words, the tick, the scene's `inspect()` state at that tick, and the frames before it. You don't need to explain where buff was or what you pressed.

Next, ask it to reproduce the moment. It calls `game_replay` with the note's tick:

```json
{ "file": ".debuff/replays/replay-tick-412.json", "ticks": 412, "steps": 37, "warnings": [] }
```

That file is a scenario containing every key, pointer and param change since the page loaded. debuff uses fixed steps and a seeded RNG, so running it replays your session exactly:

```bash
npx debuff scenario .debuff/replays/replay-tick-412.json
```

Now the agent has a reproduction it can run as often as it likes, and so do you. `warnings` lists anything the replay couldn't capture, such as slow motion. You can also save or copy a replay yourself from the same log tab.

## 4. Tune

Overshoot is a feel problem, and feel lives in params. The template declares buff's movement like this:

```ts
const tuning = game.params.define("player", {
  speed: { type: "number", default: 140, min: 0, max: 600, units: "px/s" },
  accel: { type: "number", default: 1200, min: 0, max: 5000, units: "px/s²" },
});
```

The agent reads these with `game_params` and changes them with `game_set_param`, which rejects values outside the range. The quickest way in is the `tune-feel` prompt, which Claude Code shows as a slash command:

```
/mcp__debuff__tune-feel stop faster when I let go
```

The prompt tells the agent to propose two or three variants, each a small set of param changes with a reason, and to wait for your go-ahead before trying one. It applies a variant in your tab, plays a few seconds and captures a frame. You try it, undo it from the overlay if you don't like it, and pick. Only then does it write the chosen defaults into `game.params.define(...)`.

You can do the same by hand in the overlay's **tune** tab, which has a slider for every param.

## 5. Verify with scenarios and fuzz

A change isn't done until it's been checked. Two commands do that, and the agent runs both because `AGENTS.md` tells it to.

**Scenarios.** `npm test` runs `scenarios/*.json` headless, checks each `expect` against `inspect()` state, and compares captures with their baselines:

```bash
npm test
```

The replay from step 3 can become a regression test: ask the agent to copy it into `scenarios/` and add an `expect` on the state that was wrong, such as buff's `vx` a few ticks after release. If a capture changes on purpose, the agent should show you the diff image and ask before accepting it with `npx debuff scenario --update`.

**Fuzz.** `npx debuff fuzz` plays the game with random but plausible input for simulated minutes:

```bash
npx debuff fuzz
```

Each crash, stuck state or back-and-forth loop is saved as a scenario in `.debuff/fuzz/` that replays it exactly. To fix a finding, the agent replays that file with `npx debuff scenario <file>`, fixes the cause, and replays it again until it passes. `--seed` repeats a run, and the command exits non-zero when it finds something, so you can run it in CI.

If a runtime error shows up along the way, `game_errors` explains it. `kind` says whose problem it is (`your-code`, `debuff-usage`, `debuff-bug` or `outside`), and `where` gives the source line. The `fix-errors` prompt walks the agent through fixing and re-checking.

## 6. Creative calls stay with you

The agent does the implementing, reproducing, tuning runs and testing. You decide what the game should be. That split is written into the tools:

- `AGENTS.md` and every MCP prompt tell the agent that art, feel, difficulty, story and names are yours, and to propose two or three options instead of deciding.
- Param changes in live mode show up in your overlay with an undo.
- Screenshot baselines change only with your approval.

In practice that means the agent comes back with "here are three ways to make the stop snappier, with captures" rather than a finished decision. You still play it, and you still choose.

## Next

- [Working with AI agents](/docs/agents): the interfaces in one table.
- [Testing with scenarios](/docs/scenarios): the scenario format in full.
- [Tunable params](/docs/params): types, ranges and the tune tab.
- [How debuff compares with other engines for coding agents](./coding-agents-and-browser-game-engines).
