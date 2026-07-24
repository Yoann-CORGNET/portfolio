"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { buildStreamlines, type Streamline } from "@/lib/design/streamlines";
import { buildRamp, PALETTES, sampleCss, type PaletteId } from "@/lib/design/palette";

/**
 * How the texture is faded out at its own edges. Without this a field ends on a
 * hard rectangle, which reads as "an image was pasted here" — the point is for
 * it to sit under the layout, not on top of it.
 */
export type FlowFieldFade = "none" | "edges" | "bottom" | "radial" | "sides";

const FADE_MASKS: Record<FlowFieldFade, string | undefined> = {
  none: undefined,
  edges: "radial-gradient(115% 115% at 50% 50%, #000 45%, transparent 100%)",
  bottom: "linear-gradient(to bottom, #000 35%, transparent 100%)",
  radial: "radial-gradient(circle at 50% 50%, #000 38%, transparent 72%)",
  sides: "linear-gradient(to right, transparent 0%, #000 18%, #000 82%, transparent 100%)",
};

export type FlowFieldProps = {
  /** Same seed always renders the same field — resizes never reshuffle it. */
  seed?: number;
  palette?: PaletteId;
  /** Distance held between neighbouring curves, in px. Lower = denser weave. */
  spacing?: number;
  /** Noise wavelength in px. Larger = wider, calmer bands. */
  scale?: number;
  /** How far a curve may travel, in steps. */
  maxSteps?: number;
  /** Angular range of the field, in half-turns. Higher = more vortices. */
  curl?: number;
  lineWidth?: number;
  /** Global opacity of the whole texture, 0 → 1. */
  intensity?: number;
  /** Duration of the progressive reveal. 0, or reduced-motion, draws at once. */
  revealMs?: number;
  fade?: FlowFieldFade;
  /** Let the pointer part the curves as it passes. Fine pointers only. */
  interactive?: boolean;
  /** Radius of the pointer's influence, in px. */
  influence?: number;
  /** Maximum displacement at the centre of that influence, in px. */
  strength?: number;
  /** Rotation applied inside the influence, in radians. 0 pushes straight out. */
  swirl?: number;
  /**
   * Fraction of the radius that receives the full displacement before the
   * falloff starts, 0 → 1. Higher flattens the bell into a disc; 0 restores a
   * classic peaked falloff.
   */
  plateau?: number;
  /**
   * Replace the system cursor with a reticle that draws the actual influence
   * radius. The ring sits on the disturbance and the crosshair on the true
   * pointer, so the gap between them is the easing lag made visible. Defaults
   * on, and only takes effect where `interactive` is set; pass `false` to keep
   * the system cursor over a reactive field.
   */
  cursor?: boolean;
  className?: string;
};

const REVEAL_CHUNKS = 40;
/** How fast the disturbance catches up with the pointer, per frame. */
const EASE = 0.12;

const smoothstep = (t: number) => {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
};

export function FlowField({
  seed = 1,
  palette = "machine",
  spacing = 7,
  scale = 360,
  maxSteps = 500,
  curl = 1.05,
  lineWidth = 1,
  intensity = 1,
  revealMs = 1200,
  fade = "none",
  interactive = false,
  influence = 170,
  strength = 26,
  swirl = 0.5,
  plateau = 0.5,
  cursor = true,
  className,
}: Readonly<FlowFieldProps>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  // The reveal is a first-impression effect. Once it has played, later renders
  // (a prop tweak, a resize) redraw instantly.
  const revealedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Pointer displacement is direct manipulation: the field only moves while
    // the pointer does. That is a hover state, not autonomous motion, so
    // reduced-motion does not switch it off — it removes the part that *is*
    // autonomous (the disturbance easing along after you stop) by following
    // instantly instead, and takes the amplitude down.
    const pointerEnabled = interactive;
    const ease = reduceMotion ? 1 : EASE;
    const maxPush = reduceMotion ? strength * 0.55 : strength;

    let lines: Streamline[] = [];
    let ramp = buildRamp(PALETTES[palette]);
    let width = 0;
    let height = 0;

    let frame = 0;
    let cancelled = false;

    /* ---------------------------------------------------------------- */
    /* Pointer state                                                    */
    /* ---------------------------------------------------------------- */

    // Target is where the pointer is; eased is where the disturbance actually
    // is. Lagging behind on purpose: a disturbance that snaps to the cursor
    // feels twitchy against the calm the rest of the system keeps.
    let targetX = 0;
    let targetY = 0;
    let easedX = 0;
    let easedY = 0;
    // 0 → at rest, 1 → fully engaged. Eased too, so leaving relaxes the field
    // instead of dropping it.
    let targetAmp = 0;
    let amp = 0;
    let seeded = false;
    /** Region touched last frame, so it can be cleaned up on the next one. */
    let previousRect: [number, number, number, number] | null = null;

    const reach = () => influence + maxPush;

    /** Displaces a point out of the pointer's way. Identity when at rest. */
    const displace = (x: number, y: number, out: [number, number]) => {
      if (amp < 0.001) {
        out[0] = x;
        out[1] = y;
        return;
      }
      const dx = x - easedX;
      const dy = y - easedY;
      const dist = Math.hypot(dx, dy);
      if (dist > influence || dist < 0.0001) {
        out[0] = x;
        out[1] = y;
        return;
      }
      // Flat-topped falloff rather than a peak. A plain `(1 - d/R)²` puts almost
      // all of the displacement in the few pixels around the centre, so the
      // bulge reads as a pinprick. Holding full push across the inner `plateau`
      // of the radius and easing out over the remainder pushes the whole disc
      // aside instead, which is what makes a small radius feel substantial.
      const t = dist / influence;
      const eased = t <= plateau ? 1 : 1 - smoothstep((t - plateau) / Math.max(1e-6, 1 - plateau));
      const f = eased * amp;
      const push = f * maxPush;
      const angle = f * swirl;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const ux = dx / dist;
      const uy = dy / dist;
      out[0] = x + (ux * cos - uy * sin) * push;
      out[1] = y + (ux * sin + uy * cos) * push;
    };

    const point: [number, number] = [0, 0];

    const strokeLine = ({ points, tint }: Streamline) => {
      const [r, g, b] = ramp[Math.round(tint * 255)];
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.85 * intensity})`;
      ctx.beginPath();
      displace(points[0], points[1], point);
      ctx.moveTo(point[0], point[1]);
      for (let k = 2; k < points.length; k += 2) {
        displace(points[k], points[k + 1], point);
        ctx.lineTo(point[0], point[1]);
      }
      ctx.stroke();
    };

    /**
     * Repaints only the given rect, restroking just the curves whose bounds can
     * reach into it. This is what keeps pointer response cheap: a full repaint
     * would restroke every curve on the canvas each frame.
     */
    const repaintRect = ([x0, y0, x1, y1]: [number, number, number, number]) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x0, y0, x1 - x0, y1 - y0);
      ctx.clip();
      ctx.clearRect(x0, y0, x1 - x0, y1 - y0);
      const pad = maxPush + lineWidth;
      for (const line of lines) {
        const [bx0, by0, bx1, by1] = line.bbox;
        if (bx1 + pad < x0 || bx0 - pad > x1 || by1 + pad < y0 || by0 - pad > y1) continue;
        strokeLine(line);
      }
      ctx.restore();
    };

    const union = (
      a: [number, number, number, number] | null,
      b: [number, number, number, number] | null,
    ): [number, number, number, number] | null => {
      if (!a) return b;
      if (!b) return a;
      return [
        Math.min(a[0], b[0]),
        Math.min(a[1], b[1]),
        Math.max(a[2], b[2]),
        Math.max(a[3], b[3]),
      ];
    };

    const currentRect = (): [number, number, number, number] | null => {
      if (amp < 0.001) return null;
      // Padded past the actual reach: clipping and restroking on an exact
      // boundary leaves a faint antialiased seam where the clip edge fell.
      const r = reach() + 2;
      return [easedX - r, easedY - r, easedX + r, easedY + r];
    };

    /* ---------------------------------------------------------------- */
    /* Reticle                                                          */
    /* ---------------------------------------------------------------- */

    // Driven from the same loop as the displacement rather than from its own
    // listener: sharing the eased position is what keeps the ring exactly on
    // the disturbance instead of drifting a frame away from it.
    const paintCursor = () => {
      const overlay = overlayRef.current;
      if (!overlay) return;
      overlay.style.opacity = String(amp);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${easedX}px, ${easedY}px, 0) scale(${0.6 + amp * 0.4})`;
      }
      if (markRef.current) {
        markRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }
      if (readoutRef.current) {
        readoutRef.current.textContent = `${Math.round(targetX)} · ${Math.round(targetY)}`;
      }
    };

    /* ---------------------------------------------------------------- */
    /* Pointer loop                                                     */
    /* ---------------------------------------------------------------- */

    let pointerFrame = 0;
    let looping = false;

    const tick = () => {
      if (cancelled) return;

      easedX += (targetX - easedX) * ease;
      easedY += (targetY - easedY) * ease;
      amp += (targetAmp - amp) * ease;

      const rect = currentRect();
      const dirty = union(previousRect, rect);
      if (dirty) repaintRect(dirty);
      previousRect = rect;

      const settled =
        Math.abs(targetAmp - amp) < 0.004 &&
        Math.abs(targetX - easedX) < 0.5 &&
        Math.abs(targetY - easedY) < 0.5;

      // Any settled state stops the loop, not just the fully-at-rest one. A
      // pointer resting inside the panel is just as static as one that has
      // left, and keeping the frame loop alive there repaints the same region
      // sixty times a second for no visible change. The next pointermove
      // restarts it.
      if (settled) {
        looping = false;
        if (targetAmp === 0) {
          // True rest. The last repaint is a full one: local repaints
          // accumulate faint seams along every clip edge the disturbance
          // crossed, so the field would not return to exactly the pixels it
          // started from. One whole-canvas redraw guarantees it does.
          amp = 0;
          previousRect = null;
          ctx.clearRect(0, 0, width, height);
          lines.forEach(strokeLine);
        }
        paintCursor();
        return;
      }

      paintCursor();
      pointerFrame = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (looping) return;
      looping = true;
      pointerFrame = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      // Filter on the device actually in use rather than on a `(pointer: fine)`
      // capability query: a touchscreen laptop reports a fine pointer, but a
      // finger dragging the page should not disturb the field.
      if (event.pointerType === "touch") return;
      const box = parent.getBoundingClientRect();
      targetX = event.clientX - box.left;
      targetY = event.clientY - box.top;
      if (!seeded) {
        // First contact: start the disturbance where the pointer is, so it does
        // not sweep across the panel from a stale origin.
        easedX = targetX;
        easedY = targetY;
        seeded = true;
      }
      targetAmp = 1;
      startLoop();
    };

    const onPointerLeave = () => {
      targetAmp = 0;
      startLoop();
    };

    /* ---------------------------------------------------------------- */
    /* Build + reveal                                                   */
    /* ---------------------------------------------------------------- */

    const render = (withReveal: boolean) => {
      const box = parent.getBoundingClientRect();
      width = box.width;
      height = box.height;
      if (width < 1 || height < 1) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = lineWidth;

      lines = buildStreamlines({ width, height, seed, scale, spacing, maxSteps, curl });
      ramp = buildRamp(PALETTES[palette]);
      previousRect = null;

      if (!withReveal || reduceMotion || revealMs <= 0 || revealedRef.current) {
        lines.forEach(strokeLine);
        revealedRef.current = true;
        return;
      }
      revealedRef.current = true;

      const perChunk = Math.ceil(lines.length / REVEAL_CHUNKS);
      const chunkDelay = revealMs / REVEAL_CHUNKS;
      let drawn = 0;
      let last = performance.now();

      const step = (now: number) => {
        if (cancelled) return;
        if (now - last >= chunkDelay) {
          last = now;
          const end = Math.min(drawn + perChunk, lines.length);
          for (; drawn < end; drawn++) strokeLine(lines[drawn]);
        }
        if (drawn < lines.length) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    // The reveal should happen when the visitor reaches the texture, not while
    // it sits unseen at the bottom of the page.
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          started = true;
          render(true);
          io.disconnect();
        }
      },
      { rootMargin: "80px" },
    );
    io.observe(parent);

    let resizeTimer: number | undefined;
    const ro = new ResizeObserver(() => {
      if (!started) return;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        cancelAnimationFrame(frame);
        seeded = false;
        render(false);
      }, 140);
    });
    ro.observe(parent);

    const previousCursor = parent.style.cursor;
    if (pointerEnabled) {
      parent.addEventListener("pointermove", onPointerMove);
      parent.addEventListener("pointerleave", onPointerLeave);
      if (cursor) parent.style.cursor = "none";
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pointerFrame);
      window.clearTimeout(resizeTimer);
      io.disconnect();
      ro.disconnect();
      parent.removeEventListener("pointermove", onPointerMove);
      parent.removeEventListener("pointerleave", onPointerLeave);
      parent.style.cursor = previousCursor;
    };
  }, [
    seed,
    palette,
    spacing,
    scale,
    maxSteps,
    curl,
    lineWidth,
    intensity,
    revealMs,
    interactive,
    influence,
    strength,
    swirl,
    plateau,
    cursor,
  ]);

  const mask = FADE_MASKS[fade];
  // The warm end of the ramp, so the reticle is the panel's one hot point and
  // stays legible whether the panel behind it is cream or ink.
  const reticle = sampleCss(PALETTES[palette], 1);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={cn("pointer-events-none block h-full w-full", className)}
        style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
      />
      {interactive && cursor ? (
        <div
          ref={overlayRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ opacity: 0 }}
        >
          {/* Influence radius, drawn at true size — the reticle states the
              mechanism rather than decorating it. */}
          <div
            ref={ringRef}
            className="absolute left-0 top-0 rounded-full border will-change-transform"
            style={{
              width: influence * 2,
              height: influence * 2,
              marginLeft: -influence,
              marginTop: -influence,
              borderColor: reticle,
              opacity: 0.35,
            }}
          />
          <div ref={markRef} className="absolute left-0 top-0 will-change-transform">
            <span
              className="absolute block"
              style={{ background: reticle, width: 13, height: 1, marginLeft: -6, marginTop: 0 }}
            />
            <span
              className="absolute block"
              style={{ background: reticle, width: 1, height: 13, marginLeft: 0, marginTop: -6 }}
            />
            <span
              ref={readoutRef}
              className="absolute whitespace-nowrap text-[10px] uppercase tracking-[0.2em] tabular-nums"
              style={{ color: reticle, left: 14, top: 6 }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
