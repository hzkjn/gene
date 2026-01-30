#!/usr/bin/env node
import { existsSync } from "node:fs";
import path from "node:path";
import pc from "picocolors";
import {
  intro,
  outro,
  select,
  cancel,
  isCancel,
} from "@clack/prompts";
import { templates } from "./templates";

const args = process.argv.slice(2);
const appName = args[0];

if (!appName) {
  console.error(pc.red("❌ Please provide an app name"));
  process.exit(1);
}

const templateArg = (() => {
  const long = args.find(a => a.startsWith("--template="));
  if (long) return long.split("=")[1];

  const shortIndex = args.indexOf("-t");
  if (shortIndex !== -1 && args[shortIndex + 1]) {
    return args[shortIndex + 1];
  }

  return undefined;
})();

async function main() {
  intro(pc.green("🌱 Gene App Generator"));

  const template =
    templateArg ??
    (await select({
      message: "Select the type of app to create:",
      options: templates,
    }));

  if (isCancel(template)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  if (!templates.some(t => t.value === template)) {
    console.error(pc.red(`❌ Unknown template "${template}"`));
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), appName!);

  if (existsSync(targetDir)) {
    console.error(pc.red(`❌ Directory "${appName}" already exists`));
    process.exit(1);
  }

  console.log(pc.cyan(`\nCreating ${appName} using "${template}" template...\n`));

  await Bun.spawn(["git", "clone", "https://github.com/hzkjn/gene-core.git", `${appName}/.gene-core`], {
    cwd: process.cwd(),
    stdout: "inherit",
    stderr: "inherit",
  }).exited;

  await Bun.spawn(["cp", "-R", `${appName}/.gene-core/templates/${template as string}/.`, appName!], {
    cwd: process.cwd(),
    stdout: "inherit",
    stderr: "inherit",
  }).exited;

  await Bun.spawn(["rm", "-rf", `${appName}/.gene-core`], {
    cwd: process.cwd(),
    stdout: "inherit",
    stderr: "inherit",
  }).exited;

  await Bun.spawn(["git", "init"], {
    cwd: path.join(process.cwd(), appName!),
    stdout: "inherit",
    stderr: "inherit",
  }).exited;

  outro(pc.green("✅ App created successfully!"));

  console.log(
    `\nNext steps:\n  cd ${appName}\n  bun install\n  bun dev\n`
  );
}

main().catch(err => {
  console.error(pc.red("Unexpected error:"), err);
  process.exit(1);
});
