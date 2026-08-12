"use client";

import { Minus, Square, X } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { FLAT, FLAT_ON, type FlatToken } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import { Label } from "./primitives";
import { useReadline } from "./terminal-readline";

/** What a shell may reach on the emulator's side of the glass. */
export type TerminalIo = {
  /** Writes without waiting for the command to return. */
  write: (node: ReactNode) => void;
  clear: () => void;
  /** Readline's ring buffer — the only place a `history` builtin can read it. */
  history: readonly string[];
};

/**
 * A word the shell owns rather than the user: a prompt, a command name.
 *
 * Imported by `@/lib/shell` from this file, never the barrel, which would drag
 * the whole library into its runtime graph.
 */
export function CommandWord({ children }: Readonly<{ children: ReactNode }>) {
  return <span style={{ color: FLAT.amber }}>{children}</span>;
}

type CommandLine = { kind: "command"; text: string; prompt: string };
type OutputLine = { kind: "output"; node: ReactNode };
type Line = ({ id: number } & CommandLine) | ({ id: number } & OutputLine);

let nextId = 0;
function line(entry: CommandLine | OutputLine): Line {
  nextId += 1;
  return { ...entry, id: nextId };
}

/** The box fills on hover, not just the stroke, so it reads as a surface. */
function WindowControl({ icon: Icon, tone }: Readonly<{ icon: typeof Minus; tone: FlatToken }>) {
  return (
    <span
      className="group/win flex h-5 w-5 items-center justify-center transition-colors hover:bg-[var(--w-bg)]"
      style={{ "--w-bg": FLAT[tone], "--w-fg": FLAT_ON[tone] } as React.CSSProperties}
    >
      <Icon
        className="h-3 w-3 transition-colors group-hover/win:text-[var(--w-fg)]"
        strokeWidth={1.75}
      />
    </span>
  );
}

/**
 * An emulator in the sense xterm is one: it owns the window, the scrollback and
 * the keystroke-to-line boundary, and knows no commands. Every command — `help`
 * and `clear` included — belongs to the caller's shell, behind `onRun`.
 * `@/lib/shell` supplies a working one.
 *
 * Painted directly rather than through `FlatBlock`, whose unsized wrapper div
 * breaks the `flex h-full` chain that makes the log scroll instead of the panel
 * growing.
 */
export function Terminal({
  title = "Terminal",
  prompt,
  completions,
  banner,
  onRun,
  autoFocus = true,
  height = "h-96",
  className,
}: Readonly<{
  title?: string;
  /** e.g. `invité@théière:~$`. The emulator holds no cwd or host of its own. */
  prompt: string;
  /** Names Tab may complete to. */
  completions: readonly string[];
  /** On screen before the first command. */
  banner?: ReactNode;
  /** Runs one raw line; lexing it is the shell's job. `null` prints nothing. */
  onRun: (input: string, io: TerminalIo) => ReactNode | null | Promise<ReactNode | null>;
  /** Turn off when a page mounts more than one, or they race for focus. */
  autoFocus?: boolean;
  height?: string;
  className?: string;
}>) {
  // Lazy: the eager form allocated a Line per keystroke and threw it away.
  const [lines, setLines] = useState<Line[]>(() =>
    banner ? [line({ kind: "output", node: banner })] : [],
  );
  const [busy, setBusy] = useState(false);

  const logRef = useRef<HTMLDivElement>(null);

  function write(node: ReactNode) {
    setLines((prev) => [...prev, line({ kind: "output", node })]);
  }

  function clear() {
    setLines([]);
  }

  function echo(text: string) {
    setLines((prev) => [...prev, line({ kind: "command", text, prompt })]);
  }

  const readline = useReadline({
    completions,
    onClear: clear,
    onAmbiguous: (matches) => write(matches.join("  ")),
    onInterrupt: (abandoned) => echo(`${abandoned}^C`),
  });

  // Scrolls the log itself: `scrollIntoView` walks every scrollable ancestor
  // including the document, dragging the whole page on each new line.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [lines]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const input = readline.accept();

    // Every line takes the same path, `clear` included: echo first, wipe
    // second, as a real `clear` does.
    echo(input);
    if (input.trim() === "") return;

    setBusy(true);
    const output = await onRun(input, { write, clear, history: readline.history });
    setBusy(false);
    if (output !== null) write(output);
  }

  return (
    <div className={cn("w-full max-w-2xl font-mono", className)}>
      <div className="flex items-center justify-between border border-b-0 border-border bg-background px-4 py-2.5">
        <Label tone="strong">{title}</Label>
        {/* Dead on purpose: a real minimize/close needs a window manager. */}
        <div aria-hidden="true" className="flex items-center gap-1 text-muted-foreground">
          <WindowControl icon={Minus} tone="amber" />
          <WindowControl icon={Square} tone="moss" />
          <WindowControl icon={X} tone="vermillon" />
        </div>
      </div>

      {/* No click-anywhere-to-focus: an onClick here would fake a button role
          over the scrollback, or ship a mouse-only path. The input is already
          a real target. */}
      <div
        className={cn("flex flex-col border border-border p-4 text-[13px] leading-relaxed", height)}
        style={{ background: FLAT.charcoal, color: FLAT_ON.charcoal }}
      >
        <div ref={logRef} className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
          {lines.map((entry) =>
            entry.kind === "command" ? (
              <div key={entry.id}>
                <CommandWord>{entry.prompt}</CommandWord> {entry.text}
              </div>
            ) : (
              <div key={entry.id}>{entry.node}</div>
            ),
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-2 flex shrink-0 items-center gap-2 border-t border-current/15 pt-2"
        >
          <CommandWord>{prompt}</CommandWord>
          <input
            value={readline.value}
            onChange={(event) => readline.setValue(event.target.value)}
            onKeyDown={readline.onKeyDown}
            disabled={busy}
            autoFocus={autoFocus}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Commande terminal"
            className="min-w-0 flex-1 bg-transparent font-mono outline-none disabled:opacity-50"
            style={{ color: "currentColor", caretColor: "currentColor" }}
          />
        </form>
      </div>
    </div>
  );
}
