/**
 * Guards the shadcn registry against the two gaps that a green build cannot see.
 *
 * A component can be exported from the barrel, compile, and ship on the site,
 * yet be missing from registry.json — so `shadcn add @yoann/system` installs a
 * barrel that imports a file it never wrote. That is exactly how the Logo
 * component slipped through once. The build stays green because the *site*
 * doesn't need the registry; only a consumer does.
 *
 * This is deterministic, offline, and reads a handful of files, so it belongs
 * in pre-push and CI rather than in a human's memory. It does NOT replace the
 * install smoke test (scaffold a project, `add`, build): that catches the
 * import-rewrite class this cannot. This catches the omission class.
 *
 * Three assertions, any failure exits non-zero:
 *   A. every module the barrel re-exports is shipped by some registry item;
 *   B. every path a registry item ships exists on disk;
 *   C. every in-namespace import of a shipped file is itself shipped.
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const rel = (p) => relative(root, p);

/** The two namespaces this registry owns. Imports outside them (@/lib/utils,
 *  node_modules) are somebody else's problem and are skipped. */
const OWNED = ["@/lib/design/", "@/components/system/"];
const aliasToPath = (spec) => resolve(root, "src", spec.slice(2)); // "@/x" -> src/x

/** Resolves a module specifier to a concrete .ts/.tsx file, or null. */
function resolveFile(fromFile, spec) {
  let base;
  if (spec.startsWith("@/")) base = aliasToPath(spec);
  else if (spec.startsWith(".")) base = resolve(dirname(fromFile), spec);
  else return null; // bare import, not ours
  for (const ext of [".ts", ".tsx", "/index.ts", "/index.tsx"]) {
    if (existsSync(base + ext)) return base + ext;
  }
  return existsSync(base) ? base : null;
}

const importSpecs = (file) => {
  const src = readFileSync(file, "utf8");
  const specs = [];
  const re = /(?:from|import)\s+["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(src))) specs.push(m[1]);
  return specs;
};

const errors = [];

// --- load the registry --------------------------------------------------
const registryPath = resolve(root, "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));

/** Absolute path of every file any item ships. */
const shipped = new Set();
for (const item of registry.items) {
  for (const f of item.files ?? []) shipped.add(resolve(root, f.path));
}

// --- B. every shipped path exists on disk -------------------------------
for (const item of registry.items) {
  for (const f of item.files ?? []) {
    if (!existsSync(resolve(root, f.path))) {
      errors.push(`[B] item "${item.name}" ships "${f.path}", which is not on disk (renamed?).`);
    }
  }
}

// --- A. every module the barrel re-exports is shipped -------------------
const barrel = resolve(root, "src/components/system/index.ts");
if (!shipped.has(barrel)) {
  errors.push(`[A] the barrel ${rel(barrel)} is itself not shipped by any item.`);
}
for (const spec of importSpecs(barrel)) {
  const target = resolveFile(barrel, spec);
  if (!target) continue; // type-only path or unresolved; not our concern
  if (!shipped.has(target)) {
    errors.push(
      `[A] the barrel re-exports "${spec}" (${rel(target)}) but no registry item ships it.`,
    );
  }
}

// --- C. every owned import of a shipped file is itself shipped ----------
for (const file of shipped) {
  if (!/\.(ts|tsx)$/.test(file) || !existsSync(file)) continue;
  for (const spec of importSpecs(file)) {
    if (!OWNED.some((ns) => spec.startsWith(ns))) continue;
    const target = resolveFile(file, spec);
    if (target && !shipped.has(target)) {
      errors.push(
        `[C] ${rel(file)} imports "${spec}" (${rel(target)}), which no registry item ships.`,
      );
    }
  }
}

// --- report -------------------------------------------------------------
if (errors.length) {
  console.error(`registry:check — ${errors.length} problem(s):\n`);
  for (const e of errors) console.error("  " + e);
  console.error(
    "\nEvery library file the barrel needs must be shipped by a registry.json item.\n" +
      "Add the missing file to an item's `files`, or a new item to `registry.json`.",
  );
  process.exit(1);
}

console.log(
  `registry:check — ok (${shipped.size} files shipped across ${registry.items.length} items).`,
);
