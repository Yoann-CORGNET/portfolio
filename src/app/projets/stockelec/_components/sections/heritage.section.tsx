import { FlatBlock, Label } from "@/components/system";
import { FLAT } from "@/lib/design/tokens";
import { inkLine } from "@/lib/project-page";
import { cn } from "@/lib/utils";

type ChainLink = {
  when: string;
  who: string;
  what: string;
  mine: boolean;
};

const CHAIN: readonly ChainLink[] = [
  {
    when: "avant moi",
    who: "l'équipe de l'année précédente",
    what: "Un projet laissé en l'état, mais documenté et expliqué de vive voix.",
    mine: false,
  },
  {
    when: "ma séquence",
    who: "deuxième année",
    what: "L'API refaite pour l'essentiel, le front construit, le projet documenté, la passation présentée.",
    mine: true,
  },
  {
    when: "après moi",
    who: "l'équipe suivante, puis des cinquième année",
    what: "Repris, puis refait correctement : déploiement, sécurité, authentification.",
    mine: false,
  },
];

export function HeritageSection() {
  return (
    <FlatBlock tone="ink">
      <section className="border-t" style={{ borderColor: inkLine }}>
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <h2 className="text-[clamp(1.5rem,6vw,4rem)] font-bold leading-[0.95] tracking-tighter">
            Le projet hérité
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed" style={{ opacity: 0.85 }}>
            Un logiciel d&apos;inventaire pour le laboratoire d&apos;électronique de l&apos;ESIEA,
            commencé par l&apos;équipe de l&apos;année précédente puis laissé en l&apos;état. Je ne
            l&apos;ai ni choisi ni cadré, et je ne l&apos;ai pas trouvé nu non plus : il y a eu une
            passation. Une documentation à lire, et quelqu&apos;un pour venir nous l&apos;expliquer.
            C&apos;est le premier code que j&apos;ai lu avant d&apos;en écrire.
          </p>
        </div>

        {/* Filets dans le flux plutôt qu'en calque absolu : `FlatBlock` enveloppe
            ses enfants dans un div positionné, un absolu se calerait sur la
            boîte de contenu et manquerait les marges du bloc. */}
        <div className="border-t" style={{ borderColor: inkLine }}>
          <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-3">
            {CHAIN.map((hand, i) => (
              <div
                key={hand.when}
                className={cn(
                  "relative px-6 py-8 md:py-10",
                  i > 0 && "border-t md:border-l md:border-t-0",
                  !hand.mine && "opacity-45 transition-opacity duration-300 hover:opacity-100",
                )}
                style={{ borderColor: inkLine }}
              >
                {hand.mine ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px"
                    style={{ background: FLAT.vermillon }}
                  />
                ) : null}
                <Label tone="inherit" className="opacity-70">
                  {hand.when}
                </Label>
                <p className="mt-5 text-lg leading-snug tracking-tight">{hand.who}</p>
                <p className="mt-3 leading-relaxed" style={{ opacity: 0.75 }}>
                  {hand.what}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FlatBlock>
  );
}
