---
layout: home
title: debuff, a 2D web game toolkit
titleTemplate: false
description: "debuff is an open-source toolkit that handles the basics of 2D browser games, so you can spend your time on the game you imagined."
hero:
  name: debuff
  text: more room for play.
  tagline: debuff handles the basics of 2D browser games, from the game loop to shipping, so your time goes on the world, the feel and the idea that made you want to build it.
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

## Spend your time on the game, not the groundwork

Every game starts as an idea: a world to explore, a jump that feels just right, a story only you would tell. Then the groundwork arrives. You need a game loop, crisp pixels on every screen, controls that respond, sound that plays, levels, assets, and a way to find out why something broke. That can take days before the idea gets any attention.

debuff takes care of the groundwork, so your first hour, and every one after it, goes on your game.

</section>

<section class="home-band">

## From idea to shipped game

<ol class="steps">
<li class="c-lime"><strong>Start</strong><CopyCommand cmd="npm create debuff@latest my-game" label="npm create debuff" /><span>A running game in under a minute, with a <a href="/docs/getting-started">starter or a platformer</a>.</span></li>
<li class="c-sky"><strong>Build</strong><span>Sprites, levels from <a href="/docs/tilemaps">Tiled and LDtk</a>, and an <a href="/docs/assets">asset pipeline</a> that ships only what you use.</span></li>
<li class="c-pink"><strong>Tune</strong><span>Feel values become <a href="/docs/params">live sliders</a> in the dev panel, with undo.</span></li>
<li class="c-amber"><strong>Verify</strong><CopyCommand cmd="npm test" /><span><a href="/docs/scenarios">Deterministic scenarios</a> drive your game in a real browser and compare screenshots.</span></li>
<li class="c-violet"><strong>Ship</strong><CopyCommand cmd="npm run build" /><span>A size report that fails if dev code leaks. Web anywhere, or <a href="/docs/desktop">desktop with Tauri</a>.</span></li>
</ol>

</section>

<section class="home-band">

## What debuff takes off your plate

<div class="cards">
<a class="card c-lime" href="/benchmarks"><strong>Room to grow</strong><span>Batched WebGL2 with a Canvas 2D fallback. About 200,000 sprites at 60 fps on our benchmark machine; the starter ships at about 13 kB brotli.</span></a>
<a class="card c-pink" href="/docs/why"><strong>Errors that explain themselves</strong><span>A crash stops the game cleanly and says whose bug it is (your code, a rejected call, or debuff), with the exact source line and a hint.</span></a>
<a class="card c-sky" href="/docs/why#know-where-every-frame-goes"><strong>Dev panel that answers "why?"</strong><span>Pause, step, slow motion, live game state, and dropped frames attributed to your code or to something outside it.</span></a>
<a class="card c-amber" href="/docs/scenarios"><strong>Tests you can trust</strong><span>Same inputs, same game: scenarios replay exactly, so a bug comes with a reproduction instead of "works on my machine".</span></a>
<a class="card c-violet" href="/docs/no-build"><strong>Web standards only</strong><span>ES modules, a canvas, Web Audio and Gamepad. No proprietary editor or project format. It even runs from a CDN with no build step.</span></a>
</div>

</section>

<section class="home-band">

## Play before you read

The plinko board on this page is a real debuff game, running right here. The [examples](/examples) include it, a tilemap platformer and mossfell, a top-down adventure, all playable, each with its source and the docs behind it.

</section>

<section class="home-band">

## Works with coding agents, led by you

Agents are welcome and never required. With the [debuff MCP server](/docs/agents), an agent like Claude Code can play the game you have open, read its state and explained errors, tune params and verify its changes with scenarios. Every action it takes shows in your dev panel, where you can undo it.

New projects ship an `AGENTS.md` with the commands and rules, so agents start with the right context. Creative calls stay with you: the tools are built for agents to propose and people to decide.

</section>

<section class="home-band home-final">

## Make something weird.

<CopyCommand cmd="npm create debuff@latest my-game" size="lg" />

<p class="final-links"><a class="final-primary" href="/docs/getting-started">Build your first game</a> <a href="https://github.com/debuffjp/debuff">Source on GitHub</a> <a href="https://github.com/debuffjp/debuff/issues">Ask a question</a></p>

</section>

</div>

<style>
.home-sections {
  --c-lime: #cffb2d;
  --c-sky: #38bdf8;
  --c-pink: #f472b6;
  --c-amber: #fbbf24;
  --c-violet: #a78bfa;
}
.c-lime { --accent: var(--c-lime); }
.c-sky { --accent: var(--c-sky); }
.c-pink { --accent: var(--c-pink); }
.c-amber { --accent: var(--c-amber); }
.c-violet { --accent: var(--c-violet); }
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
@media (min-width: 768px) {
  .steps { grid-template-columns: repeat(6, minmax(0, 1fr)); }
  .steps li { grid-column: span 2; }
  .steps li:nth-child(n + 4) { grid-column: span 3; }
}
.steps li {
  margin: 0 !important;
  counter-increment: step;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: start;
  gap: 10px;
  min-width: 0;
}
.steps li strong::before {
  content: counter(step) " ";
  color: var(--accent, var(--vp-c-brand-1));
  font-family: var(--vp-font-family-mono);
}
.steps .cmd { width: 100%; min-width: 0; }
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
.card:hover { border-color: var(--vp-c-text-3); }
.card strong::before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 8px;
  border-radius: 2px;
  background: var(--accent, var(--vp-c-brand-1));
  vertical-align: 2px;
}
.card strong { color: var(--vp-c-text-1); font-size: 16px; }
.card span { color: var(--vp-c-text-2); font-size: 14px; line-height: 1.6; }
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
