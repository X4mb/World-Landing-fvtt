const MODULE_ID = "world-landing-whfrp4e";
const SETTING_DEFAULT_SCENE = "defaultSceneId";
const SETTING_LAST_BOOT = "lastBootEpoch";

// If the server-reported boot time differs from what we last saw by more
// than this, treat it as a genuine restart rather than clock/network jitter.
const BOOT_TOLERANCE_MS = 15000;

function log(...args) {
  console.log(`${MODULE_ID} |`, ...args);
}

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, SETTING_DEFAULT_SCENE, {
    scope: "world",
    config: false,
    type: String,
    default: ""
  });
  game.settings.register(MODULE_ID, SETTING_LAST_BOOT, {
    scope: "world",
    config: false,
    type: Number,
    default: 0
  });
});

function getSceneIdFromRow(li) {
  return li.dataset.documentId ?? li.dataset.entryId ?? li.dataset.sceneId ?? null;
}

function isDefaultScene(li) {
  const sceneId = getSceneIdFromRow(li);
  return !!sceneId && sceneId === game.settings.get(MODULE_ID, SETTING_DEFAULT_SCENE);
}

async function setDefaultScene(li) {
  const sceneId = getSceneIdFromRow(li);
  if (!sceneId) return;
  await game.settings.set(MODULE_ID, SETTING_DEFAULT_SCENE, sceneId);
  const scene = game.scenes.get(sceneId);
  ui.notifications.info(game.i18n.format("WORLDLANDING.SetNotification", { name: scene?.name ?? sceneId }));
}

async function clearDefaultScene() {
  await game.settings.set(MODULE_ID, SETTING_DEFAULT_SCENE, "");
  ui.notifications.info(game.i18n.localize("WORLDLANDING.UnsetNotification"));
}

function addSceneContextOptions(_application, options) {
  options.push(
    {
      name: "WORLDLANDING.ContextSet",
      icon: '<i class="fa-solid fa-house"></i>',
      condition: (li) => game.user.isGM && !isDefaultScene(li),
      callback: (li) => setDefaultScene(li)
    },
    {
      name: "WORLDLANDING.ContextUnset",
      icon: '<i class="fa-solid fa-house-circle-check"></i>',
      condition: (li) => game.user.isGM && isDefaultScene(li),
      callback: () => clearDefaultScene()
    }
  );
}

// "getSceneContextOptions" is the current (v13+) hook name; the legacy alias
// is kept as a harmless no-op fallback in case an older point release still
// uses it instead.
Hooks.on("getSceneContextOptions", addSceneContextOptions);
Hooks.on("getSceneDirectoryEntryContext", addSceneContextOptions);

/**
 * There is no client hook for "the world process just booted" as distinct
 * from "a client connected to an already-running world". We approximate it
 * using the server's uptime, exposed by Foundry's own /api/status route,
 * falling back to an active-user heuristic if that's ever unavailable.
 */
async function isFreshWorldBoot() {
  try {
    const response = await fetch(`${window.location.origin}/api/status`);
    if (!response.ok) throw new Error(`status endpoint returned ${response.status}`);
    const data = await response.json();
    if (typeof data.uptime !== "number") throw new Error("status endpoint had no uptime field");

    const bootEpoch = Date.now() - data.uptime;
    const lastBootEpoch = game.settings.get(MODULE_ID, SETTING_LAST_BOOT);
    const isFresh = Math.abs(bootEpoch - lastBootEpoch) > BOOT_TOLERANCE_MS;
    if (isFresh) await game.settings.set(MODULE_ID, SETTING_LAST_BOOT, bootEpoch);
    return isFresh;
  } catch (err) {
    log("could not read server uptime, falling back to active-user check:", err);
    return game.users.filter((u) => u.active).length <= 1;
  }
}

Hooks.once("ready", async () => {
  if (!game.user.isGM) return;

  const sceneId = game.settings.get(MODULE_ID, SETTING_DEFAULT_SCENE);
  if (!sceneId) return;

  const scene = game.scenes.get(sceneId);
  if (!scene) {
    log(`configured default scene "${sceneId}" no longer exists`);
    return;
  }

  if (game.scenes.active?.id === scene.id) return;
  if (!(await isFreshWorldBoot())) return;

  await scene.activate();
  log(`activated default scene "${scene.name}" on world start`);
});
