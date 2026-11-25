import type { CSSProperties, ReactNode } from "react";
import { FlatBlock, Label } from "@/components/system";
import type { FlatToken } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import { ProjectHeroMascot, type MascotScene } from "./project-hero-mascot";

/**
 * The shared skeleton behind every project's opening block: a flat panel
 * with an optional eyebrow, a title, and a lead paragraph. Each instance
 * differs enough in type scale and spacing that the typography stays
 * caller-supplied rather than baked in — this only centralises the
 * structure, not the look.
 */
export function ProjectHero({
  tone,
  dots = false,
  section = true,
  blockClassName,
  eyebrow,
  eyebrowClassName,
  eyebrowStyle,
  title,
  titleClassName,
  lead,
  leadClassName,
  leadStyle,
  body,
  mascot,
}: Readonly<{
  tone: FlatToken;
  /** Overlay the dot screen on the panel. */
  dots?: boolean;
  /** Wrap the panel in a `<section className="border-b border-border">`. */
  section?: boolean;
  blockClassName: string;
  eyebrow?: ReactNode;
  eyebrowClassName?: string;
  eyebrowStyle?: CSSProperties;
  title: ReactNode;
  titleClassName: string;
  lead?: ReactNode;
  leadClassName?: string;
  leadStyle?: CSSProperties;
  /** Extra content below the lead paragraph, already styled by the caller. */
  body?: ReactNode;
  /**
   * Prompt comes in from the right and takes the project's pose: over the
   * right of the block on wide screens, below the lead otherwise.
   */
  mascot?: MascotScene;
}>) {
  const panel = (
    <FlatBlock tone={tone} dots={dots} className={blockClassName}>
      <div className="mx-auto max-w-6xl">
        {eyebrow ? (
          <Label tone="inherit" className={eyebrowClassName} style={eyebrowStyle}>
            {eyebrow}
          </Label>
        ) : null}
        <h1 className={titleClassName}>{title}</h1>
        {lead ? (
          <p className={cn(leadClassName)} style={leadStyle}>
            {lead}
          </p>
        ) : null}
        {body}
        {mascot && <ProjectHeroMascot scene={mascot} placement="inline" />}
      </div>
    </FlatBlock>
  );

  // The wide placement is positioned against this box, so it needs one even
  // without `section`.
  const layer = mascot && <ProjectHeroMascot scene={mascot} placement="layer" />;
  if (section) {
    return (
      <section className="relative border-b border-border">
        {panel}
        {layer}
      </section>
    );
  }
  return layer ? (
    <div className="relative">
      {panel}
      {layer}
    </div>
  ) : (
    panel
  );
}
