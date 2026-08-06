import type { Metadata } from "next";
import { ProjectHero } from "@/components/sections/project-hero";
import { HeritageSection } from "./_components/sections/heritage.section";
import { StackSection } from "./_components/sections/stack.section";
import { SponsorLoopSection } from "./_components/sections/sponsor-loop.section";
import { AuthFailureSection } from "./_components/sections/auth-failure.section";
import { HandoffSection } from "./_components/sections/handoff.section";

export const metadata: Metadata = {
  title: "StockElec",
  description:
    "Comment apprend-on à faire du logiciel ? Un projet hérité en deuxième année : une stack découverte dedans, un commanditaire à écouter, une authentification échouée, une équipe suivante à préparer.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <ProjectHero
        tone="ink"
        section={false}
        blockClassName="px-6 pb-20 pt-20 md:pb-28 md:pt-28"
        title="StockElec"
        titleClassName="text-[clamp(2.5rem,9vw,6rem)] font-bold leading-[0.9] tracking-tighter"
        lead="Comment apprend-on à faire du logiciel ?"
        leadClassName="mt-8 max-w-2xl text-lg leading-relaxed"
        leadStyle={{ opacity: 0.82 }}
      />
      <HeritageSection />
      <StackSection />
      <SponsorLoopSection />
      <AuthFailureSection />
      <HandoffSection />
    </main>
  );
}
