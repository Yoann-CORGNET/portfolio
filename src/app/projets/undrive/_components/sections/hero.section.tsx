import { FlatBlock, Label } from "@/components/system";
import { LAYERS, HERO_STEP_REM } from "../layers";

export function HeroSection() {
  return (
    <FlatBlock tone="petrol" className="py-20 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-7">
          <Label tone="inherit" className="opacity-70">
            chantier
          </Label>
          <h1 className="mt-8 text-[clamp(3rem,11vw,7.5rem)] font-bold leading-[0.85] tracking-tighter">
            Undrive
          </h1>
          <p className="mt-10 max-w-xl text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-[1.02] tracking-tighter">
            Comment transforme-t-on une idée en produit ?
          </p>
          <p className="mt-8 max-w-xl leading-relaxed" style={{ opacity: 0.62 }}>
            Projet d&apos;école de quatrième année, mené en équipe. Aucun voyageur ne s&apos;en est
            jamais servi : ce qui se juge ici est la chaîne, pas son audience.
          </p>
        </div>

        <div className="md:col-span-5 md:pt-2">
          <Label tone="inherit" className="opacity-55">
            la coupe
          </Label>
          <ol className="mt-6 border-l border-current/30 pl-6">
            {LAYERS.map((layer, i) => (
              <li
                key={layer.index}
                className="flex items-baseline gap-4 py-2.5"
                // Décrochement calculé par ligne, donc inline : Tailwind ne
                // construit pas de classe dynamiquement à l'exécution.
                style={{ marginLeft: `${i * HERO_STEP_REM}rem` }}
              >
                <Label tone="inherit" numeric className="opacity-45">
                  {layer.index}
                </Label>
                <span className="text-lg tracking-tight" style={{ opacity: 0.8 }}>
                  {layer.title}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </FlatBlock>
  );
}
