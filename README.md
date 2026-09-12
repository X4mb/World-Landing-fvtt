# World Landing

Pick a scene to auto-activate whenever the world starts, so players always land somewhere intentional (a title card, hub, or menu scene) instead of wherever the last session happened to leave off.

## Installation

**Manifest URL (recommended):** In Foundry's setup screen, go to **Add-on Modules** → **Install Module**, paste this into the **Manifest URL** field, and click Install:

```
https://github.com/x4mb/World-Landing-whfrp4e/releases/latest/download/module.json
```

**Manual install:** Download `module.zip` from the [latest release](https://github.com/x4mb/World-Landing-whfrp4e/releases/latest), unzip it into your Foundry `Data/modules/` folder (so you end up with `Data/modules/world-landing-whfrp4e/`), then restart Foundry.

Either way, enable **World Landing** from your world's **Manage Modules** screen afterward.

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
