/**
 * Design tokens.
 *
 * The system has two halves. The generated texture is one; this is the other:
 * flat, chunky colour blocks — cream, vermillion, amber, charcoal — with an
 * optional dot screen over them.
 *
 * Colours are authored in OKLCh like the texture ramps, and resolved to sRGB
 * here so the values can be dropped straight into inline styles.
 */

import { oklchToRgb, type Rgb } from "./palette";

/* ------------------------------------------------------------------ */
/* Colour                                                             */
/* ------------------------------------------------------------------ */

type Oklch = { l: number; c: number; h: number };

/** Kept alongside the resolved value so the system page can show the source. */
export const FLAT_OKLCH = {
  cream: { l: 0.94, c: 0.022, h: 85 },
  sand: { l: 0.88, c: 0.04, h: 78 },
  vermillon: { l: 0.6, c: 0.2, h: 33 },
  rust: { l: 0.5, c: 0.16, h: 35 },
  amber: { l: 0.8, c: 0.14, h: 72 },
  petrol: { l: 0.46, c: 0.09, h: 232 },
  steel: { l: 0.66, c: 0.06, h: 225 },
  moss: { l: 0.58, c: 0.08, h: 145 },
  charcoal: { l: 0.26, c: 0.02, h: 240 },
  ink: { l: 0.18, c: 0.015, h: 250 },
} as const satisfies Record<string, Oklch>;

export type FlatToken = keyof typeof FLAT_OKLCH;

/** The same colours resolved to sRGB, kept so a token can be quoted either way. */
export const FLAT_RGB = Object.fromEntries(
  Object.entries(FLAT_OKLCH).map(([name, { l, c, h }]) => [name, oklchToRgb(l, c, h)]),
) as Record<FlatToken, Rgb>;

export const FLAT = Object.fromEntries(
  Object.entries(FLAT_RGB).map(([name, [r, g, b]]) => [name, `rgb(${r} ${g} ${b})`]),
) as Record<FlatToken, string>;

export const FLAT_TOKENS = Object.keys(FLAT_OKLCH) as FlatToken[];

/**
 * The notations a token can be copied out in, in the order they are offered.
 *
 * OKLCh comes first because it is what the colour was authored in — the same
 * rule that makes the swatch show L·C·H rather than a hex. Hex comes last
 * because it is the one that leaves CSS entirely, for the tools that cannot
 * read anything else.
 */
export const COLOR_FORMATS = ["oklch", "rgb", "hex"] as const;

export type ColorFormat = (typeof COLOR_FORMATS)[number];

const FORMATTERS: Record<ColorFormat, (token: FlatToken) => string> = {
  oklch: (token) => {
    const { l, c, h } = FLAT_OKLCH[token];
    return `oklch(${l} ${c} ${h})`;
  },
  rgb: (token) => FLAT[token],
  hex: (token) =>
    `#${FLAT_RGB[token].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`.toUpperCase(),
};

/** A token in one notation, as a string that pastes straight into a stylesheet. */
export function formatFlat(token: FlatToken, format: ColorFormat): string {
  return FORMATTERS[format](token);
}

/**
 * Foreground that stays legible on each block colour. Picked per token rather
 * than computed: the mid-lightness ones (amber, steel, moss) sit close enough
 * to the contrast threshold that a formula flips them the wrong way.
 */
export const FLAT_ON: Record<FlatToken, string> = {
  cream: FLAT.ink,
  sand: FLAT.ink,
  vermillon: FLAT.cream,
  rust: FLAT.cream,
  amber: FLAT.ink,
  petrol: FLAT.cream,
  steel: FLAT.ink,
  moss: FLAT.cream,
  charcoal: FLAT.cream,
  ink: FLAT.cream,
};

/**
 * Which tokens are allowed to carry the accent role.
 *
 * The composition rule the whole system rests on is *one warm point in a cold
 * field*. Listing the warm tokens explicitly is what lets the system page state
 * that rule as data rather than as a paragraph nobody reads.
 */
export const WARM_TOKENS: FlatToken[] = ["vermillon", "rust", "amber", "sand"];

/* ------------------------------------------------------------------ */
/* Type                                                               */
/* ------------------------------------------------------------------ */

/**
 * The type scale, and the gap in the middle of it is the point.
 *
 * There is display type and there is annotation, with a ratio of roughly 25:1
 * between them and very little in between. Filling the middle back in is the
 * fastest way to make the system look like everyone else's.
 */
export const TYPE = [
  {
    name: "display",
    className: "font-mono text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[0.82] tracking-tighter",
    note: "Le seul texte du site en capitales, et le seul dont la taille est calée sur la chasse fixe de JetBrains Mono. Reste mono par construction — voir hero.section.tsx.",
    sample: "YOANN",
  },
  {
    name: "heading",
    className: "font-heading text-3xl font-bold leading-tight tracking-tight",
    note: "Archivo. Seul palier intermédiaire, réservé aux aplats.",
    sample: "Systèmes distribués",
  },
  {
    name: "body",
    className: "font-text text-base leading-relaxed",
    note: "IBM Plex Sans. Texte courant. Rare : la plupart des blocs n'en ont pas.",
    sample: "Le code se lit plus souvent qu'il ne s'écrit.",
  },
  {
    name: "label",
    className: "font-mono text-[10px] tracking-[0.1em]",
    note: "Mono, sans capitales. Toute annotation du système. Il n'y a pas de second petit palier.",
    sample: "développeur backend",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Motion                                                             */
/* ------------------------------------------------------------------ */

/**
 * Durations, in ms. Slow by system: nothing here needs to grab the eye, so the
 * scale starts where a change is merely visible and goes up from there.
 */
export const MOTION = [
  { name: "hover", ms: 300, note: "Couleur et opacité sous le curseur." },
  { name: "state", ms: 500, note: "Une règle qui glisse, un panneau qui bascule." },
  { name: "arrival", ms: 900, note: "Une arrivée au premier passage à l'écran." },
  { name: "reveal", ms: 1200, note: "La texture qui se dessine." },
] as const;

/* ------------------------------------------------------------------ */
/* Trames                                                             */
/* ------------------------------------------------------------------ */

/**
 * A dot screen, as a tileable background image.
 * Kept as a data-free CSS gradient so it costs no request and recolours freely.
 */
export function dotScreen(color: string, size = 12, dot = 1): string {
  return `radial-gradient(${color} ${dot}px, transparent ${dot}px) 0 0 / ${size}px ${size}px`;
}
