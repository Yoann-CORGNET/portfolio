"use client";

/**
 * Two demos, because the claim is that a specialised terminal is a
 * *configuration* of the default one. Neither takes focus — two autofocusing
 * terminals on one page race, and the winner scrolls itself into view.
 */

import { Terminal } from "@/components/system";
import { useShell } from "@/lib/shell/shell";
import { type Program, ok } from "@/lib/shell/types";
import { dir, file, homeDisk } from "@/lib/shell/vfs";

/** Nothing supplied at all. Eleven commands and a filesystem, from one call. */
export function TerminalDefaultDemo() {
  return <Terminal {...useShell()} autoFocus={false} height="h-72" title="sh" />;
}

const uptime: Program = {
  name: "uptime",
  desc: "depuis combien de temps la machine tourne",
  run: () => ok("depuis que vous avez ouvert cette page."),
};

/** Shadows the standard `whoami`, the way an earlier `$PATH` entry would. */
const whoami: Program = {
  name: "whoami",
  desc: "votre identité ici",
  run: () => ok("quelqu'un qui lit une documentation de design system."),
};

const BIN = [uptime, whoami];

const ATELIER_DISK = homeDisk("vous", {
  "notes.txt": file("Un shell est une table de noms et une boucle. Le reste est du décor."),
  croquis: dir({ "essai-01.txt": file("Trop de traits. Recommencer.") }),
});

/** The same shell with a name and two commands — all `/teapot` does. */
export function TerminalSpecialisedDemo() {
  return (
    <Terminal
      {...useShell({
        user: "vous",
        hostname: "atelier",
        disk: ATELIER_DISK,
        bin: BIN,
        motd: <div style={{ opacity: 0.7 }}>Atelier. Tapez help.</div>,
      })}
      autoFocus={false}
      height="h-72"
      title="atelier"
    />
  );
}
