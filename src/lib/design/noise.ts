/**
 * Deterministic 2D gradient noise, used to drive the flow-field texture.
 *
 * Everything here is seeded: the same seed always renders the same field, so a
 * canvas can be redrawn on resize (or re-mounted) without the texture changing
 * under the visitor.
 */

/** Mulberry32 — small, fast, seedable PRNG. */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GRADIENTS: ReadonlyArray<readonly [number, number]> = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Perlin-style gradient noise in `[-1, 1]`. Smoother than value noise, which
 * matters here: the field is integrated over many steps, and value noise leaves
 * visible grid artefacts in the resulting streamlines.
 */
export function makeNoise2D(seed: number): (x: number, y: number) => number {
  const rng = makeRng(seed);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = p[i];
    p[i] = p[j];
    p[j] = tmp;
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const dot = (gi: number, x: number, y: number) => {
    const g = GRADIENTS[gi & 7];
    return g[0] * x + g[1] * y;
  };

  return (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const X = xi & 255;
    const Y = yi & 255;
    const xf = x - xi;
    const yf = y - yi;
    const u = fade(xf);
    const v = fade(yf);

    const aa = perm[perm[X] + Y];
    const ba = perm[perm[X + 1] + Y];
    const ab = perm[perm[X] + Y + 1];
    const bb = perm[perm[X + 1] + Y + 1];

    const x1 = lerp(dot(aa, xf, yf), dot(ba, xf - 1, yf), u);
    const x2 = lerp(dot(ab, xf, yf - 1), dot(bb, xf - 1, yf - 1), u);
    return lerp(x1, x2, v) * 1.4; // roughly normalised to [-1, 1]
  };
}

/**
 * Fractal Brownian motion: stacked octaves of `noise`. Two octaves is enough
 * for a flow field — more just adds high-frequency wobble that the streamline
 * integration averages away anyway.
 */
export function makeFbm(
  noise: (x: number, y: number) => number,
  octaves = 2,
): (x: number, y: number) => number {
  return (x, y) => {
    let sum = 0;
    let amp = 1;
    let freq = 1;
    let norm = 0;
    for (let i = 0; i < octaves; i++) {
      sum += noise(x * freq, y * freq) * amp;
      norm += amp;
      amp *= 0.5;
      freq *= 2;
    }
    return sum / norm;
  };
}
