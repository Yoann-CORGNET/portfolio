import { Label } from "@/components/system";
import { ProjectSectionTitle } from "@/app/projets/_components/project-section-title";
import { cn } from "@/lib/utils";
import { COLUMN_TITLE } from "../typography";

const CADRAGE = [
  {
    title: ["Un hackathon", "de trois jours"],
    body: [
      "Hackathon de trois jours à l'ESIEA, sur les enjeux du numérique responsable, de l'IA et de ses impacts métiers. Une liste de sujets imposée, une équipe, trois jours pour en creuser un.",
    ],
  },
  {
    title: ["La veille", "stratégique"],
    body: [
      "Sur la liste des sujets proposés, on a retenu la Civic Tech : IA et démocratie, posée par l'ESIEA comme un choix entre deux issues, outil d'éclairage du citoyen ou machine à désinformation et à polarisation.",
      "La tâche restait classique : une veille stratégique sur ce sujet, sourcée, à rendre en équipe avant la fin du premier jour.",
    ],
  },
] as const;

const BRIEF: readonly Readonly<{ term: string; value: string; accent?: boolean }>[] = [
  { term: "cadre", value: "Hackathon ESIEA (numérique responsable, IA et impacts métiers)" },
  { term: "durée", value: "Trois jours, en équipe" },
  { term: "sujet retenu", value: "Civic Tech : IA et démocratie" },
  { term: "attendu", value: "Une veille stratégique sourcée, avant la fin du premier jour" },
  { term: "rendu", value: "Une plateforme", accent: true },
] as const;

export function SituationTacheSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid gap-y-14 md:grid-cols-2 md:gap-x-16 md:gap-y-0">
          {CADRAGE.map((volet) => (
            <div key={volet.title[0]}>
              <ProjectSectionTitle lines={[...volet.title]} className={COLUMN_TITLE} />
              <div className="mt-8 space-y-6">
                {volet.body.map((paragraph) => (
                  <p key={paragraph} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <dl className="mt-16 border-t border-border">
          {BRIEF.map((entry) => (
            <div
              key={entry.term}
              className="grid gap-1 border-b border-border py-4 md:grid-cols-12 md:gap-8"
            >
              <dt className="md:col-span-3">
                <Label tone={entry.accent ? "accent" : "muted"}>{entry.term}</Label>
              </dt>
              <dd
                className={cn(
                  "leading-relaxed md:col-span-9",
                  entry.accent && "font-bold tracking-tight",
                )}
              >
                {entry.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
