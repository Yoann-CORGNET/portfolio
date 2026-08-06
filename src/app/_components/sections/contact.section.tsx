import { Github, Linkedin } from "lucide-react";
import { Action, Bracketed, FlatBlock, FlowField } from "@/components/system";
import { ContactForm } from "@/app/_components/contact-form";
import { FLAT, dotScreen } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

const TEXTURE = {
  palette: "machine",
  spacing: 7,
  scale: 360,
  curl: 1.05,
  lineWidth: 1,
} as const;

const LINKS = [
  { label: "GitHub", href: "https://github.com/yoann-corgnet", Icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/in/yoann-corgnet", Icon: Linkedin },
] as const;

/* ------------------------------------------------------------------ */
/* L'accroche                                                         */
/* ------------------------------------------------------------------ */

const HOOK = ["Une idée,", "un défi technique", "ou simplement une discussion ?"] as const;

// Longest line is 30 chars; JetBrains Mono at 0.6em/glyph with tracking-tighter
// (-0.05em) gives 16.5em, capped to 7/12 of max-w-6xl at gap-16 (617px) = 2.3rem.
// The vw term keeps mobile under its overflow point (line fits at 5vw; 4.8vw
// leaves a tenth of margin) — whitespace-nowrap makes it non-negotiable.
export const HOOK_SIZE_COLUMN = "text-[clamp(1rem,4.8vw,2.3rem)]";

export function ContactHook({ className }: Readonly<{ className?: string }>) {
  return (
    <h2 className={cn("font-bold leading-[0.9] tracking-tighter", className)}>
      {HOOK.map((line) => (
        <span key={line} className="block whitespace-nowrap">
          {line}
        </span>
      ))}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/* Le pupitre                                                         */
/* ------------------------------------------------------------------ */

const OPAQUE_KEY = cn(
  "bg-[var(--f-field)]",
  "hover:bg-[color-mix(in_srgb,currentColor_8%,var(--f-field))]",
);

export function ContactPupitre({
  aside,
  className,
}: Readonly<{ aside?: React.ReactNode; className?: string }>) {
  return (
    <FlatBlock tone="cream" dots className={className}>
      <div className="relative p-7 md:p-10">
        <ContactForm skin="cream" shape="boxed" aside={aside} />
        <Corners />
      </div>
    </FlatBlock>
  );
}

function Corners() {
  const corner = "absolute h-3 w-3 border-current/25";
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-3">
      <span className={cn(corner, "left-0 top-0 border-l border-t")} />
      <span className={cn(corner, "right-0 top-0 border-r border-t")} />
      <span className={cn(corner, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(corner, "bottom-0 right-0 border-b border-r")} />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Les profils                                                        */
/* ------------------------------------------------------------------ */

export function ContactProfiles() {
  return (
    <div className="flex gap-4">
      {LINKS.map((link) => (
        <Action
          key={link.label}
          href={link.href}
          external
          variant="outline"
          size="md"
          className={OPAQUE_KEY}
        >
          <span className="flex items-center gap-2">
            <link.Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
            {link.label}
          </span>
        </Action>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* La section                                                         */
/* ------------------------------------------------------------------ */

export function ContactSection() {
  return (
    <section id="contact">
      <FlatBlock tone="ink" className="py-28 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <ContactHook className={HOOK_SIZE_COLUMN} />
            <ContactPupitre className="mt-10" aside={<ContactProfiles />} />
          </div>

          <div className="flex flex-col md:col-span-5">
            <Bracketed className="p-2 md:flex-1">
              <div className="relative aspect-[4/5] overflow-hidden md:aspect-auto md:h-full">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{ background: dotScreen(FLAT.cream) }}
                />
                <div className="absolute inset-0">
                  <FlowField
                    {...TEXTURE}
                    seed={12}
                    intensity={0.8}
                    maxSteps={700}
                    fade="edges"
                    interactive
                    influence={95}
                    strength={34}
                  />
                </div>
              </div>
            </Bracketed>
          </div>
        </div>
      </FlatBlock>
    </section>
  );
}
