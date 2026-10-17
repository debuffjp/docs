---
title: "debuff vs LittleJS: two small engines for browser games"
description: "debuff and LittleJS compared: features, size, jam friendliness, procedural sound, level editing, testing and coding-agent support."
short: "debuff vs LittleJS"
category: "Compared: web libraries"
date: 2026-10-17
---

# debuff vs LittleJS

LittleJS and debuff are both small, fast engines for browser games, and both are friendly to coding agents. LittleJS packs an impressive amount into a tiny engine and is a favourite for game jams. debuff puts its weight on determinism, testing and an agent that can attach to your running game. Here's how they compare as of October 2026.

## Short answer

Pick **LittleJS** if you want the most features per kilobyte: built-in level editors, procedural sound, particles, medals and a js13k path. Pick **debuff** if you want TypeScript, deterministic tests and fuzzing, and an MCP server so your agent can play the game with you.

## At a glance

| | debuff 0.2 | LittleJS 1.27 |
| --- | --- | --- |
| License | MIT | MIT ([GitHub](https://github.com/KilledByAPixel/LittleJS)) |
| Language | TypeScript | JavaScript, with TypeScript types |
| Rendering | WebGL2, Canvas 2D fallback | WebGL2 and Canvas 2D; also a 3D plugin |
| Physics | Tile collision | Tile collision, raycasts, one-way platforms; optional Box2D plugin |
| Sound | Web Audio, synth sounds | ZzFX procedural sound, no audio files needed |
| Level editing | Tiled and LDtk import | Built-in level editors that save Tiled JSON |
| Platforms integration | None built in | Medals, leaderboards and cloud saves (Newgrounds, Wavedash) |
| Full runtime, brotli | 20 kB (every debuff package) | 138 kB (`littlejs.esm.min.js`); a js13k build "builds to a 7KB zip" |
| Testing | Scenarios, screenshot baselines, fuzz | Debug overlay and asserts; automated testing not found |
| Coding agents | MCP server for the running game, `AGENTS.md`, llms.txt | AI-friendly `REFERENCE.md` and an AI templates repo; no MCP server found |
| Community | Small | Established (about 4.3k GitHub stars) |

<SizeChart only="littlejs" />

The full LittleJS bundle includes many features a game may not use. Its js13k build strips it down a long way, so don't read the chart as the size of a LittleJS game.

## Where LittleJS is stronger

- **Features for its size.** Level editors, a particle designer, ZzFX sound and on-screen gamepads are all included.
- **Game jams.** A js13k path, quick templates, and medals and leaderboards for portals.
- **Maturity.** Years of releases and many jam games made with it.
- **AI material.** A reference written for AI tools and a separate repo of templates and prompts.

## Where debuff is different

- **Determinism and tests.** Fixed steps and a seeded RNG make scenarios with screenshot baselines possible, and `npx debuff fuzz` saves every crash as a replay.
- **An agent on the running game.** debuff's MCP server lets an agent attach to the game you have open, read moments you flag, replay them exactly and tune typed params you can undo. LittleJS gives agents good docs; debuff gives them the game. See the [agent comparison](./coding-agents-and-browser-game-engines).
- **Typed, live-tunable params.** Feel values have types, ranges and units, and show up as sliders in the dev overlay.
- **TypeScript first.** The toolkit and templates are TypeScript.

## Which to choose

For a jam where every kilobyte and built-in tool counts, LittleJS is hard to beat. If you want tests and an agent in the loop, try debuff:

```bash
npm create debuff@latest my-game
```
