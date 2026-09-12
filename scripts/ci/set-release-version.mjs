import { readFileSync, writeFileSync } from "node:fs";

const tag = process.env.RELEASE_TAG;
const repo = process.env.GITHUB_REPOSITORY;
if (!tag || !repo) {
  throw new Error("RELEASE_TAG and GITHUB_REPOSITORY environment variables must be set");
}

const version = tag.replace(/^v/, "");
const manifest = JSON.parse(readFileSync("module.json", "utf8"));
manifest.version = version;
manifest.download = `https://github.com/${repo}/releases/download/${tag}/module.zip`;
writeFileSync("module.json", `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`Set module.json version to ${version}, download to ${manifest.download}`);
