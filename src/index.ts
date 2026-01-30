#!/usr/bin/env node
import { execSync } from "node:child_process";
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

const args = process.argv.slice(2);
const appName = args[0];

if (!appName) {
  console.error(pc.red("❌ Please provide an app name"));
  process.exit(1);
}

const templateArg =
  args.find(a => a.startsWith("--template="))?.split("=")[1] ||
  args[args.indexOf("-t") + 1];

const templates = [
  { value: "web", label: "Web App", hint: "Standard single-tenant web app" },
  { value: "mobile", label: "Mobile App", hint: "iOS / Android application" },
  { value: "browser-extension", label: "Browser Extension", hint: "Chrome / Firefox extension" },
  { value: "api", label: "API Server", hint: "Backend service (REST / RPC)" },
  { value: "cli", label: "CLI Tool", hint: "Command-line application" },
  { value: "lib", label: "Library", hint: "Reusable package / SDK" },
  {
    value: "saas-workspaces",
    label: "SaaS (Workspaces)",
    hint: "Slack / GitHub-style multi-tenant app",
  },
  {
    value: "saas-domains",
    label: "SaaS (Custom Domains)",
    hint: "Shopify / Jira-style SaaS",
  },
];

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

  const targetDir = path.resolve(process.cwd(), appName!);

  if (existsSync(targetDir)) {
    console.error(pc.red(`❌ Directory "${appName}" already exists`));
    process.exit(1);
  }

  console.log(pc.cyan(`\nCreating ${appName} using "${template}" template...\n`));

  execSync(`git clone https://github.com/hzkjn/gene-core.git ${appName}/.gene-core`, {
    stdio: "inherit",
  });

  execSync(
    `cp -R ${appName}/.gene-core/templates/${template}/* ${appName}`,
    { stdio: "inherit" }
  );

  execSync(`rm -rf ${appName}/.gene-core`, { stdio: "inherit" });

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
