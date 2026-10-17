---
title: "Coding agents and browser game engines: how debuff compares"
description: "What a coding agent can actually do in debuff (MCP, live attach, notes, replays, scenarios, fuzz) and what Phaser, PixiJS, KAPLAY, Excalibur and Godot offer agents today."
short: "Coding agents: how debuff compares"
category: Coding agents
date: 2026-10-17
pinned: 1
---

# Coding agents and browser game engines: how debuff compares

A coding agent can write game code in any engine. What differs is what it can check afterwards. Without help, an agent edits source, maybe runs a build, and then asks you whether the jump feels right. That last step is where most of the time goes.

debuff is built around closing that gap. The agent should be able to see the running game, reproduce what you saw, and prove a change worked before it asks you anything. This post describes how that works, then looks at what the main alternatives offer agents as of October 2026, including where they are clearly ahead.

## The debuff side

Everything below ships in debuff 0.2 (`npm create debuff@latest`).

### An MCP server, already wired up

New projects include a `.mcp.json` that starts [`@debuffjp/mcp`](https://github.com/debuffjp/debuff/tree/main/tooling/mcp), so MCP clients that read it, such as Claude Code, pick it up with no setup. The server has project tools (`inspect_project`, `list_assets`, `build`, `run_scenarios`, `fuzz`) and game tools (`game_start`, `game_step`, `game_input`, `game_state`, `game_capture`, `game_frames`, `game_errors`, `game_params`, `game_set_param`, `game_notes`, `game_replay`, `game_pause`, `game_stop`).

### Live attach to the game you have open

If you have the game open under `npm run dev`, `game_start` attaches to that tab instead of starting a new one. The dev overlay shows an agent badge, and every pause, step and param change the agent makes appears in the overlay's activity log, where you can undo it. You both look at the same game.

If nothing is open, or the agent asks for `mode: "headless"`, it gets a private copy in a headless browser. Time only advances when it calls `game_step`, so what it sees is reproducible.

### Overlay notes, read with `game_notes`

When something looks wrong, you type a note into the overlay ("jump feels floaty here"). The agent reads it through `game_notes`, together with the tick, the scene's `inspect()` state at that moment and the frames leading up to it. You don't have to describe the situation in chat, because the evidence comes with the note.

### `game_replay`: reproduce what you saw

The dev tools record every key, pointer and param change from page load. `game_replay` with a note's tick saves everything up to that moment as a scenario in `.debuff/replays/`. debuff runs on fixed steps with a seeded RNG, so that file replays your session exactly. Anything a replay can't reproduce, such as slow motion, is listed in its `warnings`.

### Typed params

Feel values are declared with `game.params.define(...)`: type, default, range and units. The agent reads them with `game_params` and changes them with `game_set_param`, which checks the range. Tuning a value doesn't need a code change, and you see the result in your own tab.

### Deterministic scenarios

Scenarios are JSON scripts of steps, inputs, expectations on `inspect()` state, and screenshot captures. `npm test` runs them in a headless browser and compares captures with baselines. They are how a change gets verified, and a replay or a fuzz finding is just another scenario.

### Fuzz

`npx debuff fuzz` plays the game with random but plausible input (movement held, actions tapped) for simulated minutes. Each crash, stuck state (`inspect()` stops changing) or back-and-forth loop is saved as a scenario in `.debuff/fuzz/` that replays it. The same `--seed` repeats a run, and the command exits non-zero on findings, so it can gate CI.

### Explained errors

`game_errors` doesn't return a bare stack trace. Each error has a `kind` (`your-code`, `debuff-usage`, `debuff-bug` or `outside`), a source-mapped file and line, and a hint. An agent can tell a bug in your game from a misuse of the API, and a `debuff-bug` comes with a `reportUrl` rather than an invitation to patch around engine internals.

### AGENTS.md and prompts

New projects include an `AGENTS.md` (commands, layout, work loop, rules) and a `CLAUDE.md` that points to it. The MCP server also offers five prompts, `playtest`, `fix-errors`, `tune-feel`, `add-mechanic` and `explain-stutter`, which clients like Claude Code show as slash commands. Each one keeps creative calls with you: the agent proposes options, and you choose.

## What the alternatives offer agents

We checked each engine's official sites and repositories, and the best-known community projects, on 17 October 2026. "None found" means we looked and didn't find one, not that none exists.

| | debuff | Phaser | PixiJS | KAPLAY | Excalibur | Godot (web export) |
| --- | --- | --- | --- | --- | --- | --- |
| Official MCP server | Yes, for the running game | Yes, for Phaser Editor scenes | None found | None found | None found | None (community servers) |
| llms.txt | Yes, plus llms-full.txt | Yes (examples index) | Yes, plus llms-full.txt | No (404) | No (404) | No (404) |
| Official agent guidance | AGENTS.md in new projects, MCP prompts | 28 skills in the main repo | Official skills repo | None found | None found | None found |
| Agent attaches to a running game | Yes, live or headless | No | No | No | No | Community MCP: debug run and output |
| Automated testing | Scenarios, fuzz | `HEADLESS` renderer | Not checked | Not checked | Screenshot testing package | `--headless`, GUT, gdUnit4 |

### Phaser

Phaser has the most agent material of the web engines. phaser.io serves an [llms.txt](https://phaser.io/llms.txt), although it indexes the v4 examples rather than the docs ([docs.phaser.io/llms.txt](https://docs.phaser.io/llms.txt) returns 404). The main repository ships a [`skills/`](https://github.com/phaserjs/phaser/tree/master/skills) folder of 28 topic skills, including one for migrating from v3 to v4. There is an official [Phaser Editor MCP server](https://github.com/phaserjs/editor-mcp-server), but it edits scenes in Phaser Editor v5; it doesn't inspect or step a running game. Phaser defines a [`HEADLESS` renderer](https://github.com/phaserjs/phaser/blob/master/src/const.js) for running without drawing.

Where Phaser is stronger: maturity, a large community (about 40k GitHub stars), many years of examples and tutorials, built-in physics, a visual editor, and far more features. If your game needs those, Phaser is the safer choice today.

### PixiJS

PixiJS publishes [llms.txt](https://pixijs.com/llms.txt) and llms-full.txt, and its [LLM page](https://pixijs.com/llms) points agents to the official [pixijs-skills](https://github.com/pixijs/pixijs-skills) repository: around 25 skills for v8, installable with `npx skills add` or as a Claude Code plugin. That is good, current documentation for agents. We found no MCP server.

PixiJS is a renderer, not a game engine, so the game loop, input, scenes and testing are up to you or other libraries. Where it's stronger: rendering performance and features, the largest ecosystem of the web options (about 48k stars), and a long production track record.

### KAPLAY

KAPLAY is friendly and quick to start with, and its component model is easy for agents to write. On the agent side we found little: [llms.txt](https://kaplayjs.com/llms.txt) returns 404, and its [AI guide](https://kaplayjs.com/docs/guides/ai/) is about game AI (state machines and rule systems), not coding agents. The only MCP server we found is a small community docs server. Where it's stronger: a gentle API, an online playground, and a bigger, more established community than debuff's.

### Excalibur

Excalibur is a TypeScript-first engine with a clear API. It has a testing package, [`@excaliburjs/testing`](https://www.npmjs.com/package/@excaliburjs/testing), which drives the game with Puppeteer and compares screenshots. That's the closest thing in this list to debuff's scenarios. We found no llms.txt ([404](https://excaliburjs.com/llms.txt)) and no MCP server. Where it's stronger: more features out of the box, such as physics, and years of releases.

### Godot (web export)

Godot isn't a web engine, but many browser games are made with it, and it has the most agent tooling of the five, all community-built. [Coding-Solo/godot-mcp](https://github.com/Coding-Solo/godot-mcp) (about 6k stars) launches the editor, runs projects in debug mode, captures their output and edits scenes. [hi-godot/godot-ai](https://github.com/hi-godot/godot-ai) is another popular one. Godot runs [headless from the command line](https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html), and [GUT](https://github.com/bitwes/Gut) and gdUnit4 are mature test frameworks. The docs don't serve an llms.txt ([404](https://docs.godotengine.org/llms.txt)).

Where Godot is stronger: almost everything an engine can have. A full editor, 2D and 3D, an asset library, the biggest community (about 118k stars), and a mature scripting language. If you want an editor or 3D, use Godot.

## What's actually different

Phaser and PixiJS give agents good documentation, and Godot's community has built MCP servers that run the project and read its output. What we didn't find anywhere else is a loop between you and the agent on the same running web game. You flag a moment, and the agent receives the state at that tick. It reproduces the moment exactly as a scenario, tunes typed params in your tab where you can undo them, and verifies the fix with scenarios and fuzz.

Size is the other measurable difference. The whole debuff runtime is smaller than any of the web engines here:

<SizeChart />

That is a narrow advantage, and it comes with real costs. debuff is young (0.x) and 2D only. It has no editor, a small community and few third-party resources. We haven't measured how often agents succeed in each engine, so we don't claim they finish games faster in debuff. We can only describe what each engine lets an agent check.

For a broader comparison with each engine, see [debuff vs Phaser](./debuff-vs-phaser), [PixiJS](./debuff-vs-pixijs), [KAPLAY](./debuff-vs-kaplay), [Excalibur](./debuff-vs-excalibur), [Godot](./debuff-vs-godot) and [Babylon.js](./debuff-vs-babylonjs).

To try the loop yourself, the walkthrough [Build a game with Claude Code and debuff](./build-a-game-with-claude-code) goes through it step by step.
