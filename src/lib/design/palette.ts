/**
 * Colour ramps for the flow-field texture, authored and interpolated in OKLCh.
 *
 * Why not just hand CSS colours to the canvas: `createLinearGradient` and any
 * naive lerp interpolate in sRGB, and these ramps run between near-complementary
 * hues (petrol → vermillion). In sRGB that midpoint collapses to grey and the
 * whole texture goes muddy. Interpolating L, C and H separately keeps the
 * chroma up across the whole ramp.
 *
 * Ramp positions are deliberately uneven. Warm tones sit in the last ~20% only,
 * so a rendered field reads as a cold field with a single warm accent rather
 * than an even rainbow.
 */

export type Stop = {
  /** Position along the ramp, 0 → 1. */
  at: number;
  /** OKLCh lightness, 0 → 1. */
  l: number;
  /** OKLCh chroma. */
  c: number;
  /** OKLCh hue, in degrees. */
  h: number;
};

export type Palette = {
  id: PaletteId;
  label: string;
  /** One-line reminder of where the palette comes from. */
  note: string;
  /** Representative swatch, as a CSS colour. */
  swatch: string;
  stops: Stop[];
};

export type PaletteId = "machine" | "ciel" | "terminal";

export const PALETTES: Record<PaletteId, Palette> = {
  machine: {
    id: "machine",
    label: "Machine",
    note: "Vermillon · bleu pétrole · crème, la seule palette que la texture utilise",
    swatch: "oklch(0.62 0.2 35)",
    stops: [
      { at: 0, l: 0.42, c: 0.09, h: 232 },
      { at: 0.45, l: 0.6, c: 0.11, h: 210 },
      { at: 0.78, l: 0.88, c: 0.05, h: 85 },
      { at: 1, l: 0.62, c: 0.2, h: 35 },
    ],
  },
  ciel: {
    id: "ciel",
    label: "Ciel",
    note: "Vert mousse · bleu crépuscule · jaune de fenêtre allumée",
    swatch: "oklch(0.85 0.15 90)",
    stops: [
      { at: 0, l: 0.38, c: 0.08, h: 252 },
      { at: 0.45, l: 0.55, c: 0.09, h: 180 },
      { at: 0.78, l: 0.72, c: 0.11, h: 142 },
      { at: 1, l: 0.85, c: 0.15, h: 90 },
    ],
  },
  terminal: {
    id: "terminal",
    label: "Terminal",
    note: "Vert terminal (hue 145). Gardée pour comparaison, aucune texture ne s'en sert",
    swatch: "oklch(0.5 0.18 145)",
    stops: [
      { at: 0, l: 0.34, c: 0.06, h: 158 },
      { at: 0.5, l: 0.58, c: 0.09, h: 152 },
      { at: 0.8, l: 0.86, c: 0.04, h: 150 },
      { at: 1, l: 0.5, c: 0.18, h: 145 },
    ],
  },
};

export const PALETTE_IDS = Object.keys(PALETTES) as PaletteId[];

export type Rgb = readonly [number, number, number];

const gamma = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055);
const clamp255 = (v: number) => Math.max(0, Math.min(255, Math.round(v * 255)));

/** OKLCh → sRGB, via OKLab and linear sRGB. Out-of-gamut values are clipped. */
export function oklchToRgb(l: number, c: number, hDeg: number): Rgb {
  const h = (hDeg * Math.PI) / 180;
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const L = l_ * l_ * l_;
  const M = m_ * m_ * m_;
  const S = s_ * s_ * s_;

  return [
    clamp255(gamma(4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S)),
    clamp255(gamma(-1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S)),
    clamp255(gamma(-0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S)),
  ] as const;
}

/**
 * Bakes a palette into a 256-entry sRGB lookup table. The canvas draws tens of
 * thousands of segments per render, so the conversion runs once up front rather
 * than per segment.
 */
export function buildRamp(palette: Palette, size = 256): Rgb[] {
  const { stops } = palette;
  const ramp: Rgb[] = new Array(size);

  for (let i = 0; i < size; i++) {
    const t = i / (size - 1);

    let hi = 1;
    while (hi < stops.length - 1 && stops[hi].at < t) hi++;
    const a = stops[hi - 1];
    const b = stops[hi];

    const span = b.at - a.at;
    const k = span === 0 ? 0 : (t - a.at) / span;

    // Shortest path around the hue circle, so a 350° → 20° step does not sweep
    // backwards through the whole spectrum.
    let dh = b.h - a.h;
    if (dh > 180) dh -= 360;
    if (dh < -180) dh += 360;

    ramp[i] = oklchToRgb(a.l + (b.l - a.l) * k, a.c + (b.c - a.c) * k, a.h + dh * k);
  }

  return ramp;
}

/** CSS colour for a single point on a palette, handy for swatches and borders. */
export function sampleCss(palette: Palette, t: number, alpha = 1): string {
  const ramp = buildRamp(palette, 64);
  const [r, g, b] = ramp[Math.max(0, Math.min(63, Math.round(t * 63)))];
  return alpha === 1 ? `rgb(${r} ${g} ${b})` : `rgb(${r} ${g} ${b} / ${alpha})`;
}
