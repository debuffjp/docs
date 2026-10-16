---
layout: home
title: debuff, a 2D web game toolkit
titleTemplate: false
description: "debuff is an open-source toolkit for small, fast 2D browser games: batched WebGL2, explained errors, live tuning, and coding agents that can play your game."
hero:
  name: debuff
  text: more room for play.
  tagline: Make lightweight browser games without spending your best ideas on setup and plumbing. A small runtime and a workflow built for fast iteration, with or without coding agents.
  actions:
    - theme: brand
      text: Build your first game
      link: /docs/getting-started
    - theme: alt
      text: Explore the examples
      link: /examples
    - theme: alt
      text: GitHub
      link: https://github.com/debuffjp/debuff
---

<div class="home-sections">

<section class="home-band">

<p class="eyebrow">Open-source toolkit for 2D web games · 0.1, early development</p>

## Every web game rebuilds the same plumbing

A canvas and some JavaScript gets you a square on screen. Then come the fixed-step loop, crisp scaling on every screen, input that doesn't miss taps, audio that actually starts, an asset pipeline, sprite batching, and a way to find out why the frame rate just dropped. That's days of work before the idea you started with gets any attention.

debuff ships those parts as small, tree-shakeable packages built on web standards, so the first hour goes on your game.

</section>

<section class="home-band">

## From idea to shipped game

<ol class="steps">
<li><strong>Start</strong><code>npm create debuff@latest my-game</code><span>A running game in under a minute, with a <a href="/docs/getting-started">starter or a platformer</a>.</span></li>
<li><strong>Build</strong><code>draw · input · assets · tilemap</code><span>Sprites, levels from <a href="/docs/tilemaps">Tiled and LDtk</a>, and an <a href="/docs/assets">asset pipeline</a> that ships only what you use.</span></li>
<li><strong>Tune</strong><code>game.params.define(…)</code><span>Feel values become <a href="/docs/params">live sliders</a> in the dev panel, with undo.</span></li>
<li><strong>Verify</strong><code>npm test · debuff fuzz</code><span><a href="/docs/scenarios">Deterministic scenarios</a> with screenshots, and random playtesting that hands you a replay of every crash.</span></li>
<li><strong>Ship</strong><code>npm run build</code><span>A size report that fails if dev code leaks. Web anywhere, or <a href="/docs/desktop">desktop with Tauri</a>.</span></li>
</ol>

</section>

<section class="home-band">

## What you get

<div class="cards">
<a class="card" href="/benchmarks"><strong>A fast, small runtime</strong><span>Batched WebGL2 with a Canvas 2D fallback. About 200,000 sprites at 60 fps on our benchmark machine; the starter ships at about 13 kB brotli.</span></a>
<a class="card" href="/docs/why"><strong>Errors that explain themselves</strong><span>A crash stops the game cleanly and says whose bug it is (your code, a rejected call, or debuff), with the exact source line and a hint.</span></a>
<a class="card" href="/docs/why#know-where-every-frame-goes"><strong>Dev panel that answers "why?"</strong><span>Pause, step, slow motion, live game state, and dropped frames attributed to your code or to something outside it.</span></a>
<a class="card" href="/docs/scenarios"><strong>Tests you can trust</strong><span>Same inputs, same game: scenarios and fuzz runs replay exactly, so bugs come with a reproduction.</span></a>
<a class="card" href="/docs/no-build"><strong>Web standards only</strong><span>ES modules, a canvas, Web Audio and Gamepad. No proprietary editor or project format. It even runs from a CDN with no build step.</span></a>
</div>

</section>

<section class="home-band">

## Play before you read

The plinko board on this page is a real debuff game, running right here. The [examples](/examples) include it and a tilemap platformer you can play, each with its source and the docs behind it.

</section>

<section class="home-band">

## Works with coding agents, led by you

Agents are welcome and never required. With the [debuff MCP server](/docs/agents), an agent like Claude Code can play the game you have open, read its state and explained errors, tune params and verify its changes with scenarios and fuzz runs. Every action it takes shows in your dev panel, where you can undo it.

New projects ship an `AGENTS.md` with the commands and rules, so agents start with the right context. Creative calls stay with you: the tools are built for agents to propose and people to decide.

</section>

<section class="home-band">

## Measured, not claimed

<div class="stats">
<div><strong>~200,000</strong><span>sprites at 60 fps (<a href="/benchmarks">method</a>)</span></div>
<div><strong>~13 kB</strong><span>brotli for the starter game, everything included</span></div>
<div><strong>1.8 MB</strong><span>Windows installer for the starter via <a href="/docs/desktop">Tauri</a></span></div>
<div><strong>0</strong><span>telemetry in the toolkit or your games (<a href="/privacy">privacy</a>)</span></div>
</div>

</section>

<section class="home-band home-final">

## Make something weird.

```bash
npm create debuff@latest my-game
```

<p class="final-links"><a class="final-primary" href="/docs/getting-started">Build your first game</a> <a href="https://github.com/debuffjp/debuff">Source on GitHub</a> <a href="https://github.com/debuffjp/debuff/issues">Ask a question</a></p>

</section>

</div>

<style>
.home-sections {
  max-width: 1152px;
  margin: 0 auto;
  padding: 24px 24px 64px;
}
@media (min-width: 640px) {
  .home-sections { padding: 24px 48px 80px; }
}
.home-band {
  padding: 40px 0;
  border-top: 1px solid var(--vp-c-divider);
}
.home-band h2 {
  font-family: var(--vp-font-family-display);
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 16px;
  border: 0;
  padding: 0;
}
.home-band p {
  max-width: 46rem;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin: 0 0 12px;
}
.home-band a:not(.card):not(.final-primary) {
  color: var(--vp-c-brand-1);
  background: none;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.eyebrow {
  font: 600 12px/1.4 var(--vp-font-family-mono);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1) !important;
}
.steps {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  counter-reset: step;
}
@media (min-width: 960px) {
  .steps { grid-template-columns: repeat(5, minmax(0, 1fr)); }
}
.steps code { overflow-wrap: anywhere; white-space: normal; }
.steps li {
  counter-increment: step;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  display: grid;
  gap: 8px;
}
.steps li strong::before {
  content: counter(step) " ";
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
}
.steps code {
  font-size: 12px;
  width: fit-content;
}
.steps span {
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.6;
}
.cards {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
@media (min-width: 960px) {
  .cards { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
.card {
  display: grid;
  gap: 8px;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  text-decoration: none !important;
  transition: border-color 0.2s;
}
.card:hover { border-color: var(--vp-c-brand-1); }
.card strong { color: var(--vp-c-text-1); font-size: 16px; }
.card span { color: var(--vp-c-text-2); font-size: 14px; line-height: 1.6; }
.stats {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}
.stats div {
  padding: 18px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  display: grid;
  gap: 4px;
}
.stats strong {
  font-family: var(--vp-font-family-display);
  font-size: 32px;
  font-weight: 800;
  color: var(--vp-c-brand-1);
}
.stats span { color: var(--vp-c-text-2); font-size: 14px; }
.home-final { text-align: left; }
.home-final h2 { font-size: 36px; }
.final-links {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  margin-top: 16px !important;
}
.final-primary {
  padding: 8px 18px;
  border-radius: 999px;
  background: #cffb2d;
  color: #11140d !important;
  font-weight: 600;
  text-decoration: none !important;
}
@media (prefers-reduced-motion: reduce) {
  .card { transition: none; }
}
</style>
