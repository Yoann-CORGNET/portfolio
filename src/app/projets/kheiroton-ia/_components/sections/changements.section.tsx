import { Label } from "@/components/system";
import { ProjectSectionTitle } from "@/app/projets/_components/project-section-title";
import { AgentMesh } from "@/app/projets/kheiroton-ia/_components/agent-mesh";
import { cn } from "@/lib/utils";
import { COLUMN_TITLE, SUBHEAD } from "../typography";

export const CHANGEMENTS = {
  echanges: {
    slug: "les échanges",
    statement:
      "Cinq experts qui ne se parlent pas ne font pas un consensus : ils font une moyenne.",
    body: "À une condition, et c'est elle qu'on lit dans les axes du panneau de droite : que le débat reste anonyme entre les experts aussi. Un agent pèse un avis autant selon qui l'a émis que selon ce qu'il vaut, et un mesh qui afficherait les rôles reproduirait, entre les juges, exactement le biais qu'on corrige à l'entrée.",
  },
  execution: {
    slug: "l'exécution",
    statement: "Une procédure qu'on relance à la main n'est pas un système : c'est un souvenir.",
    body: "Aujourd'hui, ça tourne depuis une session Claude Code qui suit la procédure et orchestre les agents un par un. On en ferait une pipeline structurée et déployable, pas pour l'élégance : un résultat qu'on ne peut pas rejouer à l'identique n'est vérifiable par personne, et une plateforme qui prétend arbitrer des programmes politiques doit pouvoir être auditée sur autre chose que ma parole.",
  },
  entree: {
    slug: "l'entrée",
    statement: "Le jugement doit porter sur le contenu, pas sur la couleur.",
    body: "Un modèle ne juge pas la même mesure de la même façon selon l'étiquette politique qui l'accompagne : le biais est documenté, et il se corrige en amont plutôt que dans le prompt. C'est le changement le moins coûteux des trois (un champ qu'on masque), et probablement celui qui déplacerait le plus de choses.",
  },
} as const;

function PointNumber({ index, slug }: Readonly<{ index: number; slug: string }>) {
  return (
    <div className="md:col-span-3">
      <p className="text-5xl leading-none font-bold tracking-tighter tabular-nums">
        {String(index).padStart(2, "0")}
      </p>
      <Label className="mt-3 block">{slug}</Label>
    </div>
  );
}

export function ChangementsSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <ProjectSectionTitle lines={["Ce qu'on", "changerait"]} className={COLUMN_TITLE} />

        <div className="mt-20">
          <div className="grid gap-6 md:grid-cols-12 md:gap-16">
            <PointNumber index={1} slug={CHANGEMENTS.echanges.slug} />
            <p className={cn(SUBHEAD, "md:col-span-9")}>{CHANGEMENTS.echanges.statement}</p>
          </div>
          <AgentMesh className="mt-14" />
          <p className="mt-12 max-w-2xl leading-relaxed">{CHANGEMENTS.echanges.body}</p>
        </div>
      </div>
    </section>
  );
}
