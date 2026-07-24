/**
 * Evenly-spaced streamline placement over a noise flow field.
 *
 * A naive flow field — scatter N particles, integrate each one — collapses:
 * every particle drifts into the same few attractor curves, leaving fern-shaped
 * clumps against empty space. What this needs is the opposite: one curve
 * repeated at a *constant offset*, following a continuous direction, so density
 * stays even from edge to edge.
 *
 * So this uses the Jobard & Lefebvre approach instead. A new streamline is only
 * seeded where it stays at least `spacing` away from every curve already drawn,
 * and it stops as soon as it comes that close to one. The result is a family of
 * parallel, evenly-spaced curves.
 *
 * Geometry lives here rather than in the canvas component so the same code can
 * be rasterised headlessly for previews.
 */

import { makeFbm, makeNoise2D, makeRng } from "./noise";

export type Streamline = {
  /** Flattened as [x0, y0, x1, y1, …] — one allocation instead of one per point. */
  points: number[];
  /** Position on the colour ramp, 0 → 1. */
  tint: number;
  /**
   * Axis-aligned bounds, as [minX, minY, maxX, maxY].
   *
   * Lets an interactive redraw skip every curve that cannot touch the affected
   * region, which is what makes a per-frame local repaint cheap.
   */
  bbox: [number, number, number, number];
};

export type StreamlineOptions = {
  width: number;
  height: number;
  seed: number;
  /** Noise wavelength in px. Larger = wider, calmer bands. */
  scale: number;
  /** Distance held between neighbouring curves, in px. */
  spacing: number;
  /** How far a curve may travel, in steps. */
  maxSteps: number;
  /** Integration step, in px. */
  stepLength?: number;
  /** Angular range of the field, in half-turns. Higher = more vortices. */
  curl?: number;
  /** Fraction of the box added as bleed on each side. */
  margin?: number;
};

const OUTSIDE = -1;

export function buildStreamlines({
  width,
  height,
  seed,
  scale,
  spacing,
  maxSteps,
  stepLength = 2,
  curl = 1.05,
  margin = 0.1,
}: StreamlineOptions): Streamline[] {
  // Callers can pass values straight from a query string, so the parameters
  // that would divide by zero or allocate an unbounded grid are floored here.
  if (width < 1 || height < 1) return [];
  spacing = Math.max(1, spacing);
  scale = Math.max(1, scale);

  const rng = makeRng(seed);
  const flow = makeFbm(makeNoise2D(seed), 2);
  // Colour comes from an independent, higher-frequency field. Deriving it from
  // the direction field instead would just restate the flow in colour; keeping
  // them separate is what gives broad colour zones cutting across the curves.
  const tintNoise = makeFbm(makeNoise2D(seed + 9973), 2);

  // Curves are grown across a bleed box so the texture does not thin out
  // against the edges of its container.
  const padX = width * margin;
  const padY = height * margin;
  const minX = -padX;
  const minY = -padY;
  const boxW = width + padX * 2;
  const boxH = height + padY * 2;

  const cell = spacing;
  const cols = Math.max(1, Math.ceil(boxW / cell));
  const rows = Math.max(1, Math.ceil(boxH / cell));
  const grid: number[][] = Array.from({ length: cols * rows }, () => []);

  const cellIndex = (x: number, y: number) => {
    const cx = Math.floor((x - minX) / cell);
    const cy = Math.floor((y - minY) / cell);
    if (cx < 0 || cx >= cols || cy < 0 || cy >= rows) return OUTSIDE;
    return cy * cols + cx;
  };

  const spacingSq = spacing * spacing;

  /** True if (x, y) is within `spacing` of any point already committed. */
  const tooClose = (x: number, y: number) => {
    const cx = Math.floor((x - minX) / cell);
    const cy = Math.floor((y - minY) / cell);
    for (let j = cy - 1; j <= cy + 1; j++) {
      if (j < 0 || j >= rows) continue;
      for (let i = cx - 1; i <= cx + 1; i++) {
        if (i < 0 || i >= cols) continue;
        const bucket = grid[j * cols + i];
        for (let k = 0; k < bucket.length; k += 2) {
          const dx = bucket[k] - x;
          const dy = bucket[k + 1] - y;
          if (dx * dx + dy * dy < spacingSq) return true;
        }
      }
    }
    return false;
  };

  const commit = (x: number, y: number) => {
    const idx = cellIndex(x, y);
    if (idx !== OUTSIDE) grid[idx].push(x, y);
  };

  const inBox = (x: number, y: number) =>
    x >= minX && x <= minX + boxW && y >= minY && y <= minY + boxH;

  /** Integrates the field from a seed point in one direction. */
  const walk = (sx: number, sy: number, direction: 1 | -1): number[] => {
    const out: number[] = [];
    let x = sx;
    let y = sy;
    for (let s = 0; s < maxSteps; s++) {
      const angle = flow(x / scale, y / scale) * Math.PI * curl;
      x += Math.cos(angle) * stepLength * direction;
      y += Math.sin(angle) * stepLength * direction;
      if (!inBox(x, y) || tooClose(x, y)) break;
      out.push(x, y);
    }
    return out;
  };

  // Seeds are walked in a shuffled order so the field fills in evenly rather
  // than sweeping left-to-right, which would bias every curve's length.
  const seedStep = spacing * 1.4;
  const candidates: number[] = [];
  for (let y = minY; y < minY + boxH; y += seedStep) {
    for (let x = minX; x < minX + boxW; x += seedStep) {
      candidates.push(x + (rng() - 0.5) * seedStep, y + (rng() - 0.5) * seedStep);
    }
  }
  for (let i = candidates.length / 2 - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const xi = candidates[i * 2];
    const yi = candidates[i * 2 + 1];
    candidates[i * 2] = candidates[j * 2];
    candidates[i * 2 + 1] = candidates[j * 2 + 1];
    candidates[j * 2] = xi;
    candidates[j * 2 + 1] = yi;
  }

  const lines: Streamline[] = [];

  for (let c = 0; c < candidates.length; c += 2) {
    const sx = candidates[c];
    const sy = candidates[c + 1];
    if (tooClose(sx, sy)) continue;

    const backward = walk(sx, sy, -1);
    const forward = walk(sx, sy, 1);

    const points: number[] = [];
    for (let k = backward.length - 2; k >= 0; k -= 2) {
      points.push(backward[k], backward[k + 1]);
    }
    points.push(sx, sy);
    for (let k = 0; k < forward.length; k += 2) {
      points.push(forward[k], forward[k + 1]);
    }

    // Two-point stubs are noise, not texture.
    if (points.length < 8) continue;

    let minPx = Infinity;
    let minPy = Infinity;
    let maxPx = -Infinity;
    let maxPy = -Infinity;
    for (let k = 0; k < points.length; k += 2) {
      const px = points[k];
      const py = points[k + 1];
      commit(px, py);
      if (px < minPx) minPx = px;
      if (px > maxPx) maxPx = px;
      if (py < minPy) minPy = py;
      if (py > maxPy) maxPy = py;
    }

    // Amplified and clamped: raw fbm hugs its midpoint, which would pin every
    // curve to the middle of the ramp and never reach the warm end.
    const raw = tintNoise(sx / (scale * 0.55), sy / (scale * 0.55));
    const tint = Math.max(0, Math.min(1, 0.5 + raw * 1.15));

    lines.push({ points, tint, bbox: [minPx, minPy, maxPx, maxPy] });
  }

  return lines;
}
