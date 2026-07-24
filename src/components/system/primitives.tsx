/**
 * Base components — the smallest pieces of the system.
 *
 * Everything here is a server component and pure presentation: no state, no
 * effects, no measurement. If a piece needs the browser it belongs in
 * `motion.tsx`, `controls.tsx` or `flow-field.tsx` instead.
 */

import { FLAT, FLAT_ON, dotScreen, type FlatToken } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Label                                                              */
/* ------------------------------------------------------------------ */

export type LabelTone = "muted" | "strong" | "accent" | "inherit";

const LABEL_TONE: Record<LabelTone, string> = {
  muted: "text-muted-foreground",
  strong: "font-bold text-foreground",
  accent: "",
  // Needed by anything sitting on a flat block: `muted` resolves to a cold grey
  // from the page theme, which disappears on vermillon and on ink. Inheriting
  // lets `FlatBlock` and `StatCell` hand down their own legible foreground.
  inherit: "text-current",
};

/**
 * The system's only small type. Every annotation on the page is this: 10px,
 * uppercase, widely tracked. There is deliberately no second small size — the
 * scale jumps straight from here to display.
 */
export function Label({
  children,
  tone = "muted",
  numeric = false,
  className,
  style,
}: Readonly<{
  children: React.ReactNode;
  tone?: LabelTone;
  /** Tabular figures, for anything that changes in place. */
  numeric?: boolean;
  className?: string;
  style?: React.CSSProperties;
}>) {
  return (
    <span
      className={cn(
        "text-[10px] uppercase tracking-[0.2em]",
        LABEL_TONE[tone],
        numeric && "tabular-nums",
        className,
      )}
      style={tone === "accent" ? { color: FLAT.vermillon, ...style } : style}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Rule                                                               */
/* ------------------------------------------------------------------ */

/**
 * A hairline. Separation in this system is a 1px line or nothing at all —
 * never a shadow, never a rounded outline.
 */
export function Rule({
  tone = "border",
  className,
}: Readonly<{
  tone?: "border" | "accent";
  className?: string;
}>) {
  return (
    <span
      aria-hidden="true"
      className={cn("block h-px w-full", tone === "border" && "bg-border", className)}
      style={tone === "accent" ? { background: FLAT.vermillon } : undefined}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Tag                                                                */
/* ------------------------------------------------------------------ */

/**
 * A bordered chip. Used for stack items and states — anything that would
 * otherwise be tempted into becoming a coloured pill with a shadow.
 */
export function Tag({
  children,
  tone,
  className,
}: Readonly<{
  children: React.ReactNode;
  /** Fills the chip. Omit for the outlined default. */
  tone?: FlatToken;
  className?: string;
}>) {
  return (
    <span
      className={cn(
        "inline-block border px-2.5 py-1 text-[10px] uppercase tracking-[0.2em]",
        !tone && "border-border text-muted-foreground",
        className,
      )}
      style={
        tone ? { background: FLAT[tone], color: FLAT_ON[tone], borderColor: FLAT[tone] } : undefined
      }
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Action                                                             */
/* ------------------------------------------------------------------ */

/**
 * The five conventional roles, under their conventional names. There is no
 * destructive variant: nothing on this site destroys anything, and a tone kept
 * warm for an emergency that never comes is a tone the system has to justify on
 * every page.
 */
export type ActionVariant = "primary" | "secondary" | "outline" | "ghost" | "link";
export type ActionSize = "sm" | "md" | "lg";

/**
 * Pins an interaction state that is otherwise only reachable with a pointer.
 *
 * This exists for `/design-system`, which has to show the pressed state of a
 * control next to its resting state. Nothing on the site itself should set it.
 */
export type ActionState = "hover" | "active" | "focus";

/* Colours travel as custom properties rather than as Tailwind classes because
   they come from `tokens.ts`, and a class name assembled at runtime is a class
   name Tailwind's scanner never sees and never emits. Every state below is one
   literal utility reading one variable, which is what lets the whole key be
   described by the shared string in KEY and only recoloured per variant here.

   Four properties define the resting face — background, foreground, border,
   and the hard offset block (`edge`) — and each has a `-hover` twin. A property
   whose twin equals its base simply does not move on hover. `currentColor` lets
   `outline` and `ghost` borrow the surface's own ink, which is what carries them
   across the cream / ink switch that sinks any variant holding an absolute
   value. */
const softInk = (pct: number) => `color-mix(in srgb, currentColor ${pct}%, transparent)`;

const VARIANT: Record<ActionVariant, Record<string, string>> = {
  // Loud. The face is the accent; the block under it is ink, so the key reads as
  // a warm tile sitting a few pixels above the paper. Hover deepens the face to
  // rust — the accent leaning in rather than a second colour arriving.
  primary: {
    "--a-bg": FLAT.vermillon,
    "--a-bg-h": FLAT.rust,
    "--a-fg": FLAT.cream,
    "--a-fg-h": FLAT.cream,
    "--a-bd": "transparent",
    "--a-bd-h": "transparent",
    "--a-edge": FLAT.ink,
    "--a-edge-h": FLAT.ink,
    "--a-ring": FLAT.vermillon,
  },
  // Structural. An ink face, and the one warm point of the whole control lives
  // on its offset block: the accent is the shadow the key throws.
  secondary: {
    "--a-bg": FLAT.ink,
    "--a-bg-h": FLAT.charcoal,
    "--a-fg": FLAT.cream,
    "--a-fg-h": FLAT.cream,
    "--a-bd": "transparent",
    "--a-bd-h": "transparent",
    "--a-edge": FLAT.vermillon,
    "--a-edge-h": FLAT.vermillon,
    "--a-ring": FLAT.vermillon,
  },
  // Quiet but always a key: hollow face, hairline border, an ink block. Touching
  // it warms the whole thing — border, text and block — to the accent at once.
  outline: {
    "--a-bg": "transparent",
    "--a-bg-h": softInk(8),
    "--a-fg": "currentColor",
    "--a-fg-h": FLAT.vermillon,
    "--a-bd": softInk(30),
    "--a-bd-h": FLAT.vermillon,
    "--a-edge": "currentColor",
    "--a-edge-h": FLAT.vermillon,
    "--a-ring": FLAT.vermillon,
  },
  // Quietest. Flat until touched: no block at rest, so it reads as plain text,
  // and only becomes a key — grows its offset — once the cursor is on it. That
  // is the whole difference from outline, which is a key all the time.
  ghost: {
    "--a-bg": "transparent",
    "--a-bg-h": softInk(8),
    "--a-fg": "currentColor",
    "--a-fg-h": "currentColor",
    "--a-bd": "transparent",
    "--a-bd-h": "transparent",
    "--a-edge": "transparent",
    "--a-edge-h": softInk(55),
    "--a-ring": FLAT.vermillon,
  },
  // Not a key at all: a word in a sentence. It keeps the typographic treatment —
  // a warm rule that grows from a resting hairline — and takes no offset block.
  link: {
    "--a-fg": FLAT.vermillon,
    "--a-ring": FLAT.vermillon,
  },
};

/* `--lift` is the offset of the block and the exact distance the key travels on
   press: translating by the lift and collapsing the block to zero lands the
   key's corner where the block's corner was. The bottom-right margin reserves
   that travel so a pressed key never laps its neighbour. */
const SIZE: Record<ActionSize, { pad: string; text: string; lift: string }> = {
  sm: { pad: "px-3 py-1.5", text: "text-xs", lift: "3px" },
  md: { pad: "px-5 py-2.5", text: "text-sm", lift: "4px" },
  lg: { pad: "px-7 py-3.5", text: "text-base", lift: "5px" },
};

/* The group is named. An unnamed one matches *any* ancestor carrying `.group`,
   so an action dropped inside a hoverable card would react every time the card
   was hovered — the card would be pressing its own buttons. */
const BASE = cn(
  "group/action relative inline-flex select-none items-center justify-center tracking-tight",
  "transition-[translate,box-shadow,background-color,border-color,color] duration-300 ease-out",
  "motion-reduce:transition-none",
  // Focus is a ring laid on the surface beside the control, never a change of
  // the control's own colour — that would make focus and hover say the same
  // thing. The warm accent reads against both cream and ink.
  "outline-offset-2 focus-visible:outline-2 focus-visible:outline-[var(--a-ring)]",
  "data-[force=focus]:outline-2 data-[force=focus]:outline-[var(--a-ring)]",
  // Unavailable and busy both refuse the pointer. Only unavailable fades: a busy
  // control is still the thing you just asked for and has to stay readable.
  "disabled:pointer-events-none aria-disabled:pointer-events-none aria-busy:pointer-events-none",
);

/* The mechanical key.
   ---------------------------------------------------------------------------
   A deliberate, documented exception to "separate with a hairline or nothing,
   never a shadow" (see CLAUDE.md): the offset here is a hard-edged block with
   zero blur — the body of the key, not a soft drop shadow. It is the one place
   in the system that casts anything, and it earns it by being the thing you
   press.

   The block is declared as `box-shadow` *inline* (see the component), because a
   Tailwind `shadow-[…]` whose value starts with `var()` is misparsed — the
   leading token is read as the shadow's colour, and the block silently breaks.
   So the states below only retune three custom properties — the two offsets and
   the block colour — which the inline shadow reads. Each is one literal utility
   so Tailwind emits every selector, and a class-set property still loses to a
   pseudo-class rule, so hover and press win over the resting values. */
const KEY = cn(
  "border border-[var(--a-bd)] bg-[var(--a-bg)] text-[var(--a-fg)]",
  "[--a-sx:var(--lift)] [--a-sy:var(--lift)] [--a-shc:var(--a-edge)]",
  "mb-[var(--lift)] mr-[var(--lift)]",
  // Hover — pointer and forced alike — warms the face and block, no travel.
  "hover:border-[var(--a-bd-h)] hover:bg-[var(--a-bg-h)] hover:text-[var(--a-fg-h)]",
  "hover:[--a-shc:var(--a-edge-h)]",
  "data-[force=hover]:border-[var(--a-bd-h)] data-[force=hover]:bg-[var(--a-bg-h)]",
  "data-[force=hover]:text-[var(--a-fg-h)] data-[force=hover]:[--a-shc:var(--a-edge-h)]",
  // Press — slam onto the block. Travel by the lift and collapse the two
  // offsets to zero, so the block animates shut under the key rather than
  // snapping off. Instant by system: a press has to answer now.
  "active:translate-x-[var(--lift)] active:translate-y-[var(--lift)] active:duration-75",
  "active:[--a-sx:0px] active:[--a-sy:0px] active:[--a-shc:var(--a-edge-h)]",
  "data-[force=active]:translate-x-[var(--lift)] data-[force=active]:translate-y-[var(--lift)]",
  "data-[force=active]:[--a-sx:0px] data-[force=active]:[--a-sy:0px]",
  "data-[force=active]:[--a-shc:var(--a-edge-h)]",
  // Unavailable: lay the key flat. A raised, offset block still reads as
  // pressable, and the one thing this state must not read as is pressable.
  "disabled:mb-0 disabled:mr-0 disabled:[--a-shc:transparent]",
  "aria-disabled:mb-0 aria-disabled:mr-0 aria-disabled:[--a-shc:transparent]",
);

/* The link's rule: a warm hairline at rest, grown to full weight under the
   cursor. The typographic cousin of the key's press. */
const LINK_REST =
  "pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[var(--a-fg)] opacity-40";
const LINK_GROW = cn(
  "pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[var(--a-fg)]",
  "transition-[scale] duration-300 ease-out motion-reduce:duration-0",
  "group-hover/action:scale-x-100 group-data-[force=hover]/action:scale-x-100",
);

/**
 * The system's action, as a link or as a button.
 *
 * With an `href` it renders an anchor, without one a real `<button>` — because
 * an anchor cannot be disabled, cannot be submitted, and cannot be pressed with
 * the space bar. The unavailable link is handled the only way it can be: the
 * href is dropped, so there is nothing left to follow.
 */
export function Action({
  children,
  href,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  force,
  type = "button",
  onClick,
  className,
}: Readonly<{
  children: React.ReactNode;
  /** Present: renders an anchor. Absent: renders a button. */
  href?: string;
  variant?: ActionVariant;
  size?: ActionSize;
  disabled?: boolean;
  /** Keeps the label in place and blinks a terminal cursor at the trailing edge. */
  loading?: boolean;
  /** Documentation only. See `ActionState`. */
  force?: ActionState;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLElement>;
  className?: string;
}>) {
  const isLink = variant === "link";
  const inactive = disabled || loading;

  const body = (
    <>
      {isLink ? (
        <>
          <span aria-hidden="true" className={LINK_REST} />
          <span aria-hidden="true" className={LINK_GROW} />
        </>
      ) : null}
      <span className="relative">{children}</span>
      {loading ? (
        <span
          aria-hidden="true"
          className={cn(
            "animate-blink leading-none",
            isLink ? "ml-1.5" : "absolute right-1.5 top-1/2 -translate-y-1/2 text-[0.7em]",
          )}
        >
          ▌
        </span>
      ) : null}
    </>
  );

  const shared = {
    className: cn(
      BASE,
      isLink ? "pb-1 text-[var(--a-fg)]" : cn(KEY, SIZE[size].pad),
      SIZE[size].text,
      disabled && "opacity-40",
      className,
    ),
    /* The block is declared here, not in a class: a Tailwind `shadow-[…]` that
       opens with `var()` is misread as a colour. This static string only reads
       the offset / colour properties the KEY state classes retune. */
    style: {
      ...VARIANT[variant],
      "--lift": SIZE[size].lift,
      ...(isLink ? {} : { boxShadow: "var(--a-sx) var(--a-sy) 0 0 var(--a-shc)" }),
    } as React.CSSProperties,
    "data-force": force,
    "aria-busy": loading || undefined,
    onClick,
  };

  if (href !== undefined) {
    return (
      <a
        {...shared}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
      >
        {body}
      </a>
    );
  }

  return (
    <button {...shared} type={type} disabled={inactive}>
      {body}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* FlatBlock                                                          */
/* ------------------------------------------------------------------ */

/** A solid colour panel — the flat half of the system. */
export function FlatBlock({
  tone,
  children,
  className,
  dots,
  style,
}: Readonly<{
  tone: FlatToken;
  children?: React.ReactNode;
  className?: string;
  /** Overlay the dot screen. */
  dots?: boolean;
  style?: React.CSSProperties;
}>) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ background: FLAT[tone], color: FLAT_ON[tone], ...style }}
    >
      {dots ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{ background: dotScreen(FLAT_ON[tone]) }}
        />
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bracketed                                                          */
/* ------------------------------------------------------------------ */

/** Corner brackets instead of a closed box. */
export function Bracketed({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <div className={cn("relative", className)}>
      <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-current/25" />
      <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-current/25" />
      <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-current/25" />
      <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-current/25" />
      {children}
    </div>
  );
}
