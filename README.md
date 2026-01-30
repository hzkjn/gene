# Gene

[![Test](https://github.com/hzkjn/gene/actions/workflows/test.yml/badge.svg)](https://github.com/hzkjn/gene/actions/workflows/test.yml)
[![Release](https://github.com/hzkjn/gene/actions/workflows/release.yml/badge.svg)](https://github.com/hzkjn/gene/actions/workflows/release.yml)

CLI scaffolder for HZKJN apps.

Gene helps you quickly scaffold different types of applications (web, SaaS, mobile, CLI, etc.) with sensible defaults and opinionated structure.

---

## Usage

### Standard usage

```bash
bun create @hzkjn/gene my-app
```

This will prompt you to select the type of app you want to create.

### Power user mode (skip prompts)

```bash
bun create @hzkjn/gene my-app --template saas-workspaces
```

or

```bash
bun create @hzkjn/gene my-app -t web
```

Available templates include:

- `web`
- `mobile`
- `browser-extension`
- `api`
- `cli`
- `lib`
- `saas-workspaces`
- `saas-domains`

---

## For App Developers (using Gene)

After scaffolding your app:

```bash
cd my-app
bun install
bun run dev
```

That’s it. You’re ready to build.

---

## For Gene Maintainers (developing Gene itself)

When making changes to **Gene** (the CLI):

1. Run tests
   ```bash
   bun test
   ```

2. Build the package
   ```bash
   bun run build
   ```

3. Bump the version
   ```bash
   npm version <major|minor|patch>
   ```

4. Push commits and tags
   ```bash
   git push
   git push --tags
   ```

Publishing is handled via GitHub Actions.

> ⚠️ Do not publish manually.  
> Tagged releases trigger the automated publish workflow.

---

## License

MIT
