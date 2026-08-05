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

/* `StaggerHeading` a été retiré du système.
 *
 * Il découpait un titre en caractères pour les faire arriver l'un après
 * l'autre : un mouvement qui ne disait rien du contenu, et qui coûtait deux
 * choses. Il rendait chaque lettre en `inline-block`, donc ouvrait une césure
 * possible entre deux lettres à chaque titre — tout appel devait se souvenir
 * d'un `whitespace-nowrap`. Et il rendait un `h2` par appel, ce qui a valu à
 * la page d'accueil quatre titres de même rang pour une seule phrase et aucun
 * niveau un sur le document.
 *
 * Les trente-deux appels sont devenus des `h2` ordinaires portant la même
 * classe : la substitution est exacte à l'animation près, puisque c'est tout
 * ce qu'il ajoutait. */

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
