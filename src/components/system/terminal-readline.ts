"use client";

import { useState } from "react";

/**
 * The line discipline, split from the emulator for the reason GNU readline is a
 * library and not part of bash. The emulator owns what is on the screen; this
 * owns what is on the line, plus the ring of every line accepted.
 */
export type Readline = {
  value: string;
  setValue: (value: string) => void;
  /** Every line accepted this session, oldest first. */
  history: readonly string[];
  /** Files the current line in the ring and empties the buffer. */
  accept: () => string;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

export function useReadline({
  completions,
  onInterrupt,
  onClear,
  onAmbiguous,
}: Readonly<{
  completions: readonly string[];
  /** Ctrl+C — receives the abandoned line so the emulator can echo it `^C`. */
  onInterrupt: (line: string) => void;
  /** Ctrl+L. */
  onClear: () => void;
  /** Tab with more than one match: redisplay rather than guess. */
  onAmbiguous: (matches: readonly string[]) => void;
}>): Readline {
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  /** Where ↑/↓ currently sit in the ring; `null` means "on the live line". */
  const [cursor, setCursor] = useState<number | null>(null);

  function abandon() {
    setValue("");
    setCursor(null);
  }

  function accept(): string {
    const line = value;
    abandon();
    // Consecutive duplicates collapse, as with bash's `ignoredups`.
    if (line.trim() !== "") {
      setHistory((ring) => (ring.at(-1) === line ? ring : [...ring, line]));
    }
    return line;
  }

  function recall(event: React.KeyboardEvent<HTMLInputElement>, direction: -1 | 1) {
    event.preventDefault();
    if (history.length === 0) return;

    if (direction === -1) {
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]);
      return;
    }

    // Past the newest entry is the live line, which in a ring this simple is
    // always empty.
    if (cursor === null) return;
    const next = cursor + 1;
    if (next >= history.length) abandon();
    else {
      setCursor(next);
      setValue(history[next]);
    }
  }

  function complete(event: React.KeyboardEvent<HTMLInputElement>) {
    event.preventDefault();
    // Only the command word: completing an argument is the shell's business.
    if (value.includes(" ") || value.trim() === "") return;
    const matches = completions.filter((name) => name.startsWith(value.trim()));
    if (matches.length === 1) setValue(`${matches[0]} `);
    else if (matches.length > 1) onAmbiguous(matches);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp") return recall(event, -1);
    if (event.key === "ArrowDown") return recall(event, 1);
    if (event.key === "Tab") return complete(event);

    if (event.key === "Escape") {
      abandon();
      return;
    }

    if (event.ctrlKey && event.key === "c") {
      event.preventDefault();
      onInterrupt(value);
      abandon();
      return;
    }

    if (event.ctrlKey && event.key === "l") {
      event.preventDefault();
      onClear();
    }
  }

  return { value, setValue, history, accept, onKeyDown };
}
