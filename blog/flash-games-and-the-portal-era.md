---
title: "Flash games and the portal era: what browser games inherited"
description: "How Flash and portals like Newgrounds, Miniclip, Kongregate and Armor Games shaped browser games, how Flash ended, how its games are preserved, and what HTML5 games carry on."
short: "Flash and the portal era"
category: History
date: 2026-10-17
---

# Flash games and the portal era: what browser games inherited

For about fifteen years, a game in a browser usually meant a Flash game. You opened a portal, clicked a thumbnail, waited for a loading bar, and played. No install, no store, no account. Many developers who are known for commercial games today started there.

Flash itself is gone. The idea it proved is still around: a small game you can play instantly from a link. This post looks at where that came from, how it ended, and what today's HTML5 games inherited.

## A short timeline

<Timeline :items="[
  { year: '1995', text: 'Tom Fulp founds Newgrounds, which became one of the best-known homes for Flash games and animation.' },
  { year: '1996', text: 'Macromedia acquires FutureSplash and releases Macromedia Flash 1.0 in December.' },
  { year: '2001', text: 'Miniclip launches in London.' },
  { year: '2004', text: 'Daniel McNeely starts the site that becomes Armor Games.' },
  { year: '2005', text: 'Adobe completes its acquisition of Macromedia, and with it Flash.' },
  { year: '2006', text: 'ActionScript 3 and the AVM2 virtual machine ship with Flash Player 9, making Flash much faster for games. Kongregate launches in October.' },
  { year: '2010', text: 'Steve Jobs publishes “Thoughts on Flash”, explaining why the iPhone and iPad will not support it.' },
  { year: '2017', text: 'Adobe announces Flash Player will reach end of life at the end of 2020, and encourages a move to open standards like HTML5.' },
  { year: '2021', text: 'Support ended on 31 December 2020. From 12 January 2021, Flash Player blocks Flash content from running.' },
]" />

Sources: [Adobe Flash](https://en.wikipedia.org/wiki/Adobe_Flash), [ActionScript](https://en.wikipedia.org/wiki/ActionScript), [Newgrounds](https://en.wikipedia.org/wiki/Newgrounds), [Miniclip](https://en.wikipedia.org/wiki/Miniclip), [Armor Games](https://en.wikipedia.org/wiki/Armor_Games), [Kongregate](https://en.wikipedia.org/wiki/Kongregate), [Thoughts on Flash](https://en.wikipedia.org/wiki/Thoughts_on_Flash), [Adobe's 2017 announcement](https://blog.adobe.com/en/publish/2017/07/25/adobe-flash-update) and [Adobe's end-of-life page](https://www.adobe.com/products/flashplayer/end-of-life.html).

## Portals made the audience

Flash made games easy to build and easy to embed. Portals made them easy to find. Each had its own character. Newgrounds was a community built around player submissions, Miniclip was a broad arcade, and Kongregate was built around player accounts. Armor Games sponsored developers directly: a portal paid for a game, and the game carried the portal's branding and a link back.

That sponsorship model mattered. A small team could make a game in weeks, sell the sponsorship, and get it in front of a large audience. Armor Games' sponsored titles include Fancy Pants Adventures, Crush the Castle, Kingdom Rush and Fireboy and Watergirl ([source](https://en.wikipedia.org/wiki/Armor_Games)).

<figure>
  <img src="/blog/flash/behemoth-2007.jpg" alt="Five people from The Behemoth and the games press standing together at an event in 2007" width="508" height="614" loading="lazy" />
  <figcaption>The Behemoth in 2007, co-founded by Tom Fulp and Dan Paladin, the makers of Alien Hominid. Photo: “The Behemoth (2007)” by Vincent Diamante, <a href="https://commons.wikimedia.org/wiki/File:The_Behemoth_(2007)_(cropped).jpg">CC BY 2.0</a>, via Wikimedia Commons.</figcaption>
</figure>

## Where careers started

A lot of well-known games began as browser games. On Newgrounds alone, the list includes Alien Hominid (2002), Meat Boy (2008), which became Super Meat Boy, The Binding of Isaac (2011) and Friday Night Funkin' ([source](https://en.wikipedia.org/wiki/Newgrounds)). The pattern was the same each time: ship something small, let players find it, and build on what worked.

## How it ended

Flash was a plugin, and plugins lost. The iPhone and iPad never ran it, browsers moved toward open standards, and security problems kept coming. After Apple's 2010 letter, the direction was clear. Adobe set the end date in 2017, and Flash content stopped running in January 2021.

Portals adapted. Newgrounds began encouraging HTML5 submissions over Flash in 2018 ([source](https://en.wikipedia.org/wiki/Newgrounds)), and newer portals were built on HTML5 from the start. Poki says it reaches 100 million players a month ([about.poki.com](https://about.poki.com/)).

## Saving the old games

Two projects did most of the work of keeping Flash games playable.

- **Flashpoint** is a preservation archive that says it has saved over 200,000 web games, animations and interactive experiences ([flashpointarchive.org](https://flashpointarchive.org/)).
- **Ruffle** is an open-source Flash Player emulator written in Rust and compiled to WebAssembly, so Flash content runs in a modern browser without a plugin ([ruffle.rs](https://ruffle.rs/)). Newgrounds uses and sponsors it, and the Internet Archive added it to its emulation in November 2020 ([Internet Archive blog](https://blog.archive.org/2020/11/19/flash-animations-live-forever-at-the-internet-archive/)).

<figure>
  <img src="/blog/flash/ruffle-demo.png" alt="The Ruffle demo page running Flash content in a browser" width="960" height="464" loading="lazy" />
  <figcaption>Ruffle's demo page. Screenshot: “Ruffle.rs Demo” by Paowee, <a href="https://commons.wikimedia.org/wiki/File:Ruffle.rs_Demo.png">public domain</a>, via Wikimedia Commons.</figcaption>
</figure>

Coverage has been uneven: by 2022 Ruffle ran most older ActionScript 1 and 2 content, while support for ActionScript 3 games came later ([source](https://en.wikipedia.org/wiki/Newgrounds)).

<figure>
  <img src="/blog/flash/tom-fulp-2024.jpg" alt="Tom Fulp, founder of Newgrounds, at a fan meetup in 2024" width="960" height="1003" loading="lazy" />
  <figcaption>Tom Fulp, who founded Newgrounds in 1995, at a Pico Day meetup in 2024. Photo: “Tom Fulp” by ECarterSterling, <a href="https://commons.wikimedia.org/wiki/File:Tom_Fulp.jpg">CC BY-SA 2.0</a>, via Wikimedia Commons.</figcaption>
</figure>

## What HTML5 games inherited

The technology changed completely. The shape of the thing didn't.

- **Instant play is still the point.** A link, a short load, and you're playing. That's why download size still matters: every extra megabyte is a player who gave up on the loading bar.
- **Small games are still a real format.** Portals, itch.io pages and game jams all reward games you can finish in an evening.
- **Feel is still what people remember.** The Flash games that lasted were the ones where moving and jumping felt good.
- **Open standards replaced the plugin.** Canvas, WebGL and WebAssembly run everywhere a browser does, including phones, and nobody has to install anything.

## Where debuff fits

debuff is built for that kind of game: small, instant, and polished. The starter game ships at about 13 kB brotli, it runs on WebGL2 with a Canvas 2D fallback, and `debuff build` produces a folder you can upload to a portal or itch.io. Where Flash had its authoring tool, debuff leans on today's equivalents: live-tunable params for feel, deterministic tests, and a coding agent that can play the game with you.

If you grew up on portal games and want to make one, start here:

```bash
npm create debuff@latest my-game
```

Or browse the other posts on [making browser games with coding agents](./build-a-game-with-claude-code) and [how debuff compares](./coding-agents-and-browser-game-engines).
