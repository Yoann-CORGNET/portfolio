/**
 * The numbers family.
 *
 * A portfolio is mostly claims, and claims land harder as figures. These are
 * the components that carry them. Two rules run through the whole family:
 *
 * 1. Figures are always tabular. A number that changes in place must not
 *    reflow the words around it.
 * 2. There are two sizes and nothing between them — the same scale crush the
 *    typography follows. A "medium" stat would blunt both ends.
 */

import { FLAT, FLAT_ON, type FlatToken } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import { Label } from "./primitives";

export type StatSize = "default" | "display";

/**
 * A single figure with its caption.
 *
 * `delta` is the one place a second colour is allowed in: a change has a
 * direction, and direction is exactly the kind of meaning colour should carry.
 */
export function Stat({
  value,
  label,
  unit,
  delta,
  size = "default",
  className,
}: Readonly<{
  value: string | number;
  label: string;
  /** Suffix set at label size, so it never competes with the figure. */
  unit?: string;
  /** Signed change. Positive reads moss, negative vermillion. */
  delta?: number;
  size?: StatSize;
  className?: string;
}>) {
  return (
    <div className={cn("flex flex-col justify-between gap-6", className)}>
      <Label tone="inherit" className="opacity-70">
        {label}
      </Label>
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            "font-bold tabular-nums leading-[0.8] tracking-tighter",
            size === "display" ? "text-[clamp(3rem,10vw,7rem)]" : "text-5xl",
          )}
        >
          {value}
        </span>
        {unit ? (
          <Label tone="inherit" className="opacity-70">
            {unit}
          </Label>
        ) : null}
        {delta !== undefined ? (
          <Label
            numeric
            className="ml-auto"
            style={{ color: delta >= 0 ? FLAT.moss : FLAT.vermillon }}
          >
            {delta >= 0 ? "+" : "−"}
            {Math.abs(delta)}
          </Label>
        ) : null}
      </div>
    </div>
  );
}

/**
 * A row of figures separated by hairlines rather than boxed into cards.
 *
 * The dividers are drawn with a 1px gap over a border-coloured background,
 * which is how every grid in this system gets its rules: one background, and
 * the cells hold themselves apart.
 */
export function StatGrid({
  children,
  columns = 4,
  className,
}: Readonly<{
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}>) {
  const cols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return <div className={cn("grid grid-cols-1 gap-px bg-border", cols, className)}>{children}</div>;
}

/** A `StatGrid` cell. Fills with a flat tone, or with the page background. */
export function StatCell({
  tone,
  children,
  className,
}: Readonly<{
  tone?: FlatToken;
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={cn("p-6", !tone && "bg-background", className)}
      style={tone ? { background: FLAT[tone], color: FLAT_ON[tone] } : undefined}
    >
      {children}
    </div>
  );
}

/**
 * A proportion, drawn as discrete cells rather than a continuous bar.
 *
 * The whole visual language here is repetition at a constant offset, and a
 * smooth gradient bar belongs to a different system entirely. Counting cells
 * is also a more honest read than eyeballing a length.
 */
export function Meter({
  value,
  max = 10,
  label,
  tone = "vermillon",
  className,
}: Readonly<{
  /** Filled cells. Clamped into 0…max. */
  value: number;
  max?: number;
  label?: string;
  tone?: FlatToken;
  className?: string;
}>) {
  const filled = Math.max(0, Math.min(max, Math.round(value)));

  return (
    <div className={className}>
      {label ? (
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <Label tone="inherit">{label}</Label>
          <Label tone="inherit" numeric>
            {filled}/{max}
          </Label>
        </div>
      ) : null}
      <div
        className="flex gap-1"
        role="meter"
        aria-valuenow={filled}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        {Array.from({ length: max }, (_, i) => (
          <span
            key={`cell-${i}`}
            className="h-2 flex-1 border border-current/20"
            style={i < filled ? { background: FLAT[tone], borderColor: FLAT[tone] } : undefined}
          />
        ))}
      </div>
    </div>
  );
}
