import type { Metadata } from "next";
import { FlowField, Frame } from "@/components/system";
import { HeroSection } from "@/app/projets/undrive/_components/sections/hero.section";
import { DescentSection } from "@/app/projets/undrive/_components/sections/stratum.section";
import { ClosingSection } from "@/app/projets/undrive/_components/sections/closing.section";

export const metadata: Metadata = {
  title: "Undrive",
  description:
    "Comment transforme-t-on une idée en produit ? La descente entière, du cadrage jusqu'à la machine qui le fait tourner.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />

      {/* Graine dédiée (7) : le champ est déterministe, reprendre celle de
          l'accueil produirait la même texture à deux endroits. */}
      <Frame className="h-24 border-y border-border bg-card md:h-32">
        <FlowField
          seed={7}
          palette="machine"
          spacing={7}
          scale={360}
          curl={1.05}
          intensity={0.9}
          maxSteps={800}
          fade="sides"
          interactive
          influence={100}
          strength={38}
        />
      </Frame>

      <DescentSection />
      <ClosingSection />
    </main>
  );
}
