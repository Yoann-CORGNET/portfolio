import { CommandWord } from "@/components/system/terminal";
import { type Builtin, err, ok } from "./types";
import { resolvePath, stat } from "./vfs";

/**
 * The three commands that cannot be binaries — each needs something no child
 * process can be given. Anything that only reads the session belongs in
 * `coreutils.ts`, where the `Ctx` type says so.
 */

/** No `/bin/cd` exists on any Unix: a child's chdir dies with the child. */
const cd: Builtin = {
  name: "cd",
  usage: "cd <dossier>",
  desc: "changer de dossier",
  run(shell, args) {
    const arg = args[0] ?? "~";
    const target = resolvePath(shell.home, shell.cwd, arg);
    const node = stat(shell.disk, target);

    if (!node) return err(`cd: ${arg}: dossier introuvable`);
    if (node.type !== "dir") return err(`cd: ${arg}: n'est pas un dossier`);

    shell.chdir(target);
    return ok(); // The new prompt is the output.
  },
};

/** Prints the shell's own command table — the same data dispatch reads. */
const help: Builtin = {
  name: "help",
  desc: "cette liste",
  run: (shell) =>
    ok(
      <>
        <div>Commandes disponibles :</div>
        <ul className="mt-1 list-none">
          {shell.commands.map((command) => (
            <li key={command.name}>
              <CommandWord>{command.usage ?? command.name}</CommandWord>: {command.desc}
            </li>
          ))}
        </ul>
      </>,
    ),
};

/** The ring belongs to the line reader, which is why bash's is a builtin. */
const history: Builtin = {
  name: "history",
  desc: "les commandes déjà tapées",
  run(shell) {
    if (shell.history.length === 0) return ok("vide, pour l'instant");
    return ok(
      <ul className="list-none">
        {shell.history.map((entry, index) => (
          // Two identical lines are two real entries; position is the identity.
          <li key={`${index}-${entry}`}>
            <span style={{ opacity: 0.5 }}>{String(index + 1).padStart(3, " ")}</span> {entry}
          </li>
        ))}
      </ul>,
    );
  },
};

export const BUILTINS: readonly Builtin[] = [cd, help, history];
