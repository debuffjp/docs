---
title: How Keiko works
description: "Inside keiko: the headless page, the virtual clock, inert rendering and audio, asset loading, and what keiko can't test."
---

# How Keiko works

## The page

Each `play()` opens a fresh [happy-dom](https://github.com/capricorn86/happy-dom) window, installs it as Node's globals (`window`, `document`, `navigator` and the DOM classes), and writes your page's markup into it without running its scripts. Then it imports the page's module scripts through Vite's module runner, using your project's Vite config, so TypeScript, aliases and plugins work as in `vite dev`. Every `play()` evaluates your game's modules again, so no state carries over.

## The clock

While a game runs, keiko replaces:

| | With |
| --- | --- |
| `requestAnimationFrame`, `cancelAnimationFrame` | A queue that runs once per step |
| `setTimeout`, `setInterval`, `clearTimeout`, `clearInterval` | Timers on game time |
| `requestIdleCallback` | Once per frame, with a generous deadline |
| `performance.now()`, `Date.now()` | Game time (dates start at 2026-01-01) |
| `Math.random()` | A seeded generator (mulberry32) |

A step advances time by one frame. Timers that fall due fire in order, each seeing its own due time, then frame callbacks run with the frame's timestamp. Timers set from inside a timer callback wait at least 4 ms, as in browsers, so a timer that reschedules itself with no delay can't hang a step. Timers set by Node's own internals, such as its `fetch`, keep real time.

## Rendering and sound

- **Canvas 2D:** a context that accepts every call. `measureText` and `getImageData` return plausible shapes.
- **WebGL 1 and 2:** a context with the real constants that accepts every call. Shaders compile, programs link, framebuffers are complete, limits look like a mid-range GPU, and reads return zeros. `play({ webgl: false })` hides WebGL so engines fall back to Canvas 2D.
- **Web Audio:** a context whose nodes accept every call. Decoding succeeds instantly, in both the promise and callback forms.
- **Fonts:** `document.fonts` reports every font as loaded.

## Assets

`fetch` and image loads go to your project's Vite server, so loaders resolve URLs as in a browser. Images are real `<img>` elements; keiko fetches their bytes and reads their size from the header (PNG, GIF, JPEG) without decoding pixels. Keiko counts requests in flight: `play()` waits until the game's first loads finish, and `game.settle()` waits for later ones.

## Layout and input

The canvas reports its own pixel size as its box on the page, at the origin. Pointer events carry the same point in every position field (`clientX`, `pageX`, `offsetX`, `x`), so engines get the coordinates you passed whichever field they read. Keys go to the focused element, or the game's canvas when nothing has focus, and bubble to `document` and `window`.

## Errors

A game error during a step becomes a `GameError` with the tick and scene, and its stack is source-mapped to your code. Errors from the game's async work (failed loads, rejected promises) fail the test that was running, or are listed after the run if no test was.

## What keiko can't test

- **What's drawn:** nothing is rendered, so pixel output, shaders and layout need screenshot tests in a real browser.
- **What's heard:** audio graphs run silently.
- **Real devices:** GPU limits, browser quirks and real performance need real browsers.
- **Many games at once:** one game runs at a time per process; tests run in sequence.
