"use client";

import { useEffect, useState } from "react";
import { FLAT, MOTION } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import { Label } from "./primitives";

/**
 * Live specimens for the system page.
 *
 * Not part of the library — nothing outside `/design-system` should import
 * this. It exists because some foundations cannot be documented as a table.
 * Four durations listed in a column say nothing about how they feel; the only
 * way to document timing is to run it.
 */

/** Tailwind's `ease-out`, so a row moves exactly like the components do. */
const EASE = "cubic-bezier(0, 0, 0.2, 1)";

/**
 * The motion scale, demonstrated with the system's own hover idiom.
 *
 * This is `HoverIndex` — the warm rule sweeping across the row, the label
 * taking the accent and stepping aside — with one thing changed: the speed is
 * not the system default, it is whatever the row is documenting. Sweeping down
 * the four steps makes the scale physical, and reusing the idiom rather than
 * inventing a gauge means the section is also a second sighting of a component
 * the reader already met.
 *
 * The gesture is hover on purpose: it is the very thing the first row governs,
 * so the section demonstrates its own opening entry.
 */
export function MotionScale() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <ul className="border-t border-border" onMouseLeave={() => setActive(null)}>
      {MOTION.map((step, i) => {
        const on = active === i;
        // The row's own duration, handed to every property that moves.
        //
        // Deliberately *not* guarded by `motion-reduce`. Everywhere else in the
        // system that guard is right, but here the travel is the subject: a
        // duration scale whose durations are removed documents nothing, and a
        // reader who asked for less motion still deserves to know what 1200ms
        // costs. It is also strictly direct manipulation — nothing moves unless
        // the pointer is on the row — which is the same reasoning that keeps the
        // flow field reactive under the preference. `HoverIndex`, the component
        // this borrows from, carries no guard either.
        const timing = { transitionDuration: `${step.ms}ms`, transitionTimingFunction: EASE };

        return (
          <li key={step.name} className="border-b border-border">
            <button
              type="button"
              className="relative flex w-full items-baseline gap-4 py-4 text-left"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-px w-full origin-left transition-transform"
                style={{
                  background: FLAT.vermillon,
                  transform: `scaleX(${on ? 1 : 0})`,
                  ...timing,
                }}
              />
              <Label
                tone="strong"
                className="w-20 shrink-0 transition-[color,transform]"
                style={{
                  color: on ? FLAT.vermillon : undefined,
                  transform: on ? "translateX(6px)" : "none",
                  ...timing,
                }}
              >
                {step.name}
              </Label>
              <Label numeric className="w-16 shrink-0">
                {step.ms} ms
              </Label>
              <span className="text-xs leading-relaxed text-muted-foreground">{step.note}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * A type step you can take away.
 *
 * A scale is only useful if the classes that produce it are reachable, and
 * reading them off a screenshot is how a system stops being used. Clicking the
 * sample copies its utility string.
 *
 * The whole specimen is the target rather than a discreet copy icon: the sample
 * is already the biggest thing in the row, and a large obvious target beats a
 * small correct one.
 */
export function TypeSpecimen({
  className,
  sample,
}: Readonly<{ className: string; sample: string }>) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  // Clearing the confirmation on a timer, cancelled on unmount so a click just
  // before navigating away cannot set state on a gone component.
  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), 1600);
    return () => window.clearTimeout(timer);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(className);
      setState("copied");
    } catch {
      // Clipboard access needs a secure context and can be refused outright.
      // Saying so is better than a button that silently does nothing.
      setState("failed");
    }
  };

  const hint = {
    idle: "cliquer pour copier les classes",
    copied: "copié",
    failed: "copie refusée par le navigateur",
  }[state];

  return (
    <div className="group">
      <button
        type="button"
        onClick={copy}
        aria-label={`Copier les classes : ${className}`}
        className="block w-full cursor-pointer overflow-hidden text-left transition-opacity duration-300 hover:opacity-60"
      >
        <span className={className}>{sample}</span>
      </button>
      {/* The invitation may hide until hover, but the *answer* never can: on a
          touch screen there is no hover state at all, and a failed copy that
          says nothing is indistinguishable from a dead button. */}
      <span className="mt-3 flex items-center gap-3" aria-live="polite">
        <Label
          className={cn(
            "transition-opacity duration-300",
            state === "idle"
              ? "opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
              : "opacity-100",
          )}
          style={state === "copied" ? { color: FLAT.vermillon } : undefined}
        >
          {hint}
        </Label>
      </span>
      <code className="mt-1 block truncate font-mono text-[10px] text-muted-foreground opacity-50">
        {className}
      </code>
    </div>
  );
}
