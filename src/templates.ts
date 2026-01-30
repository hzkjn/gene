export const templates = [
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
