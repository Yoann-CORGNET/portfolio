"use client";

import { Terminal } from "@/components/system";
import { useShell } from "@/lib/shell/shell";
import { coffee, whoami } from "../_shell/coffee";
import { TEAPOT_DISK } from "../_shell/disk";
import { MOTD } from "../_shell/motd";

const BIN = [coffee, whoami];
const ENV = { SHELL: "/bin/théière", TERM: "xterm-418" };

/**
 * The whole of the teapot's machine: a standard shell, told who it is and given
 * the one command a standard shell has no reason to have. Everything else is
 * inherited.
 */
export function TeapotTerminal() {
  return (
    <Terminal
      {...useShell({
        user: "invité",
        hostname: "théière",
        disk: TEAPOT_DISK,
        bin: BIN,
        motd: MOTD,
        env: ENV,
      })}
    />
  );
}
