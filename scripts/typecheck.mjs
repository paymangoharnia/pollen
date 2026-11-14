// Run tsc --noEmit for every workspace that has a tsconfig.json.
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const targets = ["apps", "packages"]
  .map((d) => join(root, d))
  .filter((d) => existsSync(d))
  .flatMap((dir) =>
    readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => join(dir, e.name))
      .filter((p) => existsSync(join(p, "tsconfig.json")))
  );

if (targets.length === 0) {
  console.log("No TypeScript workspaces found.");
  process.exit(0);
}

let failed = false;
for (const t of targets) {
  const name = t.slice(root.length + 1);
  console.log(`\n=== Typechecking ${name} ===`);
  const res = spawnSync("npx", ["tsc", "--noEmit"], {
    cwd: t,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (res.status !== 0) failed = true;
}

process.exit(failed ? 1 : 0);
