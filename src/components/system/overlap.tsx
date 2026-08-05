import { FLAT, dotScreen } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import { Label } from "./primitives";

/**
 * Figures de recouvrement — trois ensembles, et ce qu'ils ont en commun.
 *
 * Un diagramme d'ensembles sans un seul cercle : le rayon du système est zéro,
 * donc les ensembles sont des carrés et leurs frontières des filets. Ce qui est
 * peint, c'est l'intersection — pas les ensembles.
 *
 * Deux règles gouvernent les deux composants, et ce sont elles qui font la
 * figure plutôt que le choix des couleurs :
 *
 *  — **l'intersection est calculée, jamais approchée.** Avec des carrés
 *    pivotés, la zone commune est un polygone convexe quelconque — un triangle,
 *    un pentagone, un hexagone selon les réglages. La poser « à peu près » avec
 *    un carré, c'est accepter qu'elle déborde ou qu'elle flotte au premier
 *    paramètre modifié. Elle est ici obtenue par découpage successif
 *    (Sutherland–Hodgman), donc exacte par construction ;
 *  — **elle est peinte entre les trames et les filets.** Au-dessus des trames,
 *    parce qu'une couleur recouverte de points n'est plus une couleur ; sous
 *    les filets, pour que les frontières la traversent au lieu d'être
 *    recouvertes — c'est leur croisement que la figure démontre.
 *
 * Les deux figures ont une limite dure, et elle est différente pour chacune :
 * passé un certain écartement, les trois ensembles cessent de se recouper et il
 * n'y a plus rien à peindre. Le composant ne s'en cache pas — il rend alors les
 * ensembles seuls, sans aplat.
 */

/* ------------------------------------------------------------------ */
/* Géométrie                                                          */
/* ------------------------------------------------------------------ */

/* TODO: this block (`corners` through `intersectionPath`, ~90 lines) is pure
   math — no closures, no React, no dependency on anything below it in the
   file. It's a clean candidate to extract into its own `overlap-geometry.ts`
   if this file's size becomes a real problem, independently of `Figure` /
   `OverlapCascade` / `OverlapTriangle`, which stay together since `Figure` is
   private shared render plumbing between the two exported figures. Left
   un-done for now — flagging the seam rather than prescribing the extraction,
   since it's a one-file call either way. */

type Pt = Readonly<{ x: number; y: number }>;

/** Un ensemble : le centre de son carré, et son orientation. */
type Cell = Readonly<{ cx: number; cy: number; rot: number }>;

const RAD = Math.PI / 180;

/** Demi-diagonale d'un carré, en fraction de son côté. */
const HALF_DIAGONAL = Math.SQRT2 / 2;

/**
 * Les quatre sommets d'un carré tourné, dans le repère de la figure — 0 à 100
 * sur les deux axes, y vers le bas comme à l'écran.
 *
 * L'ordre est horaire, et il n'est pas indifférent : c'est lui qui fixe le
 * signe du test d'intériorité du découpage. L'inverser retournerait la notion
 * de « dedans » et viderait toutes les intersections.
 */
function corners(cell: Cell, side: number): Pt[] {
  const h = side / 2;
  const cos = Math.cos(cell.rot * RAD);
  const sin = Math.sin(cell.rot * RAD);
  return [
    { x: -h, y: -h },
    { x: h, y: -h },
    { x: h, y: h },
    { x: -h, y: h },
  ].map((p) => ({ x: cell.cx + p.x * cos - p.y * sin, y: cell.cy + p.x * sin + p.y * cos }));
}

/** Point d'intersection des droites (p1 p2) et (a b). */
function lineCross(p1: Pt, p2: Pt, a: Pt, b: Pt): Pt {
  const a1 = p2.y - p1.y;
  const b1 = p1.x - p2.x;
  const c1 = a1 * p1.x + b1 * p1.y;
  const a2 = b.y - a.y;
  const b2 = a.x - b.x;
  const c2 = a2 * a.x + b2 * a.y;
  const det = a1 * b2 - a2 * b1;
  if (det === 0) return p2;
  return { x: (b2 * c1 - b1 * c2) / det, y: (a1 * c2 - a2 * c1) / det };
}

/**
 * Découpage de Sutherland–Hodgman : rogne un polygone par un convexe.
 *
 * Les carrés étant convexes, leur intersection l'est aussi, et l'algorithme
 * s'applique donc en chaîne sur les trois. Moins de trois sommets en sortie
 * signifie qu'il n'y a plus de zone commune.
 */
function clipPolygon(subject: readonly Pt[], clipper: readonly Pt[]): Pt[] {
  let output: Pt[] = [...subject];

  for (let i = 0; i < clipper.length; i++) {
    if (output.length === 0) break;
    const a = clipper[i];
    const b = clipper[(i + 1) % clipper.length];
    const inside = (p: Pt) => (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x) >= 0;

    const input = output;
    output = [];
    for (let j = 0; j < input.length; j++) {
      const cur = input[j];
      const prev = input[(j + input.length - 1) % input.length];
      if (inside(cur)) {
        if (!inside(prev)) output.push(lineCross(prev, cur, a, b));
        output.push(cur);
      } else if (inside(prev)) {
        output.push(lineCross(prev, cur, a, b));
      }
    }
  }

  return output;
}

/** La zone commune aux trois carrés, en `clip-path`, ou rien s'il n'y en a pas. */
function intersectionPath(cells: readonly Cell[], side: number): string | undefined {
  const polygons = cells.map((cell) => corners(cell, side));
  const zone = polygons.slice(1).reduce((acc, clipper) => clipPolygon(acc, clipper), polygons[0]);
  if (zone.length < 3) return undefined;
  const points = zone.map((p) => `${p.x.toFixed(3)}% ${p.y.toFixed(3)}%`).join(", ");
  return `polygon(${points})`;
}

/* ------------------------------------------------------------------ */
/* Rendu commun                                                       */
/* ------------------------------------------------------------------ */

type FigureProps = Readonly<{
  cells: readonly Cell[];
  side: number;
  dotSize: number;
  dotWeight: number;
  tone: string;
  className?: string;
  children?: React.ReactNode;
}>;

/**
 * Le rendu partagé, en trois passes, et l'ordre est tout le sujet.
 *
 * Les trames d'abord, l'intersection ensuite, les filets en dernier. Chaque
 * position se justifie :
 *
 *  — **la couleur passe au-dessus des trames.** Recouverte de points, elle
 *    n'est plus une couleur mais un gris teinté, et le seul point chaud de la
 *    figure se dilue au moment précis où on le regarde ;
 *  — **elle reste sous les filets.** Par-dessus, l'aplat masquerait le
 *    croisement des frontières, c'est-à-dire ce que la figure démontre.
 *
 * C'est pour tenir ces deux règles à la fois que trame et filet sont dessinés
 * en deux passes séparées plutôt que sur un même élément : l'aplat doit
 * s'intercaler entre les deux.
 *
 * `children` reçoit la couche d'étiquettes, que chaque figure place à sa façon
 * — dedans quand les carrés sont droits, dehors quand ils sont pivotés.
 */
function Figure({ cells, side, dotSize, dotWeight, tone, className, children }: FigureProps) {
  const path = intersectionPath(cells, side);

  /* Filets et trame sont tirés de `currentColor`, jamais d'un ton figé : c'est
     ce qui laisse la figure lisible aussi bien sur le papier que sur un aplat
     encre, où une encre codée en dur disparaîtrait. Seule l'intersection garde
     une couleur absolue — c'est le point chaud. */
  const box = (cell: Cell): React.CSSProperties => ({
    left: `${cell.cx}%`,
    top: `${cell.cy}%`,
    width: `${side}%`,
    height: `${side}%`,
    transform: `translate(-50%, -50%) rotate(${cell.rot}deg)`,
  });

  /* La clé est le rang, pas la géométrie. Les trois ensembles sont un tuple de
     longueur fixe où le rang *est* l'identité — mais surtout, une clé dérivée du
     centre change à chaque frame dès que la figure est animée, et React démonte
     puis remonte les six blocs soixante fois par seconde. Le rendu s'en remet,
     les styles étant entièrement dérivés ; une transition CSS posée sur ces
     blocs, non — elle ne démarre jamais sur un nœud fraîchement monté. */

  return (
    <div className={cn("relative aspect-square w-full", className)}>
      {cells.map((cell, i) => (
        <div key={i} aria-hidden="true" className="absolute" style={box(cell)}>
          <div
            className="absolute inset-0"
            style={{ background: dotScreen("currentColor", dotSize, 1), opacity: dotWeight / 100 }}
          />
        </div>
      ))}

      {path ? (
        <div className="absolute inset-0" style={{ background: tone, clipPath: path }} />
      ) : null}

      {cells.map((cell, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="absolute border border-current/40"
          style={box(cell)}
        />
      ))}

      {children}
    </div>
  );
}

/** Trois noms, dans l'ordre des ensembles. */
export type OverlapLabels = readonly [string, string, string];

/* ------------------------------------------------------------------ */
/* OverlapCascade                                                     */
/* ------------------------------------------------------------------ */

/**
 * Trois carrés droits, en escalier sur la diagonale.
 *
 * Le côté n'est pas un réglage : il se déduit du décalage — `100 - 2d` — pour
 * que le troisième carré finisse pile au bord du cadre quel que soit `shift`.
 * Un seul paramètre commande donc toute la figure, et la zone commune vaut
 * `100 - 4d` : elle disparaît à `shift = 25`, ce qui borne le composant.
 */
export function OverlapCascade({
  shift = 20,
  dotSize = 11,
  dotWeight = 30,
  tone = FLAT.vermillon,
  labels,
  className,
}: Readonly<{
  /** Décalage entre deux carrés, en % du cadre. Au-delà de 25, plus d'intersection. */
  shift?: number;
  /** Pas de la trame de points, en pixels. */
  dotSize?: number;
  /** Opacité de la trame, de 0 à 100. */
  dotWeight?: number;
  /** Couleur de l'intersection. */
  tone?: string;
  /** Les trois ensembles, nommés. Omis, la figure est muette. */
  labels?: OverlapLabels;
  className?: string;
}>) {
  const side = 100 - 2 * shift;
  const cells: Cell[] = [0, 1, 2].map((i) => ({
    cx: i * shift + side / 2,
    cy: i * shift + side / 2,
    rot: 0,
  }));

  // Les carrés sont droits : l'étiquette tient à l'intérieur, calée dans le
  // coin le plus éloigné des deux autres ensembles. Chaque ancrage n'utilise
  // que les bords dont il a besoin, pour que le padding pousse vers le dedans.
  const anchors: React.CSSProperties[] = [
    { left: 0, top: 0 },
    { right: `${100 - (shift + side)}%`, top: `${shift}%` },
    { right: 0, bottom: 0 },
  ];

  return (
    <Figure
      cells={cells}
      side={side}
      dotSize={dotSize}
      dotWeight={dotWeight}
      tone={tone}
      className={className}
    >
      {labels
        ? labels.map((name, i) => (
            <div key={name} className="absolute p-4" style={anchors[i]}>
              <Label>{name}</Label>
            </div>
          ))
        : null}
    </Figure>
  );
}

/* ------------------------------------------------------------------ */
/* OverlapTriangle                                                    */
/* ------------------------------------------------------------------ */

/**
 * Trois carrés disposés en triangle autour du centre, chacun pivoté.
 *
 * L'orientation de chaque carré n'est pas choisie à l'œil : les coins d'un
 * carré tourné de ρ visent les directions ρ+45 modulo 90, il suffit donc
 * d'imposer `ρ = direction du centre − 45` pour qu'une pointe vise le centre.
 * `skew` écarte de cette règle — à 45, ce sont les faces qui regardent le
 * centre au lieu des pointes, et la figure change complètement de caractère.
 *
 * Deux quantités décident si la figure tient, et elles tirent en sens inverse :
 *
 *  — `0.707 × side − radius` doit rester positif, sinon les pointes
 *    n'atteignent pas le centre et il n'y a aucune intersection ;
 *  — `radius + 0.707 × side − 50` doit rester négatif pour que la figure ne
 *    sorte pas du cadre. Positif, elle déborde — ce qui est un parti pris
 *    recevable, mais qui doit être voulu.
 */
export function OverlapTriangle({
  side = 60,
  radius = 25,
  orientation = 120,
  skew = 45,
  dotSize = 12,
  dotWeight = 20,
  tone = FLAT.vermillon,
  labels,
  className,
}: Readonly<{
  /** Côté de chaque carré, en % du cadre. */
  side?: number;
  /** Écartement des trois centres depuis le centre du cadre, en %. */
  radius?: number;
  /** Oriente le triangle entier, en degrés. 90 place un ensemble en haut. */
  orientation?: number;
  /** Écart à la règle « une pointe vers le centre ». 0 l'applique, 45 l'inverse. */
  skew?: number;
  /** Pas de la trame de points, en pixels. */
  dotSize?: number;
  /** Opacité de la trame, de 0 à 100. */
  dotWeight?: number;
  /** Couleur de l'intersection. */
  tone?: string;
  /** Les trois ensembles, nommés. Omis, la figure est muette. */
  labels?: OverlapLabels;
  className?: string;
}>) {
  const placed = [0, 1, 2].map((i) => {
    const theta = (orientation + i * 120) * RAD;
    const cx = 50 + radius * Math.cos(theta);
    const cy = 50 - radius * Math.sin(theta);
    const toCenter = Math.atan2(50 - cy, 50 - cx) / RAD;
    const rot = ((((toCenter - 45) % 90) + 90) % 90) + skew;
    // L'étiquette est poussée vers l'extérieur, au-delà de la pointe la plus
    // lointaine, puis ramenée dans le cadre.
    const out = HALF_DIAGONAL * side + 5;
    return {
      cell: { cx, cy, rot },
      label: {
        x: Math.min(94, Math.max(6, cx + out * Math.cos(theta))),
        y: Math.min(94, Math.max(6, cy - out * Math.sin(theta))),
      },
    };
  });

  return (
    <Figure
      cells={placed.map((p) => p.cell)}
      side={side}
      dotSize={dotSize}
      dotWeight={dotWeight}
      tone={tone}
      className={className}
    >
      {/* Les étiquettes vivent hors des carrés : dans un repère tourné, elles
          pencheraient avec lui. */}
      {labels
        ? labels.map((name, i) => (
            <div
              key={name}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${placed[i].label.x}%`, top: `${placed[i].label.y}%` }}
            >
              <Label>{name}</Label>
            </div>
          ))
        : null}
    </Figure>
  );
}
