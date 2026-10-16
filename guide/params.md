# Tunable params

Pull the numbers that shape how your game feels out of the code and into typed params. You can tune them live, agents can read and adjust them safely, and scenarios can test them.

```ts
const tuning = game.params.define("player", {
  speed: { type: "number", default: 140, min: 0, max: 600, units: "px/s", description: "Run speed" },
  doubleJump: { type: "boolean", default: false },
});

// read every frame; it's a plain property lookup
player.vx = dir * tuning.values.speed;
```

- Values are validated: out-of-range or wrong-typed sets throw instead of silently clamping.
- `game.params.describe()` returns every schema and value as JSON.
- `game.params.onChange(fn)` notifies you of edits from anywhere.

## Tuning live

In dev, press <kbd>`</kbd> for the overlay. Every param group gets sliders and toggles, a reset button, and **copy JSON** to save the values you like as a preset.

From the console, or from an agent:

```js
__DEBUFF_DEV__.setParam("player", "speed", 220);
```

In a scenario:

```json
{ "set": { "player.speed": 220 } }
```
