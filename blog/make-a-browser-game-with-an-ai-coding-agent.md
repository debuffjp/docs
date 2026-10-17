---
title: "How to make a browser game with an AI coding agent"
description: "Build a 2D browser game with Claude Code or another coding agent. The agent can play the game, read its state and check its own changes, and the creative calls stay with you."
date: 2026-10-17
---

# How to make a browser game with an AI coding agent

Coding agents are good at writing game code. Most of them are bad at knowing whether that code *works*. They can't see the screen, they don't know the player fell through the floor, and an error in the game loop often looks like silence. So you end up as the agent's eyes: run the game, describe what went wrong, paste the error, repeat.

debuff is an open-source toolkit for 2D browser games, built so the agent can see for itself. This guide goes from an empty folder to a game an agent can play, inspect and test. You still make the creative calls.

## What you need

- Node.js 22 or newer
- A coding agent that supports MCP, such as Claude Code
- About a minute

## 1. Create the game

```bash
npm create debuff@latest my-game
cd my-game
npm install
npm run dev
```

Open the URL it prints. You have a running game. Press <kbd>&#96;</kbd> to open the dev panel.

Want a head start on a genre? Add `-- --template platformer` for a tilemap platformer, or `-- --template mossfell` for a top-down adventure.

## 2. Connect your agent

New projects already include `.mcp.json`, `AGENTS.md` and `CLAUDE.md`. Start your agent in the project folder and it picks up the debuff MCP server automatically. There's nothing to configure.

With `npm run dev` running and the game open in your browser, the agent **attaches to that tab**. Whatever it does shows up in your dev panel, so you can watch it.

## 3. Let the agent look before it edits

Without debuff, an agent reads your code and guesses. With the MCP server it can:

- **read the live game state**: positions, scene, params
- **capture frames**, so it sees what you see
- **send input**, to play the game itself
- **read explained errors**: whose bug it is (yours or the engine's) and the source line
- **read your notes**: moments you flagged while playing ("the jump feels floaty here")

Try a prompt like:

> Play the game for a bit and tell me what feels off with the jump. Don't change anything yet.

## 4. Tune feel with sliders, not rewrites

Game feel lives in numbers: jump height, gravity, coyote time. debuff turns these into **live params**, which show up as sliders in the dev panel (with undo) and as values the agent can set through MCP.

That's better than a code change for both of you. The agent proposes values, you play and judge, and the numbers you like get copied back into the code.

## 5. Make the agent prove its changes

Ask the agent to back every change with a **scenario**: a deterministic, headless run with scripted inputs and screenshot baselines.

```bash
npx debuff scenario
```

Because debuff runs on a fixed-step clock with a seeded RNG, a scenario plays out the same way every time. If a change breaks landing on one-way platforms, the scenario catches it before you do. `debuff fuzz` goes further: it plays randomly for minutes at a time and reports crashes and stuck states, each with a replay file.

## 6. Ship it

```bash
npx debuff build
```

You get a static build you can host anywhere on the web, with a size report. The starter ships at about 13 kB brotli. The build also fails if dev-only code leaks into production.

## Keep the creative calls

The agent is great at plumbing: collisions, input bindings, asset loading, fixing the bug you flagged. The world, the feel and the story are yours. debuff's agent instructions say so explicitly, so agents propose alternatives instead of deciding art direction for you.

## Next steps

- [Agent guide](/docs/agents)
- [Why debuff](/docs/why)
- Agents can start from [llms.txt](/llms.txt)
