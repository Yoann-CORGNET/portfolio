"use client";

import { type ReactNode, useState } from "react";
import { BUILTINS } from "./builtins";
import { COREUTILS } from "./coreutils";
import { dispatch } from "./dispatch";
import { lex } from "./lex";
import type { Io, Manual, Program } from "./types";
import { type FsNode, absolute, dir, displayPath, file, homeDisk } from "./vfs";

/**
 * Specialises the default shell rather than replacing it — a caller supplies a
 * disk, a name and its own commands, and inherits the rest.
 */
export type ShellConfig = {
  /** `$USER`, the left half of the prompt, and the name of the home directory. */
  user?: string;
  /** The right half of the prompt. */
  hostname?: string;
  /** The tree `ls`, `cd` and `cat` walk; `homeDisk` builds the usual shape. */
  disk?: FsNode;
  /** Commands on top of the standard set. A shared name shadows the standard. */
  bin?: readonly Program[];
  /** Printed before the first prompt. */
  motd?: ReactNode;
  env?: Readonly<Record<string, string>>;
};

/** Enough that `ls`, `cd` and `cat` do something with no configuration. */
const defaultDisk = (user: string): FsNode =>
  homeDisk(user, {
    "lisez-moi.txt": file("Un terminal qui marche tout seul. Tapez help pour la suite."),
    notes: dir({ "todo.txt": file("Rien à faire. C'est déjà fait.") }),
  });

/**
 * A working shell: `<Terminal {...useShell()} />` is eleven commands and a
 * filesystem.
 *
 * A hook the caller calls rather than something `Terminal` wires up internally
 * — hooks cannot be conditional, so an internal shell would land in every
 * consumer's bundle including those who brought their own.
 *
 * Unmemoised on purpose: nothing downstream observes referential identity, and
 * this re-runs only per submitted command.
 */
export function useShell(config: ShellConfig = {}) {
  const { user = "invite", hostname = "localhost", bin, motd, disk, env: extraEnv } = config;

  const home = ["home", user];
  const [cwd, setCwd] = useState<readonly string[]>(home);
  /** `$?` — the exit status of the last command. */
  const [status, setStatus] = useState(0);

  const filesystem = disk ?? defaultDisk(user);
  // Earlier in the table shadows later, as an earlier `$PATH` directory would.
  const tables = { builtins: BUILTINS, path: [...(bin ?? []), ...COREUTILS] };

  /** The command objects themselves: `Program` and `Builtin` are both `Manual`. */
  const commands: readonly Manual[] = [...tables.builtins, ...tables.path];

  const env: Readonly<Record<string, string>> = {
    USER: user,
    HOME: absolute(home),
    PWD: absolute(cwd),
    SHELL: "/bin/sh",
    TERM: "xterm-256color",
    ...extraEnv,
  };

  async function exec(input: string, io: Io): Promise<ReactNode | null> {
    const expand = (name: string) => (name === "?" ? String(status) : (env[name] ?? ""));

    const result = await dispatch(lex(input, expand), tables, {
      cwd,
      home,
      disk: filesystem,
      env,
      tty: { clear: io.clear },
      chdir: setCwd,
      history: io.history,
      commands,
    });

    if (result === null) return null;
    setStatus(result.status);
    return result.out;
  }

  // Shaped to spread straight into `Terminal`.
  return {
    prompt: `${user}@${hostname}:${displayPath(home, cwd)}$`,
    completions: commands.map((command) => command.name),
    banner: motd,
    onRun: exec,
  };
}
