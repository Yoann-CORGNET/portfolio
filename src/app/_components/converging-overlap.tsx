"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { OverlapTriangle, type OverlapLabels } from "@/components/system";

const SIDE = 60;

// FAR = 120 (120% of figure width): the three squares start straddling the
// scene edges, so the entrance is a hard crop rather than an appearance.
// CONTACT = SIDE / 2 is a geometric fact, not a tuned value: with skew=45
// the faces point at the center, so the squares touch exactly when the
// spacing drops below half a side.
const FAR = 120;
const CONTACT = SIDE / 2;
const REST = 25;

// The 90/95 units of travel happen before contact; the shared area only
// grows in the last 5 — a single easing curve can't serve both (measured: a
// `quint` alone burns 41% of the travel in the first 10% of scroll). Hence
// two regimes split at HINGE: constant-speed approach, then a braked
// contact phase.
const HINGE = 0.5;

// LOCK sits before geometric contact (not at it) so the page-freeze reads as
// deliberate rather than as the last bit of motion in an already-stopped
// figure. At 0.37 the speed discontinuity across the lock is ~1.2x on the
// current track — beyond that it becomes a visible jump.
const LOCK = 0.37;

// The last 42% of the lock plays nothing (~600px of unresponsive scroll) —
// the pause itself is the "you have arrived" signal. This value trades
// against the active track: raising it shortens both the frozen travel and
// the reveal, so it's tuned together with the track length.
const DWELL = 0.42;

const ease = (p: number) => 1 - (1 - p) ** 2;

function radiusAt(p: number) {
  if (p >= HINGE) return CONTACT - (CONTACT - REST) * ease((p - HINGE) / (1 - HINGE));
  return FAR - (FAR - CONTACT) * (p / HINGE);
}

// Below `md` the scene never pins (no `sticky`), so this branch measures
// scroll from the figure's own position instead: starts as it enters from
// the bottom, ends when its center reaches 35% of viewport height. Reading
// `position` off the scene (rather than a breakpoint check) ties this to the
// same `md:motion-safe:sticky` class that governs the locked branch, so the
// two can't disagree about which mode is active.
const CLOSE_AT = 0.35;

const STEPS = 200;

const clamp = (p: number) => Math.min(1, Math.max(0, p));

// useLayoutEffect measures and re-syncs before paint, avoiding a flash of
// the closed rest state when the page loads mid-section or via an anchor.
// It doesn't exist during SSR, hence the useEffect fallback (a no-op there).
const useMeasureBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function ConvergingOverlap({ labels }: Readonly<{ labels: OverlapLabels }>) {
  const ref = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(1);

  useMeasureBeforePaint(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scene = node.closest<HTMLElement>("[data-scene]");
    const stage = scene?.querySelector<HTMLElement>("[data-stage]") ?? null;

    let frame = 0;
    let pinned = false;

    const survey = () => {
      pinned = stage !== null && getComputedStyle(stage).position === "sticky";
    };

    const measure = () => {
      frame = 0;
      const view = window.innerHeight;
      const fig = node.getBoundingClientRect();
      const centre = fig.top + fig.height / 2;
      const from = view + fig.height / 2;

      let raw: number;
      if (pinned && scene && stage) {
        const track = scene.getBoundingClientRect();
        const held = stage.offsetHeight;
        if (track.top > 0) {
          raw = LOCK * clamp((from - centre) / Math.max(1, from - held / 2));
        } else {
          const held01 = clamp(-track.top / Math.max(1, track.height - held));
          raw = LOCK + (1 - LOCK) * clamp(held01 / (1 - DWELL));
        }
      } else {
        raw = clamp((from - centre) / Math.max(1, from - view * CLOSE_AT));
      }

      setProgress(Math.round(clamp(raw) * STEPS) / STEPS);
    };

    // Scroll events are coalesced to one rAF: a `scroll` can fire multiple
    // times between renders, only the latest position matters.
    const schedule = () => {
      frame ||= requestAnimationFrame(measure);
    };

    const relayout = () => {
      survey();
      schedule();
    };

    survey();
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", relayout);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", relayout);
    };
  }, []);

  return (
    <div ref={ref}>
      <OverlapTriangle side={SIDE} radius={radiusAt(progress)} labels={labels} />
    </div>
  );
}
