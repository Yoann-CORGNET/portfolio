import type { ReactNode } from "react";
import type { FsNode } from "./vfs";

/**
 * The parts of a terminal this shell needs.
 *
 * Declared structurally, not imported: `TerminalIo` is exported from the system
 * barrel, which the `shell` registry item cannot install (`system` already
 * depends on `shell`, so declaring it back is a cycle). `Terminal` satisfies
 * this shape.
 */
export type Io = {
  clear: () => void;
  /** The line reader's ring buffer, which `history` has nowhere else to read. */
  history: readonly string[];
};

/** What a command may do to the screen: wipe it. Everything else it returns. */
export type Tty = Pick<Io, "clear">;

/** Output and exit status, kept apart — `out` is data, `status` is `$?`. */
export type Result = { readonly status: number; readonly out: ReactNode | null };

export const ok = (out: ReactNode | null = null): Result => ({ status: 0, out });
export const err = (out: ReactNode, status = 1): Result => ({ status, out });

/** Read by `help` and Tab off the command itself, so docs cannot drift. */
export type Manual = {
  readonly name: string;
  readonly usage?: string;
  readonly desc: string;
};

/**
 * What a program may touch: the session, read-only, plus the screen.
 *
 * `dispatch` builds this fresh rather than passing the shell down, so the
 * restriction holds at runtime and not only in the types.
 */
export type Ctx = {
  readonly cwd: readonly string[];
  readonly home: readonly string[];
  readonly disk: FsNode;
  readonly env: Readonly<Record<string, string>>;
  readonly tty: Tty;
};

/**
 * What a builtin gets instead: the shell itself. Everything added here is a
 * capability no child process can have — which is the test for belonging in
 * `builtins.tsx` rather than `coreutils.ts`.
 */
export type Shell = Ctx & {
  /** Why `cd` cannot be a binary: a child's chdir dies with the child. */
  readonly chdir: (path: readonly string[]) => void;
  readonly history: readonly string[];
  /** Everything this shell can run — the table `help` prints. */
  readonly commands: readonly Manual[];
};

export type Program = Manual & {
  readonly run: (ctx: Ctx, args: readonly string[]) => Result | Promise<Result>;
};

export type Builtin = Manual & {
  readonly run: (shell: Shell, args: readonly string[]) => Result | Promise<Result>;
};
