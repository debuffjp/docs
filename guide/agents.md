# Working with AI agents

Debuff gives agents the same evidence you'd want before trusting a change: what's in the project, what's tunable, what's happening at runtime, and whether the change worked.

| Question | Interface |
| --- | --- |
| What's in this project? | `npx debuff inspect` (JSON) |
| What can be tuned, and within what range? | `__DEBUFF_DEV__.params()` |
| What's happening right now? | `__DEBUFF_DEV__.state()`: scene, tick, frame stats, your `inspect()` data |
| Did the change work? | `npx debuff scenario --json` |
| What does it cost players? | `npx debuff build --json` |

Every CLI command supports `--json`, and every dev-hook call takes and returns JSON.

## A good agent loop

1. Inspect the project and the params involved.
2. Propose the smallest change, and name the files and params it touches.
3. Prefer tuning params over rewriting logic.
4. Run the scenarios; add one if the behaviour isn't covered yet.
5. Report the diff, the scenario results and the build size change.

## Humans stay in charge

Agents can propose and test, but creative direction (art, feel, pacing) is yours. Params and scenario captures make alternatives easy to compare before you choose.
