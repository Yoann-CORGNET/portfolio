import { FlatBlock, Label, Reveal } from "@/components/system";
import { ProjectSectionTitle } from "@/app/projets/_components/project-section-title";
import { FLAT } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import { SECTION_TITLE } from "../typography";

type Row = { got: string; gave: string; stuck?: boolean };

const REGISTER: readonly Row[] = [
  {
    got: "Un projet commencé par d'autres, à reprendre sans l'avoir choisi.",
    gave: "Un projet repris, avancé, remis à une équipe que je n'ai pas choisie.",
  },
  {
    got: "Une API Spring que je n'avais pas écrite.",
    gave: "Une API refaite pour l'essentiel, une fois comprise.",
  },
  {
    got: "Un front dans un framework que je ne connaissais pas.",
    gave: "Un front construit en apprenant le framework dessus.",
  },
  {
    got: "Un responsable de labo qui attendait un outil de travail.",
    gave: "Un besoin traduit en écrans, réunion après réunion.",
  },
  {
    got: "Une documentation, et quelqu'un pour venir l'expliquer.",
    gave: "Une documentation reprise, et une passation présentée à mon tour.",
  },
  {
    got: "Un logiciel sans authentification.",
    gave: "Un logiciel toujours sans authentification.",
    stuck: true,
  },
];

export function HandoffSection() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-24 md:pb-24 md:pt-32">
        <Reveal>
          <ProjectSectionTitle
            lines={["Préparer", "l'équipe suivante"]}
            className={SECTION_TITLE}
          />

          <p className="mt-10 max-w-2xl text-lg leading-relaxed">
            Je savais ce que valait une passation, puisque j&apos;en avais reçu une. Sans elle, la
            deuxième année serait passée à deviner ce que le dépôt voulait dire. J&apos;ai passé la
            fin de l&apos;année à rendre la pareille : la documentation reprise, puis une passation
            présentée de vive voix à l&apos;équipe qui prenait la suite, sans savoir qui elle serait
            ni ce qu&apos;elle en ferait.
          </p>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed">
            Elle a repris le projet, et des cinquième année l&apos;ont refait correctement après
            elle. Ce que j&apos;avais laissé ouvert, d&apos;autres l&apos;ont fermé.
          </p>
        </Reveal>

        <ProjectSectionTitle
          as="h3"
          lines={["Ce que j'ai reçu,", "ce que j'ai rendu"]}
          className="mt-16 text-[clamp(1.25rem,3.5vw,2rem)] font-bold leading-[0.95] tracking-tighter"
        />

        <div className="mt-12 hidden md:grid md:grid-cols-2">
          <div className="pb-4">
            <Label>reçu</Label>
          </div>
          <div className="pb-4 md:pl-8">
            <Label>rendu</Label>
          </div>
        </div>

        <div className="mt-10 md:mt-0">
          {REGISTER.map((row, i) => {
            const last = i === REGISTER.length - 1;
            return (
              <div
                key={row.got}
                className={cn("border-t border-border md:grid md:grid-cols-2", last && "border-b")}
                style={row.stuck ? { borderColor: FLAT.vermillon } : undefined}
              >
                <p className="pt-5 leading-relaxed text-muted-foreground md:pb-5 md:pr-8 md:text-foreground">
                  {row.got}
                </p>
                <p className="flex gap-3 pb-5 pt-2 leading-relaxed md:block md:border-l md:border-border md:pl-8 md:pt-5">
                  <span aria-hidden="true" className="shrink-0 md:hidden">
                    ↳
                  </span>
                  <span>{row.gave}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <FlatBlock tone="ink">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <ProjectSectionTitle
            lines={["Un logiciel se conçoit", "pour être transmis"]}
            className="text-[clamp(1.375rem,5vw,3.5rem)] font-bold leading-[0.95] tracking-tighter"
          />
          <p className="mt-10 max-w-2xl text-lg leading-relaxed" style={{ opacity: 0.85 }}>
            Cinq lignes du registre ont bougé, une seule est restée la même. C&apos;est le bilan
            exact du chantier : ce que j&apos;ai construit sur StockElec a été refait par
            d&apos;autres, et ce qui a tenu, c&apos;est la façon de le rendre.
          </p>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed" style={{ opacity: 0.85 }}>
            On apprend à faire du logiciel dans le code de quelqu&apos;un d&apos;autre. On m&apos;a
            remis ce projet avec de quoi le comprendre, et j&apos;ai mesuré ce que ça
            m&apos;épargnait le jour où il a fallu le remettre à mon tour, à une équipe que je
            n&apos;ai pas choisie. Depuis j&apos;écris pour celui qui ouvrira le dépôt sans moi dans
            la pièce, et je compte la documentation et la passation dans le travail, pas après lui.
          </p>
        </div>
      </FlatBlock>
    </section>
  );
}
