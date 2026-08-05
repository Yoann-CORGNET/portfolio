import { FlatBlock } from "@/components/system";
import { ProjectSectionTitle } from "@/app/projets/_components/project-section-title";

export function AuthFailureSection() {
  return (
    <FlatBlock tone="ink">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
        <ProjectSectionTitle
          lines={["Apprendre par l'échec :", "l'authentification"]}
          className="text-[clamp(1.25rem,4.5vw,3rem)] font-bold leading-[0.95] tracking-tighter"
        />

        <p className="mt-10 max-w-2xl text-lg leading-relaxed" style={{ opacity: 0.85 }}>
          Le logiciel devait savoir qui l&apos;utilisait. Je ne l&apos;ai pas livrée. J&apos;y ai
          passé du temps, je n&apos;ai pas su la faire fonctionner, et j&apos;ai rendu le projet
          sans elle. Rien ne l&apos;avait dépriorisée : elle était au-dessus de ce que je savais
          faire à ce moment-là.
        </p>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed" style={{ opacity: 0.85 }}>
          J&apos;ai appris là à quel moment annoncer une limite : avant de m&apos;engager dessus, et
          plus après. Le projet est parti sans authentification.
        </p>
      </div>
    </FlatBlock>
  );
}
