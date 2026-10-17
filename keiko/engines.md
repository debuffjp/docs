---
title: Engine recipes
description: "Test Phaser, PixiJS, KAPLAY, Excalibur, three.js, debuff and hand-written canvas games with keiko: the hooks to add and a first test for each."
---

# Engine recipes

Each recipe is a minimal game and test that keiko's own engine checks run: a box that moves right while ArrowRight is held and counts clicks. Copy the hooks into your game and adapt the state.

Tested versions: Phaser 4.2, PixiJS 8.22, KAPLAY 3001.0, Excalibur 0.32, three.js r186, debuff 0.3.

A shared test works for all of them:

```ts
// tests/engine.test.ts
import { expect, play, test } from "keiko";

const ready = (g) => g.state !== undefined;

test("moves right while ArrowRight is held", async () => {
  const game = await play({ ready });
  const start = game.state.x;
  game.hold("ArrowRight", "1s");
  expect(game.state.x - start).toBeBetween(100, 130);
});

test("a click reaches the game", async () => {
  const game = await play({ ready });
  game.tap(160, 90).wait(2);
  expect(game.state.clicks).toBe(1);
});

test.deterministic("plays the same twice", (game) => game.hold("ArrowRight", 20).wait(10), { play: { ready } });
```

`ready` waits until the hooks report state, since engines often build their scenes a frame or two after start.

## Phaser

```ts
import Phaser from "phaser";

class Play extends Phaser.Scene {
  constructor() { super("play"); }
  create() {
    this.player = this.add.rectangle(160, 90, 16, 16, 0xcffb2d);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.clicks = 0;
    this.input.on("pointerdown", () => this.clicks++);
  }
  update(_time, delta) {
    if (this.cursors.right.isDown) this.player.x += (120 * delta) / 1000;
  }
}

const game = new Phaser.Game({ type: Phaser.AUTO, width: 320, height: 180, scene: [Play] });

if (import.meta.env.DEV) {
  window.__KEIKO__ = {
    state: () => {
      const s = game.scene.getScene("play");
      return s?.player ? { x: Math.round(s.player.x), clicks: s.clicks } : undefined;
    },
    scene: () => game.scene.getScenes(true)[0]?.scene.key,
  };
}
```

Phaser reads pointer positions from `pageX`, which keiko fills in, so `game.tap(x, y)` lands at `(x, y)` in the scene. For deterministic randomness, seed Phaser's generator: `Phaser.Math.RND.sow(["seed"])`.

## PixiJS

```ts
import { Application, Graphics } from "pixi.js";

const app = new Application();
await app.init({ width: 320, height: 180 });
document.querySelector("#app").appendChild(app.canvas);

const box = new Graphics().rect(0, 0, 16, 16).fill(0xcffb2d);
box.x = 160;
app.stage.addChild(box);
app.stage.eventMode = "static";
app.stage.hitArea = app.screen;
let clicks = 0;
app.stage.on("pointerdown", () => clicks++);

const keys = new Set();
addEventListener("keydown", (e) => keys.add(e.code));
addEventListener("keyup", (e) => keys.delete(e.code));
app.ticker.add((t) => {
  if (keys.has("ArrowRight")) box.x += (120 * t.deltaMS) / 1000;
});

if (import.meta.env.DEV) window.__KEIKO__ = { state: () => ({ x: Math.round(box.x), clicks }) };
```

PixiJS hit-tests against what it last rendered; keiko plays the first frame before your test starts, so taps work straight away. The first PixiJS test in a run takes a few seconds while its modules load.

## KAPLAY

```ts
import kaplay from "kaplay";

const k = kaplay({ width: 320, height: 180, global: false });
const box = k.add([k.rect(16, 16), k.pos(160, 90)]);
let clicks = 0;
k.onMousePress(() => clicks++);
k.onUpdate(() => {
  if (k.isKeyDown("right")) box.pos.x += 120 * k.dt();
});

if (import.meta.env.DEV) window.__KEIKO__ = { state: () => ({ x: Math.round(box.pos.x), clicks }) };
```

KAPLAY listens for keys on its canvas; keiko sends keys there when nothing else has focus. It loads built-in assets at start, which `play()` waits for.

## Excalibur

```ts
import * as ex from "excalibur";

const game = new ex.Engine({ width: 320, height: 180, suppressPlayButton: true, displayMode: ex.DisplayMode.Fixed });
const box = new ex.Actor({ x: 160, y: 90, width: 16, height: 16, color: ex.Color.fromHex("#cffb2d") });
game.add(box);
let clicks = 0;
game.input.pointers.primary.on("down", () => clicks++);
box.on("preupdate", (e) => {
  if (game.input.keyboard.isHeld(ex.Keys.Right)) box.pos.x += (120 * e.elapsed) / 1000;
});
await game.start();

if (import.meta.env.DEV) window.__KEIKO__ = { state: () => ({ x: Math.round(box.pos.x), clicks }) };
```

`suppressPlayButton` skips Excalibur's "click to start" screen, which a test would otherwise have to click.

## three.js

```ts
import * as THREE from "three";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(320, 180);
document.querySelector("#app").appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(0, 320, 180, 0, -1, 1);
const box = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.MeshBasicMaterial({ color: 0xcffb2d }));
box.position.x = 160;
scene.add(box);
let clicks = 0;
renderer.domElement.addEventListener("pointerdown", () => clicks++);

const keys = new Set();
addEventListener("keydown", (e) => keys.add(e.code));
addEventListener("keyup", (e) => keys.delete(e.code));
let last;
renderer.setAnimationLoop((t) => {
  const dt = last === undefined ? 0 : (t - last) / 1000;
  last = t;
  if (keys.has("ArrowRight")) box.position.x += 120 * dt;
  renderer.render(scene, camera);
});

if (import.meta.env.DEV) window.__KEIKO__ = { state: () => ({ x: Math.round(box.position.x), clicks }) };
```

three.js needs WebGL; keiko's WebGL context accepts every call, so scenes, materials and render loops run, with nothing drawn.

## A hand-written loop

```ts
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const keys = new Set();
addEventListener("keydown", (e) => keys.add(e.key));
addEventListener("keyup", (e) => keys.delete(e.key));
let x = 160;
let last;

function frame(now) {
  const dt = last === undefined ? 0 : (now - last) / 1000;
  last = now;
  if (keys.has("ArrowRight")) x += 120 * dt;
  ctx.fillRect(x, 90, 16, 16);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

if (import.meta.env.DEV) window.__KEIKO__ = { state: () => ({ x: Math.round(x) }) };
```

## debuff

debuff games need nothing extra. keiko detects them from `package.json` and drives them through debuff's dev tools, which every template installs:

```ts
if (import.meta.env.DEV) game.use(devTools({ input }));
```

`game.state` is the active scene's `inspect()`, steps are debuff's fixed steps, and params and commands are debuff's (`game.params.define`, `devTools({ commands })`). Run tests with `npx debuff test`; agents run them through the MCP server's `run_tests` tool. New projects include example tests. See [Logic tests in debuff](/docs/testing).
