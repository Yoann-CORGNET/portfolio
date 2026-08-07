import { FlatBlock } from "@/components/system";
import { ProjectSectionTitle } from "@/app/projets/_components/project-section-title";
import { SECTION_TITLE } from "../typography";

type LoopStep = { beat: string; body: string };

const LOOP: readonly LoopStep[] = [
  {
    beat: "Il décrit.",
    body: "Un responsable de laboratoire d'électronique n'est pas un énoncé. Il ne remet pas de spécifications : il raconte son inventaire avec ses mots à lui, ses habitudes de travail en tête et rien de ce que cela implique dans un logiciel.",
  },
  {
    beat: "Je traduis.",
    body: "Des écrans, des champs, des règles. Chaque traduction est un pari sur ce qu'il voulait dire, et je ne sais pas encore lequel de ces paris est mauvais.",
  },
  {
    beat: "Il corrige.",
    body: "Réunion suivante, je montre. Ce qui est faux se voit tout de suite ; ce qui manque, encore plus vite.",
  },
];

export function SponsorLoopSection() {
  return (
    <section>
      <FlatBlock tone="sand">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <ProjectSectionTitle
            lines={["Travailler avec", "un commanditaire"]}
            className={SECTION_TITLE}
          />

          {/* 9rem de retrait : généreux plutôt que calculé au glyphe près,
              pour ne pas dépendre des métriques d'une police en particulier.
              La plus longue amorce ("Il corrige.", onze caractères) tient
              large dedans même en IBM Plex Sans, plus étroite en moyenne que
              JetBrains Mono à corps égal. */}
          <div className="mt-12 max-w-2xl space-y-8">
            {LOOP.map((step) => (
              <p key={step.beat} className="relative text-lg leading-relaxed sm:pl-36">
                <span className="font-bold sm:absolute sm:left-0 sm:top-0">{step.beat}</span>{" "}
                {step.body}
              </p>
            ))}
          </div>
        </div>
      </FlatBlock>
    </section>
  );
}
