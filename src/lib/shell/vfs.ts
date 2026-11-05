/**
 * Path resolution, separated from the bytes it resolves against: every walk
 * takes the disk as an argument, so one library serves any filesystem.
 *
 * Nothing here navigates the browser — a shell command moving the page would
 * be a surprise.
 */

/** Deeply readonly: a mutable `children` behind a `readonly` field would let a
 *  program write into a caller's module-level tree and outlive the page. */
export type FsNode =
  | { readonly type: "dir"; readonly children: Readonly<Record<string, FsNode>> }
  | { readonly type: "file"; readonly content: string };

export const dir = (children: Readonly<Record<string, FsNode>> = {}): FsNode => ({
  type: "dir",
  children,
});
export const file = (content: string): FsNode => ({ type: "file", content });

/**
 * A disk with the usual skeleton: `/home/<user>` — whose name must match the
 * shell's `user` — plus `/etc` and `/tmp`. `children` lands in home, `root`
 * merges over the top level.
 */
export function homeDisk(
  user: string,
  children: Readonly<Record<string, FsNode>> = {},
  root: Readonly<Record<string, FsNode>> = {},
): FsNode {
  return dir({ home: dir({ [user]: dir(children) }), etc: dir(), tmp: dir(), ...root });
}

/** Resolves `raw` (absolute, `~`-relative, or relative to `cwd`). May not exist. */
export function resolvePath(
  home: readonly string[],
  cwd: readonly string[],
  raw: string,
): string[] {
  let base: string[];
  let rest = raw;

  if (raw.startsWith("~")) {
    base = [...home];
    rest = raw.slice(1).replace(/^\//, "");
  } else if (raw.startsWith("/")) {
    base = [];
    rest = raw.slice(1);
  } else {
    base = [...cwd];
  }

  for (const segment of rest.split("/").filter(Boolean)) {
    if (segment === ".") continue;
    else if (segment === "..") base.pop();
    else base.push(segment);
  }

  return base;
}

/** The node at `path`, or `undefined`. */
export function stat(disk: FsNode, path: readonly string[]): FsNode | undefined {
  let node: FsNode = disk;
  for (const segment of path) {
    if (node.type !== "dir") return undefined;
    const next: FsNode | undefined = node.children[segment];
    if (!next) return undefined;
    node = next;
  }
  return node;
}

/** An absolute path, the way `pwd` prints it. */
export function absolute(path: readonly string[]): string {
  return path.length === 0 ? "/" : `/${path.join("/")}`;
}

/** `~`, `~/sub`, or the absolute path — whichever a real prompt would show. */
export function displayPath(home: readonly string[], cwd: readonly string[]): string {
  const underHome = home.every((segment, i) => cwd[i] === segment);
  if (underHome && cwd.length === home.length) return "~";
  if (underHome) return `~/${cwd.slice(home.length).join("/")}`;
  return absolute(cwd);
}
