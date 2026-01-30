#!/usr/bin/env node

// src/index.ts
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
var appName = process.argv[2];
if (!appName) {
  console.error("❌ Please provide an app name");
  process.exit(1);
}
console.log(`\uD83C\uDF31 Creating ${appName}...`);
if (existsSync(appName)) {
  console.error(`❌ Directory "${appName}" already exists`);
  process.exit(1);
}
execSync(`mkdir ${appName}`, { stdio: "inherit" });
execSync(`cd ${appName} && git init`, { stdio: "inherit" });
execSync(`git clone git@github.com:hzkjn/gene-core.git ${appName}/.gene-core`, { stdio: "inherit" });
execSync(`cp -R ${appName}/.gene-core/* ${appName}`, { stdio: "inherit" });
execSync(`rm -rf ${appName}/.gene-core`, { stdio: "inherit" });
console.log(`✅ ${appName} is ready`);
