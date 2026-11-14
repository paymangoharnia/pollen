// Build every app workspace (folders in apps/ that define a "build" script).
import { readdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const appsDir = join(root, "apps");

if (!existsSync(appsDir)) {
  console.error("No apps/ directory found.");
  process.exit(1);
}

const apps = readdirSync(appsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => join(appsDir, d.name))
  .filter((p) => {
    const pkg = join(p, "package.json");
    if (!existsSync(pkg)) return false;
    const json = JSON.parse(readFileSync(pkg, "utf8"));
    return Boolean(json.scripts?.build);
  });

if (apps.length === 0) {
  console.log("No apps with a build script. Nothing to do.");
  process.exit(0);
}

let failed = false;
for (const app of apps) {
  const name = app.split(/[\\/]/).pop();
  console.log(`\n=== Building ${name} ===`);
  const res = spawnSync("npm", ["run", "build", "--workspace", name], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (res.status !== 0) {
    console.error(`Build failed for ${name}`);
    failed = true;
    break;
  }
}

process.exit(failed ? 1 : 0);
