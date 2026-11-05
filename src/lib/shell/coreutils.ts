import { type Program, err, ok } from "./types";
import { absolute, resolvePath, stat } from "./vfs";

/**
 * The standard set. Every one is a real binary on a real Unix — `/usr/bin/pwd`
 * and `/usr/bin/echo` do ship with coreutils, whatever bash shadows for speed —
 * and every one takes a read-only `Ctx`, which is the line between this file
 * and `builtins.tsx`.
 */

const ls: Program = {
  name: "ls",
  usage: "ls [dossier]",
  desc: "ce qu'il y a autour",
  run(ctx, args) {
    const arg = args[0];
    const node = stat(ctx.disk, arg ? resolvePath(ctx.home, ctx.cwd, arg) : ctx.cwd);

    // Status 2, as coreutils uses for a path it cannot read.
    if (!node) return err(`ls: ${arg}: dossier introuvable`, 2);
    if (node.type !== "dir") return ok(arg ?? "");

    const names = Object.keys(node.children);
    if (names.length === 0) return ok("(vide)");
    return ok(names.map((n) => (node.children[n].type === "dir" ? `${n}/` : n)).join("  "));
  },
};

const cat: Program = {
  name: "cat",
  usage: "cat <fichier>",
  desc: "affiche un fichier",
  run(ctx, args) {
    const arg = args[0];
    if (!arg) return err("cat: argument manquant");

    const node = stat(ctx.disk, resolvePath(ctx.home, ctx.cwd, arg));
    if (!node) return err(`cat: ${arg}: fichier introuvable`);
    if (node.type === "dir") return err(`cat: ${arg}: est un dossier`);
    return ok(node.content);
  },
};

/** A binary, genuinely: `/usr/bin/pwd` ships with coreutils. */
const pwd: Program = {
  name: "pwd",
  desc: "le dossier dans lequel vous êtes",
  run: (ctx) => ok(absolute(ctx.cwd)),
};

const echo: Program = {
  name: "echo",
  usage: "echo <texte>",
  desc: "répète le texte",
  // Words arrive lexed and expanded. The space keeps a bare `echo`'s row from
  // collapsing to zero height.
  run: (_ctx, args) => ok(args.join(" ") || " "),
};

const whoami: Program = {
  name: "whoami",
  desc: "votre identité ici",
  run: (ctx) => ok(ctx.env.USER ?? "inconnu"),
};

const date: Program = {
  name: "date",
  desc: "l'heure qu'il est",
  run: () => ok(new Date().toString()),
};

const clear: Program = {
  name: "clear",
  desc: "vide l'écran",
  run(ctx) {
    // `/usr/bin/clear` is a real program: it writes an escape sequence and lets
    // the emulator do the wiping. `tty.clear()` is that sequence.
    ctx.tty.clear();
    return ok();
  },
};

export const COREUTILS: readonly Program[] = [ls, cat, pwd, echo, whoami, date, clear];
