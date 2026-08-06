import { ProjectSectionTitle } from "@/app/projets/_components/project-section-title";
import { cn } from "@/lib/utils";
import { COLUMN_TITLE, SUBHEAD } from "../typography";

export function BasculeSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <ProjectSectionTitle lines={["Construire,", "pas écrire"]} className={COLUMN_TITLE} />
        <h3 className={cn(SUBHEAD, "mt-10 max-w-2xl")}>
          Et si l&apos;IA servait à rééquilibrer la balance plutôt qu&apos;à l&apos;incliner
          davantage ?
        </h3>
        <p className="mt-10 max-w-2xl leading-relaxed">
          Alors on a décidé d&apos;aller plus loin : construire la version « éclairage » plutôt que
          d&apos;écrire dessus. Kheiroton-IA, l&apos;outil qu&apos;on aurait aimé avoir en période
          d&apos;élection : une plateforme neutre qui regroupe tous les partis et leurs programmes,
          avec des garde-fous pensés dès le départ pour rester factuelle et accessible à qui
          n&apos;a pas trois jours à passer sur dix programmes. Extraire une promesse d&apos;un
          texte de campagne est un travail d&apos;interprétation ; on l&apos;a confié à un modèle de
          langue.
        </p>
      </div>
    </section>
  );
}
