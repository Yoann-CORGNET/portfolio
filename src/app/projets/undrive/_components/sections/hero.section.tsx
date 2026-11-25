import { FlatBlock, Label } from "@/components/system";
import { ProjectHeroMascot } from "@/components/sections/project-hero-mascot";

/**
 * Le header d'Undrive ne passe pas par `ProjectHero` (le label « chantier » et
 * le paragraphe de cadrage lui sont propres), mais il reçoit Prompt de la même
 * façon : par-dessus le bloc sur grand écran, sous le texte sinon.
 */
export function HeroSection() {
  return (
    <section className="relative">
      {/* Même hauteur que les headers de Hestia et Kheiroton-IA : un plancher en
          vh, le contenu centré dedans. */}
      <FlatBlock
        tone="petrol"
        className="flex min-h-[60vh] flex-col justify-center py-24 md:min-h-[72vh] md:py-32"
      >
        <div className="mx-auto max-w-6xl px-6">
          <Label tone="inherit" className="opacity-70">
            chantier
          </Label>
          <h1 className="mt-8 text-[clamp(3rem,11vw,7.5rem)] font-bold leading-[0.85] tracking-tighter">
            Undrive
          </h1>
          <p className="mt-10 max-w-xl font-heading text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-[1.02] tracking-tighter">
            Comment transforme-t-on une idée en produit ?
          </p>
          <p className="mt-8 max-w-xl leading-relaxed" style={{ opacity: 0.62 }}>
            Projet d&apos;école de quatrième année, mené en équipe. Aucun voyageur ne s&apos;en est
            jamais servi : ce qui se juge ici est la chaîne, pas son audience.
          </p>
          <ProjectHeroMascot scene="victoire-clin" placement="inline" />
        </div>
      </FlatBlock>
      <ProjectHeroMascot scene="victoire-clin" placement="layer" />
    </section>
  );
}
