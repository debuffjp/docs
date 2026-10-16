# Drawing

Scenes draw through `draw`, an immediate-mode API in logical units. It runs on a batched **WebGL2** renderer and falls back to **Canvas 2D** automatically where WebGL2 isn't available. Your code is the same either way.

```ts
render(draw) {
  draw.withCamera(game.camera, () => {
    draw.sprite(heroFrame, hero.x, hero.y, { origin: [0.5, 1], flipX: hero.facingLeft, flash: hero.hurt });
    draw.rect(0, groundY, 320, 8, "#2f3a1f");
    particles.draw(draw);
  });
  draw.text(`score ${score}`, 4, 4, { font: "8px monospace", color: "#a3e635" });
}
```

## API

| Call | Draws |
| --- | --- |
| `sprite(frame \| image, x, y, options?)` | An image or sprite-sheet frame. Options: `origin`, `scaleX`, `scaleY`, `rotation`, `flipX`, `flipY`, `alpha`, `tint`, `flash`, `smooth` |
| `rect(x, y, w, h, color)` | Filled rectangle |
| `circle(x, y, radius, color)` | Filled, antialiased circle |
| `line(x1, y1, x2, y2, width, color)` | Line |
| `text(string, x, y, options?)` | Cached, crisp text. Options: `font`, `color`, `align`, `baseline`, `alpha` |
| `push()` / `pop()`, `translate`, `scale`, `rotate` | Transform stack |
| `withCamera(camera, fn)` | Run `fn` in the camera's view |
| `alpha`, `blend("normal" \| "add")` | Global alpha and blend mode |
| `raw` | `{ kind: "webgl2", gl }` or `{ kind: "2d", ctx }` escape hatch |

Colours are hex strings (`"#a3e635"`, `"#a3e63580"`), any CSS colour, or numbers `0xRRGGBBAA`.

## Why it's fast

Every call becomes one instance in a GPU buffer. Up to 8 textures are bound per batch, so sprites, text and particles interleave without breaking batches. The hot path doesn't allocate.

On the [renderer benchmark](https://github.com/debuffjp/debuff/tree/main/bench/renderer), `draw.sprite` sustains about **200,000 sprites at 60 fps**. That's about 40× Canvas 2D, about 4× PixiJS `Sprite`, and level with PixiJS's specialised `ParticleContainer`. One laptop GPU, so treat these as indicative ([ADR 0007](https://github.com/debuffjp/debuff/blob/main/docs/adr/0007-webgl2-renderer.md)).

## Choosing a backend

```ts
new Game({ canvas, width, height, renderer: "auto" }); // default: WebGL2, else Canvas 2D
new Game({ canvas, width, height, renderer: "2d" }); // force Canvas 2D
```

`game.draw.kind` tells you which one is active. On Canvas 2D, `tint` applies only its alpha.
