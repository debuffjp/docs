---
description: "Playable debuff examples with source: a plinko sprite stress test, a tilemap platformer and mossfell, a top-down adventure, each linked to the docs behind it."
---

# Examples

Small, real games built with debuff, each with its source, controls and the docs behind it. They run against the current release (0.1).

## Plinko: sprite stress test

<ClientOnly><PlinkoHero /></ClientOnly>

Balls fall through a peg board and a spinning paddle into bins. It's calm by default. Press **stress test** and it keeps adding sprites while your device holds 60 fps, then shows how many it held.

- **Controls:** click or tap the board to drop more balls; play/pause in the corner.
- **Shows:** batched `draw.sprite` at scale, a fixed-step simulation, allocation-free hot loops, `game.stats`.
- **Source:** [examples/plinko/plinko.ts](https://github.com/debuffjp/docs/blob/main/examples/plinko/plinko.ts), about 300 lines using only `@debuffjp/core`.
- **Docs:** [Drawing](/docs/drawing) · [Core concepts](/docs/concepts) · [Benchmarks](/benchmarks)

## Platformer

<PlayEmbed src="/play/platformer/" title="the platformer" ratio="16 / 9" />

buff runs, jumps and collects coins across a level made in Tiled. This is the `platformer` template, unchanged. It's a production build, so it opens with the "made with debuff" card.

- **Controls:** arrow keys or A/D to move, Space, Up or W to jump, Down to drop through orange platforms. A gamepad works too.
- **Shows:** Tiled level import, tile collision with one-way platforms, coyote time and jump buffering, a camera with deadzone, an atlas-packed sprite sheet, particles and squash-and-stretch.
- **Source:** [templates/platformer](https://github.com/debuffjp/debuff/tree/main/templates/platformer). Start your own copy with:

```bash
npm create debuff@latest my-game -- --template platformer
```

- **Docs:** [Tilemaps and collision](/docs/tilemaps) · [Input](/docs/input) · [Assets](/docs/assets) · [Tunable params](/docs/params)

## Mossfell

<PlayEmbed src="/play/mossfell/" title="mossfell" ratio="4 / 3" />

A wanderer crosses the fell, screen by screen, to find the mossheart in the hollow below. Swing a blade at slimes, moths and thornbulbs, find the key, open the door and face the warden. Moss and plum instead of lime: debuff doesn't come with a look of its own.

- **Controls:** arrow keys or WASD to move, Z, Space or J to swing. A gamepad works too.
- **Shows:** screen-by-screen scrolling over one Tiled map, a small dungeon behind stairs, sword hitboxes and knockback, hearts and invulnerability frames, enemies that respawn per screen, and synthesized sound effects.
- **Source:** [templates/mossfell](https://github.com/debuffjp/debuff/tree/main/templates/mossfell). Start your own copy with:

```bash
npm create debuff@latest my-game -- --template github:debuffjp/debuff/templates/mossfell
```

- **Docs:** [Tilemaps and collision](/docs/tilemaps) · [Scenarios](/docs/scenarios) · [Tunable params](/docs/params)

## Make your own

The [minimal starter](/docs/getting-started) is the quickest way in. Made something with debuff? [Tell us in an issue](https://github.com/debuffjp/debuff/issues). With your permission, we'd love to feature it.
