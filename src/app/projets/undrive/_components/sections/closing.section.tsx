import { Reveal } from "@/components/system";
import { ProjectSectionTitle } from "@/app/projets/_components/project-section-title";
import { Lesson } from "./stratum.section";

const CLOSING = {
  body: "Cinq couches, et aucune des cinq n'a été tenue par une seule personne. Une chaîne tient quand personne, à aucun moment, ne considère le maillon suivant comme le problème de quelqu'un d'autre. La qualité de chaque maillon pris à part n'y suffit pas. Se mettre d'accord sur une frontière (entre deux écrans, entre deux services, entre deux personnes) est le même travail, répété à trois échelles.",
  claim:
    "Une fonctionnalité n'est plus finie pour moi quand elle marche sur ma machine. Elle est finie quand elle tient de l'écran jusqu'à l'endroit où elle tourne.",
};

export function ClosingSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          {/* Coupé à la main : la ligne la plus longue fait dix-sept
              caractères, et c'est cette borne qui fixe la taille du titre. */}
          <ProjectSectionTitle
            lines={["La couche qui", "n'en est pas une"]}
            className="text-[clamp(1.5rem,5vw,3.5rem)] font-bold leading-[0.95] tracking-tighter"
          />
        </Reveal>

        <div className="mt-12 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">{CLOSING.body}</p>
          </div>
          <div className="md:col-span-5">
            <Lesson>travail en équipe</Lesson>
          </div>
        </div>

        <p className="mt-20 max-w-3xl text-2xl leading-snug tracking-tight md:text-3xl">
          {CLOSING.claim}
        </p>
      </div>
    </section>
  );
}
