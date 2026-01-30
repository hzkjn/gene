#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import pc from "picocolors";
import {
  intro,
  outro,
  select,
  text,
  cancel,
  isCancel,
} from "@clack/prompts";
import { templates } from "./templates";

const args = process.argv.slice(2);

const templateArg = (() => {
  const long = args.find(a => a.startsWith("--template="));
  if (long) return long.split("=")[1];

  const shortIndex = args.indexOf("-t");
  if (shortIndex !== -1 && args[shortIndex + 1]) {
    return args[shortIndex + 1];
  }

  return undefined;
})();

// Get app name from args, excluding flags
let appName = args.find(arg => !arg.startsWith("-") && arg !== templateArg);

async function main() {
  intro(pc.green("🌱 Gene App Generator"));

  if (!appName) {
    const nameInput = await text({
      message: "What is the name of your app?",
      placeholder: "my-app",
      validate: (value) => {
        if (!value) return "App name is required";
        if (!/^[a-z0-9-]+$/.test(value)) {
          return "App name must be lowercase alphanumeric with dashes";
        }
      },
    });

    if (isCancel(nameInput)) {
      cancel("Operation cancelled.");
      process.exit(0);
    }

    appName = nameInput as string;
  }

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

  const targetDir = path.resolve(process.cwd(), appName);

  if (existsSync(targetDir)) {
    console.error(pc.red(`❌ Directory "${appName}" already exists`));
    process.exit(1);
  }

  console.log(pc.cyan(`\nCreating ${appName} using "${template}" template...\n`));

  execSync(`git clone https://github.com/hzkjn/gene-core.git ${appName}/.gene-core`, {
    stdio: "inherit",
  });

  execSync(
    `cp -R ${appName}/.gene-core/templates/${template as string}/. ${appName}`,
    { stdio: "inherit" }
  );

  execSync(`rm -rf ${appName}/.gene-core`, { stdio: "inherit" });

  // Replace {{appName}} placeholder in package.json
  const pkgPath = path.join(targetDir, "package.json");
  if (existsSync(pkgPath)) {
    const pkg = readFileSync(pkgPath, "utf-8");
    writeFileSync(pkgPath, pkg.replaceAll("{{appName}}", appName));
  }

  execSync(`cd ${appName} && git init`, { stdio: "inherit" });

  outro(pc.green("✅ App created successfully!"));

  console.log(
    `\nNext steps:\n  cd ${appName}\n  bun install\n  bun dev\n`
  );
}

main().catch(err => {
  console.error(pc.red("Unexpected error:"), err);
  process.exit(1);
});
