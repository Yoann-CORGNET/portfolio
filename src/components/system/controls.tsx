"use client";

import { createContext, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { FLAT, FLAT_ON } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

/**
 * Interactive controls.
 *
 * The system's rule for state is that the warm accent marks exactly one thing
 * at a time — the row under the cursor, the active segment. An interface where
 * three things are highlighted at once has no highlight.
 */

/**
 * An index list where hovering a row slides a warm rule across it.
 */
export function HoverIndex({
  items,
}: Readonly<{ items: { name: string; meta: string; year: string }[] }>) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <ul className="border-t border-border" onMouseLeave={() => setActive(null)}>
      {items.map((item, i) => (
        <li key={item.name} className="border-b border-border">
          <button
            type="button"
            className="group relative flex w-full items-baseline gap-6 py-6 text-left"
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-px origin-left transition-transform duration-500 ease-out"
              style={{
                background: FLAT.vermillon,
                width: "100%",
                transform: `scaleX(${active === i ? 1 : 0})`,
              }}
            />
            <span className="w-8 shrink-0 text-[10px] tabular-nums tracking-[0.2em] text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className="flex-1 text-lg tracking-tight transition-[color,transform] duration-500 ease-out"
              style={{
                color: active === i ? FLAT.vermillon : undefined,
                transform: active === i ? "translateX(6px)" : "none",
              }}
            >
              {item.name}
            </span>
            <span className="hidden text-sm text-muted-foreground sm:block">{item.meta}</span>
            <span className="text-[10px] tabular-nums tracking-[0.2em] text-muted-foreground">
              {item.year}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Segmented switcher — flat blocks, one active, no shadow. */
export function Segmented({
  options,
  panels,
}: Readonly<{ options: string[]; panels: React.ReactNode[] }>) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex flex-wrap gap-px bg-border">
        {options.map((option, i) => (
          <button
            key={option}
            type="button"
            onClick={() => setActive(i)}
            className="px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-colors duration-300"
            style={
              active === i
                ? { background: FLAT.ink, color: FLAT.cream }
                : { background: FLAT.cream, color: FLAT.ink }
            }
          >
            {option}
          </button>
        ))}
      </div>
      <div className="relative mt-px">
        {panels.map((panel, i) => (
          <div
            key={options[i]}
            hidden={active !== i}
            className="animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Surface switch                                                     */
/* ------------------------------------------------------------------ */

export type Surface = "cream" | "ink";

const STORAGE_KEY = "design-system:surface";

/* The preference is not React state — it lives in localStorage, which React
   does not own. Modelling it as an external store rather than as `useState`
   seeded from an effect is what keeps the read out of the render path, keeps
   two open tabs in agreement, and avoids the cascading render that seeding in
   an effect causes. */

const listeners = new Set<() => void>();

const subscribe = (notify: () => void) => {
  listeners.add(notify);
  // `storage` only fires in *other* tabs, so local writes notify by hand.
  window.addEventListener("storage", notify);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", notify);
  };
};

const readSurface = (): Surface =>
  window.localStorage.getItem(STORAGE_KEY) === "ink" ? "ink" : "cream";

/** The server has no storage, so it always renders the default surface. */
const serverSurface = (): Surface => "cream";

const writeSurface = (next: Surface) => {
  window.localStorage.setItem(STORAGE_KEY, next);
  listeners.forEach((notify) => notify());
};

const SurfaceContext = createContext<{
  surface: Surface;
  setSurface: (next: Surface) => void;
} | null>(null);

/**
 * Remembers which surface the system page previews components on.
 *
 * The texture and the flat blocks behave very differently on cream and on ink,
 * and a design system that can only show one of them is lying by omission. One
 * provider drives every preview at once, so the whole page answers the question
 * "what does this look like on dark?" in a single click.
 *
 * The choice is persisted because it is a *reading preference*, not page state:
 * coming back and finding it reset would be the wrong behaviour.
 *
 * This is scoped to the system page. The site itself is light-only (see
 * CLAUDE.md) — this switches a preview surface, not a theme.
 */
export function SurfaceProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const surface = useSyncExternalStore(subscribe, readSurface, serverSurface);
  const value = useMemo(() => ({ surface, setSurface: writeSurface }), [surface]);

  return <SurfaceContext.Provider value={value}>{children}</SurfaceContext.Provider>;
}

function useSurfaceContext() {
  const ctx = useContext(SurfaceContext);
  if (!ctx) throw new Error("Surface components must be rendered inside <SurfaceProvider>.");
  return ctx;
}

/** The two-state control that drives every `Preview` on the page. */
export function SurfaceSwitch() {
  const { surface, setSurface } = useSurfaceContext();

  return (
    <fieldset className="flex gap-px border-0 bg-border p-0">
      <legend className="sr-only">Surface d&apos;aperçu</legend>
      {(["cream", "ink"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setSurface(option)}
          aria-pressed={surface === option}
          className="px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors duration-300"
          style={
            surface === option
              ? { background: FLAT.ink, color: FLAT.cream }
              : { background: FLAT.cream, color: FLAT.ink }
          }
        >
          {option}
        </button>
      ))}
    </fieldset>
  );
}

/**
 * The stage a component is demonstrated on.
 *
 * Takes server-rendered children and only supplies the surface around them, so
 * documenting a component does not drag it across the client boundary.
 */
export function Preview({
  children,
  className,
  padded = true,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  /** Off for previews that need to reach the edges, like a texture panel. */
  padded?: boolean;
}>) {
  const { surface } = useSurfaceContext();

  return (
    <div
      className={cn(
        "border border-border transition-colors duration-500",
        padded && "p-8",
        className,
      )}
      style={{ background: FLAT[surface], color: FLAT_ON[surface] }}
      data-surface={surface}
    >
      {children}
    </div>
  );
}
