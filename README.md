# World Landing

Pick a scene to auto-activate whenever the world starts, so players always land somewhere intentional (a title card, hub, or menu scene) instead of wherever the last session happened to leave off.

## Installation

> **This module hasn't been merged to `main` or released yet.** `manifest` in `module.json` currently points at the dev branch (`claude/warhammer-fvtt-default-scene-ch6zl5`) so it can be tested; it should be updated to point at `main` once this lands there. No `vX.Y.Z` tag has been pushed either, so there's no `module.zip` yet — manifest-URL install will fetch metadata fine but fail on the download step until one exists. Use the manual install below in the meantime.

**Manifest URL** (works for metadata now; the download step needs a release, see above): In Foundry's setup screen, go to **Add-on Modules** → **Install Module**, paste this into the **Manifest URL** field, and click Install:

```
https://raw.githubusercontent.com/x4mb/World-Landing-whfrp4e/claude/warhammer-fvtt-default-scene-ch6zl5/module.json
```

**Manual install (works today):** Clone or download this repository and place its contents directly in a `world-landing-whfrp4e` folder under your Foundry `Data/modules/` directory, so you end up with `Data/modules/world-landing-whfrp4e/module.json`, then restart Foundry.

Either way, enable **World Landing** from your world's **Manage Modules** screen afterward.

Once a release exists, `download` in `module.json` will resolve automatically (it's set per-release by the CI workflow) and manifest-URL install will work end-to-end.

## Usage

1. In the Scenes sidebar, right-click the scene you want as your landing scene.
2. Choose **Set as Default Scene**.
3. That scene will be activated automatically the next time the world boots (right-click it again and choose **Unset Default Scene** to remove it).

GM only. System-agnostic — built and tested against Foundry v14+ in a WFRP4e world, but has no WFRP4e-specific logic.

## How "world start" is detected

Foundry doesn't expose a hook for "the world process just booted" as distinct from "a client connected to an already-running world." This module asks Foundry's own `/api/status` endpoint for server uptime to figure out whether the server restarted since it last checked, and falls back to an active-user heuristic if that's ever unavailable. See `scripts/module.mjs` for details.

## Development

```sh
npm ci
npm run validate   # checks module.json
npm run lint        # eslint
```

Tagging a commit `vX.Y.Z` and pushing the tag triggers `.github/workflows/release.yml`, which sets the version/download URL in `module.json`, packages `module.zip`, and publishes a GitHub Release with both attached.
