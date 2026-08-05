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
  // The anchor path gets a pointer cursor from the browser's own `:any-link`
  // rule; the button path does not — Tailwind's preflight resets it to
  // `default`, same as plain HTML. Set explicitly so both paths agree, rather
  // than relying on an accident of which element `href` happens to render.
  "cursor-pointer",
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

/** The label content of an `Action` — the variant-aware underline pair for
 *  links, the child, and the trailing loading cursor. Split out of `Action`
 *  itself purely to keep that function's branching flat. */
function ActionBody({
  isLink,
  loading,
  children,
}: Readonly<{
  isLink: boolean;
  loading: boolean;
  children: React.ReactNode;
}>) {
  return (
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
}

/** The props shared between the anchor and button render of `Action` — the
 *  class list, the CSS custom properties the `KEY` state classes read, and
 *  the plain DOM/ARIA attributes both tags take identically. Split out of
 *  `Action` itself purely to keep that function's branching flat. */
function buildActionSharedProps({
  isLink,
  variant,
  size,
  disabled,
  loading,
  force,
  onClick,
  className,
}: Readonly<{
  isLink: boolean;
  variant: ActionVariant;
  size: ActionSize;
  disabled: boolean;
  loading: boolean;
  force: ActionState | undefined;
  onClick: React.MouseEventHandler<HTMLElement> | undefined;
  className: string | undefined;
}>) {
  return {
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
}

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
  external = false,
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
  /**
   * Opens in a new tab. Ignored without an `href`.
   *
   * One flag rather than a raw `target`, because the target is only half of it:
   * a `_blank` link hands the opened page a live `window.opener` handle back to
   * this one unless `rel` says otherwise. Modern browsers imply `noopener`,
   * older ones do not, and a call site passing `target` by hand is one that can
   * forget the `rel`. Here it cannot.
   *
   * It says nothing about the new tab out loud — announcing it would mean
   * baking a language into a component the registry ships into other people's
   * projects. A caller that wants it says so in its own words, in its own
   * locale.
   */
  external?: boolean;
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
    <ActionBody isLink={isLink} loading={loading}>
      {children}
    </ActionBody>
  );

  const shared = buildActionSharedProps({
    isLink,
    variant,
    size,
    disabled,
    loading,
    force,
    onClick,
    className,
  });

  if (href !== undefined) {
    return (
      <a
        {...shared}
        href={disabled ? undefined : href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
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
/* Tooltip                                                            */
/* ------------------------------------------------------------------ */

/**
 * A bubble revealed by its anchor, above it.
 *
 * It is CSS only — no state, no effects, no measurement — which is what keeps
 * it here among the primitives and lets it render on the server. The price is
 * that it does not flip when it would leave the viewport; an anchor near the
 * top of a scroll container has to place it itself, through `className`.
 *
 * The anchor owns the interaction, not the bubble. Whatever wraps them both
 * must carry `group relative`, and must be the same element that takes
 * `:hover` and `:focus-visible` — splitting the two across a wrapper and an
 * inner control silently kills the keyboard path, since `group-focus-visible`
 * watches the group itself.
 *
 * It renders a `<span>`, deliberately. A tooltip belongs inside running text
 * as often as beside a card, and a `<div>` inside a `<p>` is invalid markup
 * that browsers repair by closing the paragraph early. Children must therefore
 * be phrasing content too — `<span className="block">` where a `<p>` would
 * have been natural.
 *
 * `pointer-events-none` is not decoration: the bubble must never be what
 * receives the hover it was opened by, or moving onto it would drop the
 * anchor's `:hover` and flicker it shut.
 *
 * It opens on `:focus` as well as `:focus-visible`, and that pair is what makes
 * it work on touch. A tap focuses the anchor but does not make it
 * focus-visible, which browsers reserve for keyboard traversal — on
 * `focus-visible` alone the bubble is unreachable without a keyboard or a
 * pointer, and the anchor becomes a marker for something the reader cannot
 * open. The cost is that a mouse click leaves it open until blur, which for a
 * definition is the behaviour one wants anyway.
 */
export function Tooltip({
  children,
  id,
  className,
}: Readonly<{
  children: React.ReactNode;
  /** Target of the anchor's `aria-describedby`. Without it the bubble is
   *  visual only, which is the right call when it merely restates the anchor. */
  id?: string;
  className?: string;
}>) {
  return (
    <span
      role="tooltip"
      id={id}
      className={cn(
        "pointer-events-none absolute bottom-full left-0 z-20 mb-2 w-56",
        "border border-border bg-background p-3 text-left font-normal",
        "opacity-0 transition-opacity duration-300 ease-out motion-reduce:transition-none",
        "group-hover:opacity-100 group-focus:opacity-100 group-focus-visible:opacity-100",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Watermark                                                          */
/* ------------------------------------------------------------------ */

/**
 * An oversized numeral or word, faded behind the content it marks.
 *
 * It replaces the small eyebrow above a section title: a section is placed by
 * its figure, not by a ten-pixel line restating the heading underneath it. The
 * mark is therefore enormous and nearly erased — enough to locate, too little
 * to be read before the title.
 *
 * Three things keep it from interfering with the page around it:
 *
 *  — it is `aria-hidden` and unselectable. It is decoration, and whatever rank
 *    it announces is already carried by the order of the sections themselves;
 *  — it draws from `currentColor` rather than a fixed token, which is what
 *    lets the same mark cross from paper to an ink block without being
 *    recoloured at the call site;
 *  — it deliberately overflows its left edge. Clipping it is the parent's job
 *    (`overflow-hidden`), as is being positioned so the mark has something to
 *    anchor to. Content that must pass in front has to be positioned too — a
 *    static sibling loses to an absolute one no matter the source order.
 *
 * One trap, and it is invisible until measured: an absolute child anchors to
 * the *padding box* of its positioned ancestor, so a mark handed to a wrapper
 * that itself sits inside that ancestor's padding starts below it. `FlatBlock`
 * is exactly such a wrapper — it puts its children in an inner `relative` div,
 * within its own padding. A mark passed to a padded `FlatBlock` therefore
 * anchors to the content, not to the block. The fix is at the call site: leave
 * the block unpadded and pad the content beside the mark instead.
 *
 * It anchors differently on the two ends of the scale, and the small end is
 * the default rather than the override. Narrow, the mark sits in the section's
 * top-right corner: there is no free column beside the text to bleed into, so
 * a left-anchored mark centred on the block would sit squarely under the
 * paragraph instead of beside it. From `md` up that column exists, and the
 * mark moves to it — left, vertically centred, overflowing the edge.
 */
export function Watermark({
  children,
  opacity,
  className,
}: Readonly<{
  children: React.ReactNode;
  /**
   * Deliberately required, with no default.
   *
   * Dark-on-light and light-on-dark do not fade at the same rate, so a single
   * default would be wrong on one of the two surfaces — and wrong quietly,
   * which is the worst way for a decorative layer to fail.
   */
  opacity: number;
  className?: string;
}>) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute select-none",
        // Narrow: pinned to the top-right corner, nothing translated.
        "top-0 right-0",
        // From `md`: released from the right, re-anchored left of the frame
        // and centred on it.
        "md:top-1/2 md:right-auto md:-left-6 md:-translate-y-1/2",
        /* `leading-[0.74]` rather than `leading-none`, and ce n'est pas un
           réglage à l'œil. Avec un interlignage de 1, la boîte de ligne fait
           un cadratin mais les chiffres n'en occupent que la hauteur de
           capitale (0,73 chez JetBrains Mono) : la ligne de base tombe à 0,86
           du haut, donc le haut des chiffres à 0,13. `top-0` colle la boîte
           au bord et laisse malgré tout ce treizième de cadratin de vide —
           dix-neuf pixels au corps minimal. En posant L tel que L/2 + 0,36 −
           0,73 = 0, soit L = 0,74, le haut des chiffres tombe pile sur le
           haut de la boîte, et le centrage de `md` devient exact par la même
           occasion puisque la boîte ne contient plus que l'encre. */
        "text-[clamp(9rem,24vw,18rem)] leading-[0.74] font-bold tracking-tighter tabular-nums",
        className,
      )}
      style={{ opacity }}
    >
      {children}
    </span>
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
