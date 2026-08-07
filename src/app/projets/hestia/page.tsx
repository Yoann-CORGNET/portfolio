import type { Metadata } from "next";
import { FlowField, Frame } from "@/components/system";
import { ProjectHero } from "@/components/sections/project-hero";
import { ProjectHinge } from "@/components/sections/project-hinge";
import { ActSection } from "./_components/sections/act.section";
import { ContextSection } from "./_components/sections/context.section";
import { LedgerSection } from "./_components/sections/ledger.section";
import { ClosingSection } from "./_components/sections/closing.section";
import { PortsFigure } from "./_components/figures";
import { ACT_ONE, ACT_TWO, HERO, TRANSITIONS } from "./_components/content";

export const metadata: Metadata = {
  title: "Hestia",
  description:
    "Un SaaS en production où l'architecture évolue avec le métier, plutôt que contre lui. Deux erreurs d'architecture sur un moteur de réservation : une que personne n'a prise, une qui est la mienne.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      {/* Rust, comme la tuile d'accueil qui mène ici : la surface sur laquelle
          on arrive est celle qu'on a cliquée. Crème sur rust donne 5,43 de
          contraste, donc l'accroche reste à pleine opacité — la descendre la
          ferait passer sous le seuil.

          Le nom porte le niveau un, l'accroche le suit : c'est la forme des
          autres pages projet, où le titre nomme et la ligne d'après affirme.
          Rien en dessous : le cadrage est le travail de `ContextSection`, et
          un chapô ici raconterait les trois étages avant eux.

          La hauteur vient d'un plancher en vh, pas d'un rembourrage plus épais,
          et le contenu est centré dedans. Le rembourrage doit rester symétrique
          tant qu'il l'est : il ne sert qu'à garantir une gouttière quand le bloc
          tombe à sa hauteur minimale, et l'y déséquilibrer décalerait le centre
          de la moitié de l'écart. Le `flex` porte sur le bloc lui-même, dont
          `FlatBlock` fait l'unique élément de flux — la trame en points est
          absolue et n'y participe pas. */}
      <ProjectHero
        tone="rust"
        dots
        blockClassName="flex min-h-[60vh] flex-col justify-center px-6 py-24 md:min-h-[72vh] md:py-32"
        title={HERO.name}
        titleClassName="text-[clamp(3rem,11vw,7.5rem)] leading-[0.85] font-bold tracking-tighter"
        lead={HERO.thesis}
        leadClassName="mt-10 max-w-3xl font-heading text-[clamp(1.5rem,4vw,2.5rem)] leading-[1.02] font-bold tracking-tighter"
      />

      {/* Le décor avant la bande générative, pas après : la thèse nomme, le
          cadrage situe, et le champ devient le rideau qui ouvre les actes au
          lieu d'une respiration posée au milieu de l'exposition. */}
      <ContextSection />

      {/* Graine dédiée (13) : le champ est déterministe, en reprendre une déjà
          posée ailleurs sur le site produirait deux fois la même texture. */}
      <Frame className="h-24 bg-card md:h-32">
        <FlowField
          seed={13}
          palette="machine"
          spacing={7}
          scale={320}
          curl={1.15}
          intensity={0.9}
          maxSteps={800}
          fade="sides"
          interactive
          influence={100}
          strength={38}
        />
      </Frame>

      {/* Les deux actes n'annoncent pas leur rang de la même façon : filigrane
          pour le premier, chiffre en clair à côté du titre pour le second. Les
          deux traitements sont posés sur la page pour se juger à l'œil. */}
      <ActSection act={ACT_ONE} figure={<PortsFigure />} mark="watermark" />

      {/* Graines dédiées (17 et 23), pour la même raison que celle de la bande :
          deux charnières qui partageraient une graine porteraient deux fois la
          même texture. */}
      <ProjectHinge lines={TRANSITIONS.oneToTwo} seed={17} />

      {/* Sans figure : celles de l'Acte II sont passées dans son développement,
          chacune sous la section qu'elle illustre. */}
      <ActSection act={ACT_TWO} mark="beside" />
      <ProjectHinge lines={TRANSITIONS.twoToThree} seed={23} />

      <LedgerSection />
      <ClosingSection />
    </main>
  );
}
