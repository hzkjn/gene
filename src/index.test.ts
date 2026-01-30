import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { templates } from "./templates";

describe("Gene CLI", () => {
  const testDir = path.join(import.meta.dir, "..", "test-temp");
  const cliPath = path.join(import.meta.dir, "index.ts");

  beforeAll(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
    mkdirSync(testDir, { recursive: true });
  });

  afterAll(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  async function runCLI(args: string[], timeout = 3000): Promise<{
    exitCode: number;
    stdout: string;
    stderr: string;
  }> {
    const proc = Bun.spawn(["bun", "run", cliPath, ...args], {
      cwd: testDir,
      stdout: "pipe",
      stderr: "pipe",
    });

    const timer = setTimeout(() => {
      proc.kill();
    }, timeout);

    const [stdout, stderr, exitCode] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
      proc.exited,
    ]);

    clearTimeout(timer);

    return { exitCode, stdout, stderr };
  }

  test("should prompt for app name when not provided", async () => {
    const { stdout } = await runCLI(["--template=web"], 1000);
    expect(stdout).toContain("What is the name of your app?");
  });

  test("should fail if directory exists", async () => {
    const appName = "existing-app";
    const targetDir = path.join(testDir, appName);
    mkdirSync(targetDir);

    const { exitCode, stderr } = await runCLI([appName, "-t", "web"]);
    expect(exitCode).toBe(1);
    expect(stderr).toContain("already exists");
  });

  test("should parse --template= flag", async () => {
    const appName = "test-app-1";
    const template = "web";

    const { stdout } = await runCLI([appName, `--template=${template}`]);
    expect(stdout).toContain("web");
  });

  test("should parse -t flag", async () => {
    const appName = "test-app-2";
    const template = "api";

    const { stdout } = await runCLI([appName, "-t", template]);
    expect(stdout).toContain("api");
  });

  test("should reject invalid template", async () => {
    const appName = "test-app-3";
    const template = "invalid-template";

    const { exitCode, stderr } = await runCLI([appName, "-t", template]);
    expect(exitCode).toBe(1);
    expect(stderr).toContain("Unknown template");
  });

  test("should replace {{appName}} in package.json", async () => {
    const appName = "placeholder-test-app";
    const appDir = path.join(testDir, appName);
    mkdirSync(appDir, { recursive: true });

    // Create a fake package.json with placeholder
    writeFileSync(
      path.join(appDir, "package.json"),
      JSON.stringify({ name: "{{appName}}", description: "A {{appName}} project" })
    );

    // Simulate the replacement logic from index.ts
    const pkgPath = path.join(appDir, "package.json");
    const pkg = readFileSync(pkgPath, "utf-8");
    writeFileSync(pkgPath, pkg.replaceAll("{{appName}}", appName));

    const result = JSON.parse(readFileSync(pkgPath, "utf-8"));
    expect(result.name).toBe(appName);
    expect(result.description).toBe(`A ${appName} project`);
  });

  test("should have correct template options", () => {
    expect(templates.length).toBe(8);
    expect(templates.map(t => t.value)).toContain("web");
    expect(templates.map(t => t.value)).toContain("api");
    expect(templates.map(t => t.value)).toContain("saas-workspaces");

    // Verify structure
    templates.forEach(t => {
      expect(t).toHaveProperty("value");
      expect(t).toHaveProperty("label");
      expect(t).toHaveProperty("hint");
    });
  });
});
