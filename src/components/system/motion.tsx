"use client";

import { useEffect, useRef, useState } from "react";
import { FLAT } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

/**
 * Motion components.
 *
 * One rule governs all of them: motion is used to *arrive*, never to attract
 * attention on a loop. Everything here is one-shot and slow, with the single
 * documented exception of `Marquee`.
 */

/**
 * Reveals its children once, on first scroll into view.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: Readonly<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}>) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  // Reduced motion needs no branch here: the observer fires straight away for
  // anything already on screen, and `motion-reduce:transition-none` turns the
  // arrival into an instant state change rather than a fade.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      {
        // Inset the *bottom* only. A symmetric margin ("-8% 0px") also shrinks
        // the top of the observation area, so anything sitting in the top 8% of
        // the viewport on first paint never intersects — and a one-shot reveal
        // that never fires leaves its content at opacity 0 permanently.
        rootMargin: "0px 0px -8% 0px",
      },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-[900ms] ease-out motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/**
 * Splits a heading into characters so they can arrive one after another. Purely
 * decorative, so the whole string stays in a single accessible label.
 */
export function StaggerHeading({
  text,
  step = 35,
  className,
}: Readonly<{
  text: string;
  /** Delay between consecutive characters, in ms. */
  step?: number;
  className?: string;
}>) {
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      // Bottom-only, for the reason given in `Reveal`.
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <h2 ref={ref} aria-label={text} className={className}>
      {text.split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          aria-hidden="true"
          className="inline-block transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none"
          style={{
            transitionDelay: `${i * step}ms`,
            opacity: shown ? 1 : 0,
            transform: shown ? "translateY(0)" : "translateY(0.25em)",
          }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </h2>
  );
}

/**
 * A slow horizontal ticker — the system's one looping animation, and the reason
 * it is allowed is that it is confined to a band a few dozen pixels tall.
 * Duplicated once so the loop is seamless; paused on hover and skipped entirely
 * under reduced motion.
 */
export function Marquee({
  items,
  tone = FLAT.ink,
  duration = 38,
}: Readonly<{
  items: string[];
  /** Band background. Any CSS colour; defaults to ink. */
  tone?: string;
  /** Seconds for one full pass. Higher is calmer. */
  duration?: number;
}>) {
  const row = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item) => (
        <span key={item} className="text-[10px] uppercase tracking-[0.25em] whitespace-nowrap">
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="group flex overflow-hidden py-3"
      style={{ background: tone, color: FLAT.cream }}
    >
      {/* Duration rides in on a custom property rather than an inline
          `animation` shorthand: an inline shorthand would outrank the
          `motion-reduce:animate-none` utility and the ticker would keep
          running for people who asked it not to. */}
      <div
        className="flex animate-[marquee_var(--marquee-duration)_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {row}
        {row}
      </div>
    </div>
  );
}
