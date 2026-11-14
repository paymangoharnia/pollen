// Deploy every app to GitHub Pages.
//
// Layout: landing page at the repo site root, each app under /<app-name>/.
// Strategy: build each app with `vite build --base /<app-name>/`, assemble a
// staging dir, then push it as a single commit to the `gh-pages` branch via a
// throwaway git repo (no history carried over, idempotent, no extra deps).
//
// Usage: npm run deploy [-- <app-name> ...]   (no args = all apps)
import { readdirSync, existsSync, readFileSync, rmSync, mkdirSync, cpSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const STAGING = join(root, ".deploy-staging");
const LANDING_TEMPLATE = join(root, "scripts", "landing.template.html");
const GITHUB_USER = "paymangoharnia";
const GITHUB_REPO = "pollen";
const SITE_BASE = `https://${GITHUB_USER}.github.io/${GITHUB_REPO}/`;

const onlyApps = process.argv.slice(2).filter((a) => !a.startsWith("-"));

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...opts,
  });
  if (res.status !== 0) {
    throw new Error(`${cmd} ${args.join(" ")} failed with exit code ${res.status}`);
  }
}

function discoverApps() {
  const appsDir = join(root, "apps");
  if (!existsSync(appsDir)) return [];
  return readdirSync(appsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const dir = join(appsDir, d.name);
      const pkgPath = join(dir, "package.json");
      if (!existsSync(pkgPath)) return null;
      const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
      if (!pkg.scripts?.build) return null;
      return {
        name: d.name,
        dir,
        meta: pkg.pollenApp ?? { title: d.name, tagline: "", emoji: "✨" },
      };
    })
    .filter(Boolean)
    .filter((a) => onlyApps.length === 0 || onlyApps.includes(a.name));
}

// ---------------------------------------------------------------- build
const apps = discoverApps();
if (apps.length === 0) {
  console.error("No apps selected/found.");
  process.exit(1);
}

rmSync(STAGING, { recursive: true, force: true });
mkdirSync(join(STAGING, "apps"), { recursive: true });

for (const app of apps) {
  console.log(`\n=== Building ${app.name} ===`);
  run("npx", ["vite", "build", "--base", `/apps/${app.name}/`], { cwd: app.dir });
  cpSync(join(app.dir, "dist"), join(STAGING, "apps", app.name), { recursive: true });
}

// -------------------------------------------------------------- landing
const template = readFileSync(LANDING_TEMPLATE, "utf8");
const cards = apps
  .map(
    (a) => `      <a class="card" href="./apps/${a.name}/">
        <div class="title"><span>${a.meta.emoji ?? "✨"}</span> ${a.meta.title ?? a.name}</div>
        ${a.meta.tagline ? `<div class="desc">${a.meta.tagline}</div>` : ""}
      </a>`
  )
  .join("\n");
writeFileSync(join(STAGING, "index.html"), template.replace("<!--APPS-->", cards));

// ----------------------------------------------------------------- push
console.log("\n=== Publishing to gh-pages ===");
run("git", ["init"], { cwd: STAGING });
run("git", ["checkout", "-b", "gh-pages"], { cwd: STAGING });
run("git", ["add", "-A"], { cwd: STAGING });
run("git", ["commit", "-m", "publish apps to pages"], { cwd: STAGING });
run("git", ["remote", "add", "origin", `https://github.com/${GITHUB_USER}/${GITHUB_REPO}.git`], { cwd: STAGING });
run("git", ["push", "origin", "gh-pages", "--force"], { cwd: STAGING });

console.log(`\n✅ Deployed. Live at ${SITE_BASE} (may take ~1 min to propagate).`);
console.log("   Make sure GitHub Pages is set to: Deploy from branch → gh-pages → root.");
