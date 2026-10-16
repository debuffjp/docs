# Testing with scenarios

A scenario is a JSON file of steps that drives your game in a real browser and checks what happens. Time only moves forward through `wait` steps, so runs are deterministic.

```json
{
  "$schema": "../node_modules/@debuff/cli/schema/scenario.schema.json",
  "steps": [
    { "press": "ArrowRight" },
    { "wait": 30 },
    { "release": "ArrowRight" },
    { "expect": { "state.player.x": { "gt": 200 } } },
    { "set": { "player.speed": 400 } },
    { "capture": "after-move" }
  ]
}
```

Save it in `scenarios/`, then run:

```bash
npx debuff scenario            # all scenarios
npx debuff scenario --update   # accept new screenshots as baselines
```

## Steps

| Step | Effect |
| --- | --- |
| `{ "wait": n }` | Advance `n` fixed simulation steps |
| `{ "press": code }` / `{ "release": code }` | Hold or release a key |
| `{ "tap": [x, y] }` | Tap the pointer at logical coordinates |
| `{ "pointerDown" / "pointerMove": [x, y] }`, `{ "pointerUp": true }` | Pointer control |
| `{ "set": { "group.key": value } }` | Change params |
| `{ "expect": { path: comparison } }` | Assert on state: `eq`, `gt`, `gte`, `lt`, `lte`, `approx` |
| `{ "capture": name }` | Screenshot compared with the baseline |

`expect` paths read from the dev state: `scene`, `tick`, `stats.fps`, `state.*` (your scene's `inspect()`), and `plugins.*`.

Baselines are stored per operating system, because fonts render differently on each.
