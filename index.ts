#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

const appName = process.argv[2];

if (!appName) {
  console.error("❌ Please provide an app name");
  process.exit(1);
}

console.log(`🌱 Creating ${appName}...`);

if (!existsSync(".git")) {
  execSync("git init", { stdio: "inherit" });
}

execSync(
  "git clone git@github.com:hzkjn/gene-core.git .gene-core",
  { stdio: "inherit" }
);

execSync("cp -R .gene-core/* .", { stdio: "inherit" });
execSync("rm -rf .gene-core", { stdio: "inherit" });

console.log(`✅ ${appName} is ready`);