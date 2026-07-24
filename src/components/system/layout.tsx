/**
 * Layout shells — the containers the études and the system page are built out
 * of. They own structure and nothing else: no colour decisions, no motion.
 */

import { cn } from "@/lib/utils";
import { Label } from "./primitives";

/**
 * A bounded surface for the texture.
 *
 * Every étude that shows a flow field needs the same two nested elements: a
 * clipped, positioned box and an inset-0 child for the canvas to measure
 * against. Doing it here means a texture panel is one element at the call site
 * and the two can never drift apart.
 */
export function Frame({
  children,
  className,
  style,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}>) {
  return (
    <div className={cn("relative overflow-hidden", className)} style={style}>
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

/**
 * An étude frame. The caption is annotated inside the frame's own top-right
 * rather than stacked above it as a second full-width bar: two banners in a
 * row read as a broken header.
 */
export function Etude({
  index,
  title,
  rule,
  children,
  className,
}: Readonly<{
  index: string;
  title: string;
  rule?: string;
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <section id={`e${index}`} className={cn("relative border-t border-border", className)}>
      {/* In flow, not absolute: a caption pinned over a short section spills
          onto the next one. Right-aligned and borderless so it annotates rather
          than reading as a second header bar under the page header. */}
      <div className="flex justify-end px-6 pb-2 pt-4">
        <div className="max-w-xs text-right">
          <Label numeric>
            {index} · {title}
          </Label>
          {rule ? (
            <p className="mt-1 hidden text-[10px] leading-relaxed text-muted-foreground md:block">
              {rule}
            </p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}
