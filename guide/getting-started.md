---
description: "Create your first browser game with debuff: npm create debuff, run the dev server, make a change and build it for the web."
---

# Getting started

## Create a game

::: code-group

```bash [npm]
npm create debuff@latest my-game
```

```bash [pnpm]
pnpm create debuff my-game
```

```bash [yarn]
yarn create debuff my-game
```

```bash [bun]
bun create debuff my-game
```

:::

Then:

```bash
cd my-game
npm install
npm run dev
```

Open the URL it prints. Press <kbd>`</kbd> to show the dev overlay, which has a frame-time graph and live sliders for every tunable value.

## What you get

```text
my-game/
  assets/            source art, audio, data; only files you reference ship
  scenarios/         deterministic gameplay tests (JSON)
  src/main.ts        your game
  index.html
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build, plus a size report that fails if dev code leaks |
| `npm test` | Runs `scenarios/*.json` in a headless browser |

## Next

- [Core concepts](./concepts): the game, scenes, the fixed-step loop
- [Input](./input): actions across keyboard, pointer and gamepad
- [Tunable params](./params): values you and your tools can adjust live
