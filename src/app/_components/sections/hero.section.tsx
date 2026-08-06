import { Action, Frame, FlowField } from "@/components/system";
import { TYPE } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

/** Réglage de texture partagé par les instances de `FlowField` de la page. */
export const BASE = {
  palette: "machine",
  spacing: 7,
  scale: 360,
  curl: 1.05,
  lineWidth: 1,
} as const;

/**
 * Le `text-[…]` est retiré du palier `display` plutôt que surchargé : dans
 * tailwind-merge une font-size chasse le `leading-*` qui la précède (seule la
 * forme `text-base/7` porte les deux), donc laissé en place il ferait
 * disparaître le `leading-[0.82]` du palier sans rien dire.
 */
const DISPLAY_NO_SIZE = (TYPE.find((step) => step.name === "display")?.className ?? "").replace(
  /\btext-\[[^\]]*\]/g,
  "",
);

const HERO_LINES = ["TRANSFORMER", "DES IDÉES", "EN LOGICIELS", "FIABLES."] as const;

export function HeroSection() {
  return (
    <section id="hero" className="relative border-b border-border">
      <div className="grid min-h-[92vh] grid-cols-1 md:grid-cols-3">
        {/* La gouttière mobile est en `vw` : la taille du titre et le débord
            du point suspendu sont tous deux proportionnels à la largeur
            d'écran, une gouttière fixe finirait donc par être franchie. À
            8vw de gouttière contre 6,9vw de débord, le point tombe dans la
            marge à n'importe quelle largeur. */}
        <div className="flex flex-col items-end justify-center px-[8vw] pb-8 pt-28 text-right md:col-span-2 md:px-16 md:pb-16 md:pt-36">
          {/* Gras et interlignage viennent du palier `display` ; taille et
              crénage sont réglés ici. L'ordre des classes compte : les
              tailles avant le palier, pour que tailwind-merge ne fasse pas
              chasser son `leading-[0.82]` par une font-size ; le crénage
              après, pour l'emporter sur son `tracking-tighter`. */}
          <h1
            className={cn(
              // La taille mobile est déduite, pas choisie à l'œil : la plus
              // longue ligne fait douze caractères, et JetBrains Mono chasse
              // 0,6em par glyphe moins 0,08em de crénage — soit 6,24em de
              // large. Pour remplir les 84vw laissés par les deux gouttières
              // il faut donc 84 / 6,24 = 13,46vw ; arrondi à 13,2 pour garder
              // un cheveu de jeu, `whitespace-nowrap` interdisant le retour à
              // la ligne.
              // `length:` lève l'ambiguïté de `text-[…]`, qui désigne aussi
              // bien une couleur qu'un corps.
              "whitespace-nowrap text-[length:13.2vw] md:text-[clamp(2rem,6vw,7rem)]",
              DISPLAY_NO_SIZE,
              "tracking-[-0.08em]",
            )}
          >
            {HERO_LINES.map((line) => (
              <span
                key={line}
                className={cn(
                  "block",
                  // Ponctuation suspendue : le point sort de la colonne pour
                  // que les lettres s'alignent à droite. Une chasse
                  // exactement — 0,6em d'avance du glyphe moins 0,08em de
                  // crénage — donc le S de FIABLES vient se poser où
                  // finissent le R et le S des lignes au-dessus.
                  // `hanging-punctuation: allow-end` ferait la même chose,
                  // mais seul Safari l'implémente.
                  // Un décalage, pas une marge négative : la marge portait
                  // sur l'axe transversal d'un flex en `items-end`, où
                  // Firefox ne la suivait pas ; une transformation ne touche
                  // pas la mise en page et se comporte partout pareil.
                  line.endsWith(".") && "translate-x-[0.52em]",
                )}
              >
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-10 text-xl tracking-tight md:text-2xl">
            Yoann Corgnet · Tech Lead @ NerionSoft
          </p>
          <div className="mt-10 flex flex-wrap justify-end gap-4">
            <Action href="#demarche" size="lg">
              Ma philosophie ↓
            </Action>
            <Action href="#travail" variant="ghost" size="lg">
              Mon travail
            </Action>
          </div>
        </div>
        <Frame className="min-h-[40vh] border-t border-border bg-card md:border-l md:border-t-0">
          <FlowField
            {...BASE}
            seed={3}
            intensity={0.95}
            maxSteps={900}
            interactive
            cursor
            influence={110}
            strength={42}
          />
        </Frame>
      </div>
    </section>
  );
}
