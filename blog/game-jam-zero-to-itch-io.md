---
title: "Making a game for a game jam: from zero to itch.io"
description: "A practical plan for finishing a browser game in a 48-hour game jam: scope, a running start, tuning feel fast, and uploading a small web build to itch.io."
date: 2026-10-17
---

# Making a game for a game jam: from zero to itch.io

Game jams are the best way to actually finish games. But 48 hours disappear fast, and many jam games die in setup, in a bug at hour 40, or in a build that won't run on the jam page. Here's a plan that gets you to a playable upload.

## Before the jam: get your setup out of the way

Don't spend jam hours on tooling. The day before, make sure this works:

```bash
npm create debuff@latest jam-test
cd jam-test
npm install
npm run dev
```

Then delete it. On jam day you'll go from theme to running game in under a minute. Pick your starting point now: the minimal starter, `--template platformer` or `--template mossfell` for a top-down adventure.

## Hour 0–2: scope down, then down again

- **One mechanic.** Write it in a sentence. If the sentence needs "and", cut something.
- **One screen first.** Make it fun on one screen before you build levels.
- **Placeholder art.** Rectangles are fine. debuff's mascot is literally a rectangle.

## Hour 2–24: build the core, tune the feel

A jam game is judged in its first 30 seconds, and feel matters most there. Make your feel values into params so you can tune them while you play instead of edit-reload-replay:

```ts
const tuning = game.params.define("player", {
  speed: { type: "number", default: 120, min: 20, max: 400, units: "px/s" },
});
```

Press <kbd>&#96;</kbd> for the dev panel, drag sliders, undo when you overshoot. `@debuffjp/juice` adds tweens, particles, trails and squash-and-stretch for cheap polish.

If you're working with a coding agent, let it handle plumbing (input bindings, collision, asset loading) while you keep the creative calls.

## Hour 24–40: content and sound

Add levels (Tiled and LDtk both import), sound through `@debuffjp/audio` (autoplay unlock is handled), and a title screen. Keep a scenario that walks through your first level, and run `npx debuff scenario` after each big change so a late fix doesn't break the start of the game.

## Hour 40–46: build and upload early

Upload a build **hours** before the deadline, not minutes.

```bash
npx debuff build
```

The output is a static folder. The starter ships at about 13 kB brotli, so even with art your game loads fast on a jam page.

On itch.io:

1. Create a new project and set **Kind of project** to **HTML**.
2. Zip the build folder's *contents* (so `index.html` is at the zip's root) and upload it.
3. Tick **This file will be played in the browser**.
4. Set the viewport size, and turn on the fullscreen button.
5. Save as draft, play it on the itch.io page, then publish and submit to the jam.

> A one-command `debuff publish` to itch.io is on the [roadmap](https://github.com/debuffjp/debuff/blob/main/docs/roadmap.md).

## Hour 46–48: rest

Write a short description, take a screenshot or GIF, and stop. A finished small game beats an unfinished big one every time.

## After the jam

Read every comment, fix the top bug, and upload a post-jam version. If players report a bug you can't reproduce, a recorded replay brings it back exactly.
