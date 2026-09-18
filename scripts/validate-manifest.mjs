import { readFileSync, existsSync } from "node:fs";

const REQUIRED_FIELDS = ["id", "title", "description", "version", "compatibility", "esmodules"];

let ok = true;
function fail(message) {
  console.error(`✖ ${message}`);
  ok = false;
}

const raw = readFileSync(new URL("../module.json", import.meta.url), "utf8");

let manifest;
try {
  manifest = JSON.parse(raw);
} catch (err) {
  console.error(`✖ module.json is not valid JSON: ${err.message}`);
  process.exit(1);
}

for (const field of REQUIRED_FIELDS) {
  if (!(field in manifest)) fail(`module.json is missing required field "${field}"`);
}

if (!manifest.compatibility?.minimum) {
  fail("module.json compatibility.minimum is required");
}

for (const path of manifest.esmodules ?? []) {
  if (!existsSync(new URL(`../${path}`, import.meta.url))) {
    fail(`esmodule "${path}" referenced in module.json does not exist`);
  }
}

for (const path of manifest.styles ?? []) {
  if (!existsSync(new URL(`../${path}`, import.meta.url))) {
    fail(`stylesheet "${path}" referenced in module.json does not exist`);
  }
}

for (const lang of manifest.languages ?? []) {
  if (!existsSync(new URL(`../${lang.path}`, import.meta.url))) {
    fail(`language file "${lang.path}" referenced in module.json does not exist`);
  }
}

if (!ok) process.exit(1);
console.log("✔ module.json looks valid");
