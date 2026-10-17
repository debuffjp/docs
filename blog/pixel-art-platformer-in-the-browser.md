---
title: "How to make a pixel-art platformer in the browser"
description: "Make a 2D pixel-art platformer that runs in any browser: tilemaps from Tiled or LDtk, crisp pixels, and a jump that feels good thanks to coyote time and jump buffering."
short: "Pixel-art platformer"
category: Guides
date: 2026-10-17
---

# How to make a pixel-art platformer in the browser

A platformer is the classic first game, and a hard one to get *right*. The jump has to feel fair, the pixels have to stay crisp on every screen, and levels have to come from somewhere. This guide uses debuff's platformer template, which handles all three, so you can spend your time on levels and feel.

## 1. Start from the platformer template

```bash
npm create debuff@latest my-platformer -- --template platformer
cd my-platformer
npm install
npm run dev
```

You get a playable level with a player, coins, tiles and one-way platforms. Keyboard, gamepad and touch all work out of the box.

## 2. Crisp pixels on every screen

Pixel art breaks easily. It scales to blurry mush, or edges flicker as the camera moves. debuff snaps pixel-art sprites to whole pixels and interpolates the camera between fixed steps, so motion stays smooth on 120 Hz and 144 Hz displays as well as 60 Hz.

## 3. Build levels in Tiled or LDtk

Draw levels in [Tiled](https://www.mapeditor.org/) or [LDtk](https://ldtk.io/) and import them with `@debuffjp/tilemap`. You get culled, batched rendering, solid tiles, and one-way platforms with landing tolerance, so the player doesn't snag on platform edges.

Drop your art and level files into `assets/`. The manifest regenerates automatically and only files you reference ship.

## 4. Make the jump feel good

Most of a platformer's feel lives in a handful of numbers. The template defines them as **params**:

```ts
const tuning = game.params.define("player", {
  gravity:    { type: "number", default: 900,  min: 100, max: 3000, units: "px/s²" },
  jumpSpeed:  { type: "number", default: 290,  min: 100, max: 600,  units: "px/s" },
  jumpCut:    { type: "number", default: 0.45, min: 0,   max: 1 },
  coyote:     { type: "number", default: 0.09, min: 0,   max: 0.3,  units: "s" },
  jumpBuffer: { type: "number", default: 0.1,  min: 0,   max: 0.3,  units: "s" },
});
```

- **Coyote time** lets you jump for a moment after running off a ledge. Without it, players swear they pressed jump in time, and they're right.
- **Jump buffering** counts a jump pressed slightly before landing.
- **Jump cut** shortens the jump when the button is released early, giving players control over height.

Press <kbd>&#96;</kbd> to open the dev panel and drag these sliders while you play. Undo is there if you overshoot. When it feels right, copy the values back to code.

## 5. Lock in what works with a scenario

Once the jump feels right, protect it. The template includes `scenarios/run-and-jump.json`, which runs right, jumps, checks that the player lands, and captures a screenshot:

```json
{ "press": "Space" },
{ "wait": 10 },
{ "expect": { "state.player.onGround": { "eq": false } } },
{ "release": "Space" },
{ "wait": 60 },
{ "expect": { "state.player.onGround": { "eq": true } } },
{ "capture": "landed" }
```

Run it with `npx debuff scenario`. Runs are deterministic, so if a later change breaks landing, this fails.

## 6. Ship it

```bash
npx debuff build
```

Upload the output folder to itch.io, GitHub Pages, Cloudflare or any static host.

## Prefer top-down?

Try `--template mossfell` for a top-down adventure starter.
