---
title: "debuff vs Excalibur: comparing two TypeScript game engines for the web"
description: "debuff and Excalibur.js compared for 2D browser games: built-in features, size, testing tools and coding-agent support, with where Excalibur is ahead."
date: 2026-10-17
---

# debuff vs Excalibur

Excalibur and debuff are both TypeScript-first toolkits for 2D browser games. Excalibur aims to be "batteries included" and has been doing it for years. debuff is younger and smaller, and focuses on determinism, testing and coding agents. Here's how they compare as of October 2026.

## Short answer

Pick **Excalibur** if you want more built-in systems today: physics, Tiled and LDtk plugins, UI and a mature API. Pick **debuff** if you want a smaller runtime, deterministic tests and fuzzing, and an agent that can attach to your running game.

## At a glance

| | debuff 0.2 | Excalibur 0.32.0 |
| --- | --- | --- |
| License | MIT | BSD-2-Clause |
| Language | TypeScript | TypeScript |
| Rendering | WebGL2, Canvas 2D fallback | WebGL and Canvas ([docs](https://excaliburjs.com/docs/)) |
| Physics | Tile collision | Built in |
| Tilemaps | Tiled and LDtk | Tiled and LDtk plugins |
| Audio, input, scenes, tweens, particles | Built in | Built in |
| Full runtime, brotli | 20 kB (every debuff package) | 118 kB (`excalibur.min.js`) |
| Testing | Scenarios, screenshot baselines, fuzz | [`@excaliburjs/testing`](https://www.npmjs.com/package/@excaliburjs/testing): Puppeteer and screenshot comparison |
| Coding agents | MCP server for the running game, `AGENTS.md` | No llms.txt ([404](https://excaliburjs.com/llms.txt)), no MCP server found |
| Community | Small | Established (Discord, GitHub Discussions) |

<SizeChart only="excalibur" />

## Where Excalibur is stronger

- **Built-in systems.** Physics, actions, a UI layer and official tilemap plugins mean less to write yourself. debuff has no rigid-body physics.
- **Maturity.** Years of releases, a documented API, samples and tutorials.
- **Testing exists.** Excalibur's testing package drives your game in a real browser and compares screenshots, which is more than most web engines offer.

## Where debuff is different

- **Deterministic by design.** debuff's fixed-step clock and seeded RNG make the same input produce the same game. Scenarios can assert on state, not just pixels, and recorded sessions replay exactly.
- **Fuzzing.** `npx debuff fuzz` plays your game with random but plausible input, and saves each crash, stuck state or loop as a scenario that reproduces it. The same seed repeats a run, so it can gate CI.
- **Agents on the running game.** debuff's MCP server lets an agent attach to the game you have open, read the moments you flag in the overlay, reproduce them with `game_replay`, and tune typed params you can undo. See the [agent comparison post](./coding-agents-and-browser-game-engines).
- **Size.** The whole debuff runtime is about a sixth of Excalibur's bundle.

## Which to choose

If you want a mature TypeScript engine with physics and more systems built in, use Excalibur. If testing and agent tooling matter more, try debuff:

```bash
npm create debuff@latest my-game
```
