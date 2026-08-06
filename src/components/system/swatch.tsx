"use client";

import { useEffect, useRef, useState } from "react";
import {
  COLOR_FORMATS,
  FLAT,
  FLAT_ON,
  formatFlat,
  type ColorFormat,
  type FlatToken,
} from "@/lib/design/tokens";
import { Label } from "./primitives";

/**
 * A colour token, shown in the notation it was authored in, and copyable.
 *
 * Like `docs.tsx` this is chrome for `/design-system` rather than library, and
 * so is deliberately outside the barrel. It lives in its own file because it is
 * the one piece of that chrome that holds state: keeping it here means
 * documenting a component still costs nothing on the client.
 *
 * Showing OKLCh rather than a hex is deliberate — the hex is the output of a
 * conversion, and reasoning about "why is this one muddy" only works in the
 * space the colour was chosen in. Clicking rolls through the three notations
 * instead of picking one, because the honest answer to "which one do you want"
 * depends on where it is going: the stylesheet, a canvas, or a tool that has
 * never heard of OKLCh.
 *
 * `cursor-none`, not `cursor-pointer`. The crosshair replaces the pointer
 * rather than sitting next to it — two indicators tracking the same position
 * would be the tile saying the same thing twice, once as a system-drawn
 * crosshair and once as the browser's own arrow a few pixels off from it.
 */

/** How long the confirmation holds before the tile goes quiet again, in ms. */
const CONFIRM_MS = 1400;

export function Swatch({ token, warm = false }: Readonly<{ token: FlatToken; warm?: boolean }>) {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState<ColorFormat | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => clearTimeout(timer.current ?? undefined), []);

  const format = COLOR_FORMATS[index];
  const value = formatFlat(token, format);

  /* The crosshair follows the pointer through custom properties written
     straight onto the element. A state update per pointermove would re-render
     the tile a hundred times a second to move two hairlines. */
  const track = (event: React.PointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--track-x",
      `${((event.clientX - bounds.left) / bounds.width) * 100}%`,
    );
    event.currentTarget.style.setProperty(
      "--track-y",
      `${((event.clientY - bounds.top) / bounds.height) * 100}%`,
    );
  };

  const copy = () => {
    void navigator.clipboard.writeText(value).then(
      () => {
        clearTimeout(timer.current ?? undefined);
        setCopied(format);
        setIndex((current) => (current + 1) % COLOR_FORMATS.length);
        timer.current = setTimeout(() => setCopied(null), CONFIRM_MS);
      },
      () => {
        /* A refused clipboard is the browser's decision to explain, not ours —
           the tile simply does not confirm, and the notation does not advance. */
      },
    );
  };

  return (
    <button
      type="button"
      onClick={copy}
      onPointerMove={track}
      aria-label={`Copier ${token} en ${format}`}
      className="group relative z-0 block w-full cursor-none text-left outline-offset-2 hover:z-10 focus-visible:z-10 focus-visible:outline-2"
      style={{ outlineColor: FLAT.vermillon }}
    >
      <div
        className="relative flex aspect-[5/3] flex-col justify-between overflow-hidden p-4 transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.06] motion-safe:group-focus-visible:scale-[1.06]"
        style={{ background: FLAT[token], color: FLAT_ON[token] }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <span
            className="absolute inset-y-0 w-px opacity-40"
            style={{ left: "var(--track-x, 50%)", background: "currentColor" }}
          />
          <span
            className="absolute inset-x-0 h-px opacity-40"
            style={{ top: "var(--track-y, 50%)", background: "currentColor" }}
          />
        </span>

        <span className="relative flex items-start justify-between gap-2">
          {copied ? (
            <Label style={{ color: "inherit" }}>copié · {copied}</Label>
          ) : (
            <>
              <span className="text-sm tracking-tight">{token}</span>
              {warm ? <Label style={{ color: "inherit", opacity: 0.7 }}>chaud</Label> : null}
            </>
          )}
        </span>

        <span className="relative font-mono text-[10px] tabular-nums opacity-70">{value}</span>
      </div>
    </button>
  );
}
