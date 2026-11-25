import type { Builtin, Ctx, Program, Result, Shell } from "./types";

/**
 * Resolves one line's words in the order every shell does: builtins before
 * `$PATH`. Stateless, so the rule reads in one screen and tests without a DOM.
 */
export async function dispatch(
  words: readonly string[],
  tables: Readonly<{ builtins: readonly Builtin[]; path: readonly Program[] }>,
  shell: Shell,
): Promise<Result | null> {
  const [name, ...args] = words;

  // A line that lexes to nothing is not a command and does not touch `$?`.
  if (name === undefined) return null;

  const builtin = tables.builtins.find((candidate) => candidate.name === name);
  if (builtin) return builtin.run(shell, args);

  const program = tables.path.find((candidate) => candidate.name === name);
  if (program) {
    // Built fresh rather than passing `shell` down, so the capability boundary
    // holds at runtime and not only at compile time.
    const ctx: Ctx = {
      cwd: shell.cwd,
      home: shell.home,
      disk: shell.disk,
      env: shell.env,
      tty: shell.tty,
    };
    return program.run(ctx, args);
  }

  // 127: the status every shell returns for a name it could not resolve.
  return { status: 127, out: `commande introuvable : ${name} (tapez 'help')` };
}
