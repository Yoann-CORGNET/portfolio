import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Label, Rule } from "@/components/system";
import { FLAT } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

type Handoff = {
  /** Facultatif : une page dont la conclusion ferme déjà fort n'a rien à
   *  récapituler avant d'enchaîner, et un rappel plus plat qu'elle lui
   *  prendrait le dernier mot. */
  lead?: string;
  question: string;
  to: { slug: string; name: string };
};

const CHAIN: readonly { slug: string; handoff?: Handoff }[] = [
  {
    slug: "stockelec",
    handoff: {
      lead: "Ce chantier m'a appris comment un logiciel se fabrique, et comment il se transmet.",
      question: "Mais comment transforme-t-on une idée en produit entier ?",
      to: { slug: "undrive", name: "Undrive" },
    },
  },
  {
    slug: "undrive",
    handoff: {
      lead: "Le produit a été livré, de l'écran jusqu'à la machine qui le fait tourner.",
      question: "Mais comment fait-on évoluer un logiciel une fois qu'il est en production ?",
      to: { slug: "hestia", name: "Hestia" },
    },
  },
  {
    slug: "hestia",
    handoff: {
      question: "L'IA pourrait-elle repenser la façon même dont on construit du logiciel ?",
      to: { slug: "kheiroton-ia", name: "Kheiroton-IA" },
    },
  },
  { slug: "kheiroton-ia" },
];

// `Label tone="accent"` (vermillon) gives only 3.86 contrast against the page
// background — below the 4.5 required for 10px text. Rust is one step darker
// and reaches 5.77.
const ACCENT = { color: FLAT.rust };

export function ProjectTransition({ current }: Readonly<{ current: string }>) {
  const handoff = CHAIN.find((link) => link.slug === current)?.handoff;

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        {handoff && (
          <>
            {handoff.lead && (
              <p className="max-w-2xl leading-relaxed text-muted-foreground">{handoff.lead}</p>
            )}

            <p
              className={cn(
                "max-w-3xl text-[clamp(1.375rem,3.6vw,2.5rem)] font-bold leading-[1.05] tracking-tighter",
                handoff.lead && "mt-8",
              )}
            >
              {handoff.question}
            </p>

            <div className="mt-12">
              <Rule />
            </div>
          </>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-8">
          <Link
            href="/#travail"
            className="group inline-flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <ArrowLeft
              aria-hidden="true"
              className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-1"
            />
            <Label>mon travail</Label>
          </Link>

          {handoff && (
            <Link
              href={`/projets/${handoff.to.slug}`}
              className="group inline-flex flex-col gap-3 text-right transition-opacity hover:opacity-80"
            >
              <Label style={ACCENT}>lire la suite</Label>
              <span className="flex items-center gap-4 text-3xl font-bold tracking-tighter md:text-4xl">
                {handoff.to.name}
                <ArrowRight
                  aria-hidden="true"
                  className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
