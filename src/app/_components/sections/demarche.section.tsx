import { FlatBlock, FlowField, Label } from "@/components/system";
import { ConvergingOverlap } from "@/app/_components/converging-overlap";
import { FLAT } from "@/lib/design/tokens";
import { BASE } from "@/app/_components/sections/hero.section";

const ARCHITECTURE_CELLS = [
  "Frontières claires",
  "Décisions durables",
  "Arbitrages conscients",
  "Évolution progressive",
] as const;

const DX_STAGES = ["qualité continue", "automatisation", "CI/CD", "reproductibilité"] as const;

/**
 * L'étude 10 donne steel · moss · rust · charcoal ; charcoal est remplacé
 * par petrol ici parce que la grille est posée sur un aplat encre, où
 * charcoal ne se détache plus (0,08 d'écart de clarté).
 */
const CELL_TONES = ["steel", "moss", "rust", "petrol"] as const;

const cream = (opacity: number) => ({ color: FLAT.cream, opacity });

/** La hairline utilisable sur un aplat sombre, où `border-border` disparaît. */
const inkLine = `color-mix(in srgb, ${FLAT.cream} 20%, transparent)`;

export function DemarcheSection() {
  return (
    <div id="demarche">
      {/* Découpage en `clip` et non en `hidden` : `overflow: hidden` ferait
          de la section un conteneur de défilement, et le `sticky` du plateau
          se collerait alors à un cadre qui ne défile pas — c'est-à-dire ne se
          collerait à rien.
          La piste fait 280vh, le plateau un plein écran, et les 180 restants
          sont du défilement absorbé sans rien déplacer : c'est ce qui fixe la
          vitesse des carrés de l'autre côté du verrou (voir `LOCK` dans
          `ConvergingOverlap`) — une tenue plus courte les ferait sauter au
          moment de se toucher. */}
      <section
        id="p-01"
        data-scene
        className="overflow-clip border-b border-border md:motion-safe:h-[280vh]"
      >
        <div
          data-stage
          className="md:flex md:h-screen md:items-center md:motion-safe:sticky md:motion-safe:top-0"
        >
          <div className="mx-auto w-full max-w-6xl px-6 py-32 md:py-0">
            <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
              <div className="md:col-span-5">
                <span
                  aria-hidden="true"
                  className="block select-none text-[clamp(6rem,15vw,11rem)] font-bold leading-[0.75] tracking-tighter"
                  style={{ color: "transparent", WebkitTextStroke: `2px ${FLAT.vermillon}` }}
                >
                  01
                </span>
                <h2 className="mt-8 text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[0.95] tracking-tighter">
                  Comprendre le problème
                </h2>
                <p className="mt-8 max-w-md text-lg leading-relaxed">
                  Une bonne solution commence par une bonne compréhension du besoin : je construis
                  des produits utiles en reliant les contraintes utilisateurs, métier et techniques.
                </p>
              </div>

              <div className="md:col-span-7">
                <div className="mx-auto w-full max-w-[26rem]">
                  <ConvergingOverlap labels={["utilisateurs", "métier", "technique"]} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* `overflow-clip` plutôt que `hidden` : `FlatBlock` pose déjà un
          `overflow-hidden` pour découper le chiffre en filigrane, et
          `overflow: hidden` ferait de lui un conteneur de défilement — la
          grille `sticky` à l'intérieur se collerait alors à un cadre qui ne
          défile pas. */}
      <section id="p-02" className="border-b border-border">
        <FlatBlock tone="ink" className="relative overflow-clip py-32 md:pb-0 md:pt-48">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none text-[clamp(14rem,34vw,28rem)] font-bold leading-none tracking-tighter"
            style={{ color: FLAT.charcoal }}
          >
            02
          </span>
          <div className="relative mx-auto max-w-6xl px-6">
            <h2 className="whitespace-nowrap text-[clamp(1.375rem,7vw,4rem)] font-bold leading-[0.92] tracking-tighter">
              Concevoir pour évoluer
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed" style={cream(0.8)}>
              Un logiciel fiable doit pouvoir changer. Je conçois des systèmes avec des frontières
              claires et des choix techniques capables d&apos;accompagner leur évolution.
            </p>

            {/* La grille seule se fige, au centre de la fenêtre — d'où le
                décalage : une demi hauteur de fenêtre moins la demi-hauteur
                du bloc. 03 la recouvre ensuite en remontant dans la course
                laissée dessous.
                Trois nombres liés, qui changent au point de rupture parce
                que la grille change de forme (quatre colonnes de 21,5rem au-
                dessus de `md`, deux de 39rem en dessous) : le décalage (demi-
                hauteur du bloc), la course (voir plus bas) et le retrait de
                03 (course moins gouttière). La marge de sécurité — le
                défilement qui reste bloqué une fois les tuiles cachées —
                vaut course moins grille moins gouttière : 104px en desktop,
                144 en mobile ; elle ne dépend pas de la hauteur d'écran. Le
                `max()` sur le décalage colle le bloc en haut sous 40rem de
                fenêtre, où il ne tient plus centré. */}
            <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 motion-safe:sticky motion-safe:top-[max(1rem,calc(50vh-19.5rem))] md:motion-safe:top-[calc(50vh-10.75rem)]">
              {ARCHITECTURE_CELLS.map((tag, i) => (
                <FlatBlock
                  key={tag}
                  tone={CELL_TONES[i]}
                  dots={i % 2 === 0}
                  className="flex h-56 flex-col justify-between p-6"
                  style={{ marginTop: `${i * 2.5}rem` }}
                >
                  <Label numeric style={{ color: "inherit", opacity: 0.7 }}>
                    {`0${i + 1}`}
                  </Label>
                  <p className="mt-6 text-lg leading-snug tracking-tight">{tag}</p>
                </FlatBlock>
              ))}
            </div>

            {/* La course du verrou : une boîte `sticky` est confinée au
                *contenu* de son parent, un `padding-bottom` ne l'allonge donc
                pas d'un pixel. Ce vide n'est jamais vu — 03 le recouvre
                entièrement — mais sa hauteur doit rester au-dessus du
                retrait qu'elle s'applique (28rem desktop, 56 mobile) ; elle
                en fait 741 et 954. */}
            <div aria-hidden="true" className="h-[56rem] md:h-[40rem]" />
          </div>
        </FlatBlock>
      </section>

      {/* Le `-mt` et le `z-10` sont l'autre moitié du verrou de 02 : 03
          remonte dans la course laissée sous la grille et se peint par
          dessus. Le retrait vaut la course moins la gouttière voulue entre
          la grille et 03 au repos, de sorte que sans verrou (téléphone,
          animations coupées) la page garde son allure normale. Le `z-10`
          n'est pas décoratif : deux éléments positionnés sans `z-index` se
          peignent dans l'ordre du document, et le premier `z-index` posé
          dans 02 le retournerait sans prévenir. */}
      <section
        id="p-03"
        className="relative z-10 -mt-[56rem] overflow-hidden border-b border-border md:-mt-[28rem]"
      >
        <FlatBlock tone="petrol" className="py-32 md:py-48">
          <div className="mx-auto max-w-6xl px-6 md:pl-40">
            <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
              <span
                aria-hidden="true"
                className="select-none text-[clamp(5rem,13vw,10rem)] font-bold leading-[0.72] tracking-tighter"
              >
                03
              </span>
              <h2 className="text-[clamp(1.125rem,6vw,2rem)] font-bold leading-[0.95] tracking-tighter md:text-[clamp(1.25rem,4.2vw,3rem)]">
                {["Créer un environnement", "où construire est fluide"].map((line) => (
                  <span key={line} className="block whitespace-nowrap">
                    {line}
                  </span>
                ))}
              </h2>
            </div>
            <p className="mt-10 max-w-2xl text-lg leading-relaxed" style={cream(0.82)}>
              La qualité d&apos;un logiciel dépend aussi de la qualité de son processus de
              développement. J&apos;automatise et simplifie les workflows pour permettre aux équipes
              de livrer rapidement et sereinement.
            </p>

            {/* `-mx-6` annule exactement le `px-6` du conteneur pour que la
                bande, en petit écran, aille d'un bord à l'autre de l'écran
                plutôt que de rester dans la colonne de lecture. */}
            <div
              className="relative -mx-6 mt-12 h-28 overflow-hidden border-y md:hidden"
              style={{ borderColor: inkLine }}
            >
              <FlowField
                {...BASE}
                seed={21}
                intensity={0.85}
                maxSteps={700}
                fade="edges"
                interactive
                influence={100}
                strength={36}
              />
            </div>

            <ol className="mt-12 flex flex-col items-start gap-3 md:flex-row md:flex-wrap md:items-center md:gap-x-5 md:gap-y-4">
              {DX_STAGES.map((tag, i) => (
                <li key={tag} className="flex items-center gap-3 md:gap-5">
                  <span aria-hidden="true" className="w-4 shrink-0 md:hidden" style={cream(0.4)}>
                    {i > 0 ? "↓" : ""}
                  </span>
                  {i > 0 ? (
                    <span aria-hidden="true" className="hidden md:inline" style={cream(0.4)}>
                      →
                    </span>
                  ) : null}
                  <span
                    className="border-b-2 pb-1 text-lg tracking-tight md:text-xl"
                    style={{ borderColor: FLAT.vermillon }}
                  >
                    {tag}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </FlatBlock>

        {/* La bande vit en dehors du `FlatBlock` : celui-ci enveloppe ses
            enfants dans un div positionné, donc un enfant absolu s'y cale et
            s'arrête avant les marges verticales — hors du bloc, il obtient
            toute la hauteur. Le calque reprend `mx-auto max-w-6xl px-6`, la
            mise en page de toutes les sections, pour que le bord gauche de
            la bande tombe sur la ligne où commence le texte partout
            ailleurs. */}
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          <div className="mx-auto flex h-full max-w-6xl px-6">
            <div
              className="pointer-events-auto relative w-16 overflow-hidden border-x md:w-24"
              style={{ borderColor: inkLine }}
            >
              <FlowField
                {...BASE}
                seed={21}
                intensity={0.85}
                maxSteps={700}
                interactive
                influence={100}
                strength={36}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
