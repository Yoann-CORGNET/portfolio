/**
 * Le décor, entre la thèse et le premier acte.
 *
 * Il tient volontairement dans un registre plus bas que les actes : pas de
 * rang, pas de filigrane, pas de titre à leur corps. Ce qu'il pose se lit
 * avant de se raconter, et lui donner la même voix qu'un acte en ferait un
 * quatrième, là où le récit en compte trois.
 *
 * Il n'a pas non plus d'étiquette. Le seul bloc de la page qui en garde une est
 * le temps explicatif des actes — « la réponse », « l'exemple » —, parce qu'il
 * répond à quelque chose et qu'il faut dire à quoi. Celui-ci ne répond à rien :
 * une étiquette ne ferait qu'annoncer qu'on va situer, juste avant de situer.
 *
 * La grille cinq / sept est celle des temps explicatifs des actes — une
 * affirmation courte tenue à gauche, ce qui la déplie à droite. C'est la
 * grammaire que la page utilise déjà pour expliquer, et la reprendre ici évite
 * d'en inventer une pour une seule section.
 */

import { Reveal } from "@/components/system";
import { CONTEXT } from "../content";

export function ContextSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <Reveal>
          <div className="grid gap-8 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <p className="text-xl leading-snug font-bold tracking-tight md:text-2xl">
                {CONTEXT.statement}
              </p>
            </div>

            {/* Décalé d'un cran vers le bas : l'affirmation de gauche part
                d'une capitale au corps supérieur, la première ligne de droite
                se cale dessus plutôt que sur le haut de sa propre boîte. */}
            <div className="space-y-6 md:col-span-7 md:pt-1.5">
              {CONTEXT.body.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
