# Input

Bind named actions to any mix of keys, pointer and gamepad, then ask about actions, not devices.

```ts
import { Input } from "@debuffjp/input";

const input = new Input(game, {
  bindings: {
    left: ["ArrowLeft", "KeyA", "PadLeft", "PadStickLeft"],
    right: ["ArrowRight", "KeyD", "PadRight", "PadStickRight"],
    jump: ["Space", "PadA", "Pointer"],
  },
});

// in update(dt)
player.vx = input.axis("left", "right") * speed;
if (input.pressed("jump")) jump();
```

- `down(action)`: held now
- `pressed(action)` / `released(action)`: changed this step. Taps shorter than a frame are never missed.
- `axis(negative, positive)`: −1, 0 or 1

## Binding names

| Source | Names |
| --- | --- |
| Keyboard | [`KeyboardEvent.code`](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/code) values: `Space`, `KeyZ`, `ArrowUp`… These are layout-independent |
| Pointer | `Pointer` (mouse button, touch or pen) |
| Gamepad buttons | `PadA` `PadB` `PadX` `PadY` `PadL1` `PadR1` `PadL2` `PadR2` `PadSelect` `PadStart` `PadL3` `PadR3` `PadUp` `PadDown` `PadLeft` `PadRight` |
| Left stick | `PadStickUp` `PadStickDown` `PadStickLeft` `PadStickRight` |

`input.pointer` gives the primary pointer's logical `x`/`y` and every active touch in `touches`.
