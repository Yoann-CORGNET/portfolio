"use client";

import { FLAT, FLAT_ON, type FlatToken } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

// Crosshair pattern shared with Swatch (@/components/system/swatch.tsx):
// coordinates are written straight to CSS custom properties on the element
// rather than useState, so pointermove doesn't re-render the card.
function track(event: React.PointerEvent<HTMLDivElement>) {
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty(
    "--track-x",
    `${((event.clientX - bounds.left) / bounds.width) * 100}%`,
  );
  event.currentTarget.style.setProperty(
    "--track-y",
    `${((event.clientY - bounds.top) / bounds.height) * 100}%`,
  );
}

export function RobustnessCard({
  tone,
  title,
  body,
  className,
}: Readonly<{
  tone: FlatToken;
  title: string;
  body: string;
  className?: string;
}>) {
  return (
    <div
      onPointerMove={track}
      className={cn("group relative cursor-none overflow-hidden p-6", className)}
      style={{ background: FLAT[tone], color: FLAT_ON[tone] }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <span
          className="absolute inset-y-0 w-px opacity-30"
          style={{ left: "var(--track-x, 50%)", background: "currentColor" }}
        />
        <span
          className="absolute inset-x-0 h-px opacity-30"
          style={{ top: "var(--track-y, 50%)", background: "currentColor" }}
        />
      </span>

      <p className="relative leading-snug font-bold tracking-tight">{title}</p>
      <p className="relative mt-3 text-sm leading-relaxed opacity-80">{body}</p>
    </div>
  );
}
