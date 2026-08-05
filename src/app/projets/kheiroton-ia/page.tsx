import type { Metadata } from "next";
import { ProjectHero } from "@/components/sections/project-hero";
import { PointSection } from "@/app/projets/kheiroton-ia/_components/sections/point.section";
import { SituationTacheSection } from "@/app/projets/kheiroton-ia/_components/sections/situation-tache.section";
import { BalanceSection } from "@/app/projets/kheiroton-ia/_components/sections/balance.section";
import { AmplificationSection } from "@/app/projets/kheiroton-ia/_components/sections/amplification.section";
import { BasculeSection } from "@/app/projets/kheiroton-ia/_components/sections/bascule.section";
import { ReconstructionSection } from "@/app/projets/kheiroton-ia/_components/sections/reconstruction.section";
import {
  ChangementsSection,
  CHANGEMENTS,
} from "@/app/projets/kheiroton-ia/_components/sections/changements.section";

const QUESTION = "L'IA peut-elle éclairer sans désinformer ?";

export const metadata: Metadata = {
  title: "Kheiroton-IA",
  description:
    "L'IA peut-elle éclairer sans désinformer ? Trois jours de hackathon : la balance entre produire et réfuter, une plateforme neutre pour comparer les programmes politiques, et la topologie qu'il faudrait pour que cinq experts fassent un consensus plutôt qu'une moyenne.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <ProjectHero
        tone="cream"
        blockClassName="px-6 pt-20 pb-16 md:pt-28 md:pb-20"
        title="Kheiroton-IA"
        titleClassName="text-[clamp(1.875rem,10vw,6rem)] leading-[0.9] font-bold tracking-tighter whitespace-nowrap"
        lead={QUESTION}
        leadClassName="mt-8 max-w-2xl text-lg leading-relaxed md:text-xl"
      />
      <SituationTacheSection />
      <BalanceSection />
      <AmplificationSection />
      <BasculeSection />
      <ReconstructionSection />
      <ChangementsSection />

      <PointSection
        tone="petrol"
        index={2}
        slug={CHANGEMENTS.execution.slug}
        statement={CHANGEMENTS.execution.statement}
        body={CHANGEMENTS.execution.body}
        className="border-b border-border"
      />

      <PointSection
        tone="ink"
        index={3}
        slug={CHANGEMENTS.entree.slug}
        statement={CHANGEMENTS.entree.statement}
        body={CHANGEMENTS.entree.body}
        className="border-b border-border"
      />
    </main>
  );
}
