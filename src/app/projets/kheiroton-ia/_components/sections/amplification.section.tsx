import { FlatBlock, Label, Stat, StatCell, Tooltip } from "@/components/system";
import { cn } from "@/lib/utils";
import { SUBHEAD } from "../typography";

const AMPLIFICATION = [
  {
    key: "vitesse",
    value: "×6",
    label: "la vitesse à laquelle une fausse information atteint 1 500 personnes, contre une vraie",
    source: "MIT, Twitter",
  },
  {
    key: "bots",
    value: "31 %",
    label: "de la désinformation en circulation portée par 6 % de comptes automatisés",
    source: "Indiana University",
  },
  {
    key: "sites",
    value: "3 700",
    label: "sites d'information produits par IA sans supervision éditoriale",
    source: "NewsGuard",
  },
  {
    key: "deepfakes",
    value: "8 M",
    label: "de deepfakes annoncés pour 2025, contre environ 500 000 partagés en 2023",
    source: "Europol",
  },
] as const;

/**
 * Un chiffre, sa légende, et sa provenance hors du texte.
 *
 * Quatre attributions entre parenthèses au bas de quatre légendes en capitales
 * de dix pixels, c'est un quart de la ligne payé par tout le monde pour une
 * information que presque personne ne lit. L'appel de note la garde à portée
 * sans la faire porter à la légende.
 *
 * Deux points de montage à ne pas intervertir :
 *
 *  — le `group` est sur la cellule intérieure, focusable et porteuse de
 *    `aria-describedby`, parce que `group-focus-visible` observe le groupe
 *    lui-même ; le `relative` est sur le `StatCell`, un cran plus haut, pour
 *    que la bulle se pose au-dessus de la cellule entière plutôt qu'au-dessus
 *    de son contenu, c'est-à-dire à l'intérieur de ses vingt-quatre pixels de
 *    marge ;
 *  — la bulle est sœur du `Stat`, jamais fille de sa légende : celle-ci est
 *    posée à 70 % d'opacité, et une opacité s'applique au sous-arbre entier —
 *    la bulle serait délavée avec.
 */
function SourcedFigure({ figure }: Readonly<{ figure: (typeof AMPLIFICATION)[number] }>) {
  const id = `amplification-${figure.key}`;
  return (
    <div tabIndex={0} aria-describedby={id} className="group h-full cursor-help">
      {/* Le montage de la glose d'Hestia, moins l'accent chaud : sur un aplat,
          c'est l'encre du bloc qui s'applique — la règle est écrite dans
          `accent.ts`, et l'acier descend la sienne.

          Le reste est de l'arithmétique. L'appel vit dans la boîte du chiffre,
          donc il hérite de ses quarante-huit pixels : à 0,65 em il en ferait
          trente et un, d'où un corps absolu. Et son exposant natif vaut une
          fraction du corps *du parent*, soit seize pixels ici, ce qui le
          laisserait flotter aux deux tiers de la hauteur des chiffres au lieu
          de se caler contre leur sommet comme sur Hestia. Les capitales
          occupant 0,73 de leur corps, il faut le lever de 0,73 × (48 − 12), soit
          26 px — d'où 1,65 rem, et `align-baseline` pour que le décalage natif
          ne s'y ajoute pas. */}
      <Stat
        value={figure.value}
        label={figure.label}
        className="h-full"
        mark={
          <sup className="relative -top-[1.65rem] ml-1 align-baseline text-xs font-bold tracking-normal">
            (i)
          </sup>
        }
      />
      {/* `group-focus` en plus du survol et du focus clavier : au doigt il n'y
          a ni l'un ni l'autre, et une source hors d'atteinte sur cette page-là
          serait un comble. */}
      <Tooltip id={id} className="w-full">
        <Label className="block">source</Label>
        <span className="mt-2 block text-xs leading-relaxed">{figure.source}</span>
      </Tooltip>
    </div>
  );
}

export function AmplificationSection() {
  return (
    <section className="border-b border-border">
      <FlatBlock tone="steel" className="px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className={cn(SUBHEAD, "max-w-2xl")}>
            Et l&apos;IA générative n&apos;a pas rééquilibré la balance : elle a rendu le côté léger
            presque gratuit.
          </p>
          <div className="mt-12 grid gap-px bg-current/20 sm:grid-cols-2 lg:grid-cols-4">
            {AMPLIFICATION.map((figure) => (
              <StatCell key={figure.key} tone="steel" className="relative">
                <SourcedFigure figure={figure} />
              </StatCell>
            ))}
          </div>
        </div>
      </FlatBlock>
    </section>
  );
}
