/**
 * Prompt, la mascotte, décrite comme des données.
 *
 * Même partage que pour la marque (`brand.ts`) : ici les tracés et les
 * schémas de couleur, écrits en termes de tokens ; dans
 * `components/system/mascot.tsx`, seulement ce qui les transforme en SVG. Le
 * modèle 3D lit les mêmes visages, si bien qu'une expression retouchée ici
 * change à la fois l'illustration, l'emoji et le volume.
 *
 * Toutes les coordonnées ont l'origine au centre et l'axe y vers le haut,
 * comme dans le modèle 3D. Le composant retourne l'axe au rendu.
 */

import type { FlatToken } from "./tokens";

/* ------------------------------------------------------------------ */
/* Tracé                                                              */
/* ------------------------------------------------------------------ */

/**
 * Les tons d'un visage, par rôle plutôt que par couleur : un schéma « encre »
 * peut ainsi tout repeindre d'un seul ton sans réécrire un tracé.
 *
 * `eye` porte l'émotion, `mouth` est le curseur (le seul point chaud),
 * `tear` la seule entorse admise, `dim` un segment éteint.
 */
export type ShapeTone = "eye" | "soft" | "mouth" | "tear" | "dim";

export const SHAPE_TONES: Record<ShapeTone, FlatToken> = {
  eye: "cream",
  soft: "sand",
  mouth: "vermillon",
  tear: "steel",
  dim: "charcoal",
};

export type Shape =
  | { kind: "poly"; points: [number, number][]; tone: ShapeTone }
  | { kind: "bar"; x: number; y: number; w: number; h: number; rot: number; tone: ShapeTone };

type ChevronOptions = { length?: number; thickness?: number; angle?: number; tone?: ShapeTone };

/**
 * Un chevron « > » en un seul polygone, pointe à l'origine locale, tourné de
 * `rot` radians. Le contour est calculé plutôt que composé de deux barres pour
 * que la pointe reste nette à toutes les tailles.
 */
function chevron(
  x: number,
  y: number,
  rot = 0,
  { length = 44, thickness = 12, angle = 0.62, tone = "eye" }: ChevronOptions = {},
): Shape {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const h = thickness / 2;
  const tip = h / s;
  const local: [number, number][] = [
    [tip, 0],
    [-length * c + h * s, length * s + h * c],
    [-length * c - h * s, length * s - h * c],
    [-tip, 0],
    [-length * c - h * s, -length * s + h * c],
    [-length * c + h * s, -length * s - h * c],
  ];
  const cr = Math.cos(rot);
  const sr = Math.sin(rot);
  return {
    kind: "poly",
    points: local.map(([px, py]) => [x + px * cr - py * sr, y + px * sr + py * cr]),
    tone,
  };
}

function bar(x: number, y: number, w: number, h: number, tone: ShapeTone = "eye", rot = 0): Shape {
  return { kind: "bar", x, y, w, h, rot, tone };
}

function heart(x: number, y: number, k = 1.5): Shape {
  const outline: [number, number][] = [
    [-8, 4],
    [-4, 8],
    [0, 4],
    [4, 8],
    [8, 4],
    [8, 0],
    [0, -8],
    [-8, 0],
  ];
  return { kind: "poly", points: outline.map(([px, py]) => [x + px * k, y + py * k]), tone: "eye" };
}

/** Huit segments en couronne ; le premier, vermillon, est celui qui tourne. */
function spinner(radius: number, w: number, h: number): Shape[] {
  const tones: ShapeTone[] = ["mouth", "eye", "soft", "dim", "dim", "dim", "dim", "dim"];
  return tones.map((tone, i) => {
    const t = (i * Math.PI) / 4;
    return bar(Math.cos(t) * radius, Math.sin(t) * radius, w, h, tone, t);
  });
}

const UP = Math.PI / 2;

/* ------------------------------------------------------------------ */
/* Visage-écran                                                       */
/* ------------------------------------------------------------------ */

/** L'écran de la tête, en unités de tracé. Le modèle 3D s'y met à l'échelle. */
export const SCREEN = { w: 240, h: 155 } as const;

export type MascotFace = {
  label: string;
  /** Où l'expression sert. Une expression sans usage n'a pas sa place ici. */
  use: string;
  shapes: Shape[];
  /** L'écran lui-même s'assombrit, pour la veille. */
  screen: "ink" | "charcoal";
  /** Le visage entier tourne par crans de 45° au lieu de s'animer trait par trait. */
  spin?: boolean;
};

export const MASCOT_FACES = {
  neutre: {
    label: "neutre",
    use: "attente, état par défaut d'une interface",
    screen: "ink",
    shapes: [bar(-50, 18, 24, 24), bar(50, 18, 24, 24), bar(0, -45, 34, 10, "mouth")],
  },
  heureux: {
    label: "heureux",
    use: "avatar, succès, visage par défaut",
    screen: "ink",
    shapes: [chevron(-55, 22, UP), chevron(55, 22, UP), bar(0, -45, 50, 20, "mouth")],
  },
  amoureux: {
    label: "amoureux",
    use: "remerciement, favori",
    screen: "ink",
    shapes: [heart(-50, 18, 3.2), heart(50, 18, 3.2), bar(0, -48, 34, 18, "mouth")],
  },
  clin: {
    label: "clin d'œil",
    use: "publication légère, clin d'œil caché",
    screen: "ink",
    shapes: [chevron(-50, 15), bar(66, 15, 38, 12), bar(0, -45, 30, 36, "mouth")],
  },
  surpris: {
    label: "surpris",
    use: "nouveauté, annonce",
    screen: "ink",
    shapes: [bar(-50, 20, 32, 32), bar(50, 20, 32, 32), bar(0, -45, 26, 42, "mouth")],
  },
  concentre: {
    label: "concentré",
    use: "saisie en cours, écoute",
    screen: "ink",
    shapes: [chevron(-50, 15), chevron(50, 15, Math.PI), bar(0, -45, 30, 36, "mouth")],
  },
  perplexe: {
    label: "perplexe",
    use: "champ invalide, demande ambiguë",
    screen: "ink",
    shapes: [
      bar(-44, 38, 24, 24),
      bar(58, 38, 24, 24),
      bar(52, 64, 34, 9, "eye", 0.18),
      bar(38, -46, 28, 14, "mouth", 0.12),
    ],
  },
  colere: {
    label: "colère",
    use: "accès refusé, action interdite",
    screen: "ink",
    shapes: [
      bar(-48, 44, 46, 11, "eye", -0.45),
      bar(48, 44, 46, 11, "eye", 0.45),
      bar(-44, 14, 22, 22),
      bar(44, 14, 22, 22),
      bar(0, -50, 44, 12, "mouth"),
    ],
  },
  erreur: {
    label: "erreur",
    use: "erreur serveur, échec d'une action",
    screen: "ink",
    shapes: [
      bar(-50, 15, 46, 11, "eye", Math.PI / 4),
      bar(-50, 15, 46, 11, "eye", -Math.PI / 4),
      bar(50, 15, 46, 11, "eye", Math.PI / 4),
      bar(50, 15, 46, 11, "eye", -Math.PI / 4),
      bar(0, -50, 40, 12, "mouth"),
    ],
  },
  triste: {
    label: "triste",
    use: "page introuvable, état vide",
    screen: "ink",
    shapes: [
      bar(-50, 34, 40, 10, "eye", 0.38),
      bar(50, 34, 40, 10, "eye", -0.38),
      bar(-50, 10, 18, 18),
      bar(50, 10, 18, 18),
      bar(-50, -18, 14, 14, "tear", Math.PI / 4),
      bar(0, -54, 30, 10, "mouth"),
    ],
  },
  veille: {
    label: "veille",
    use: "hors ligne, maintenance",
    screen: "charcoal",
    shapes: [
      chevron(-50, 4, -UP, { length: 26, thickness: 10, angle: 1.12, tone: "soft" }),
      chevron(50, 4, -UP, { length: 26, thickness: 10, angle: 1.12, tone: "soft" }),
      bar(0, -44, 12, 12, "mouth"),
    ],
  },
  chargement: {
    label: "chargement",
    use: "traitement en cours",
    screen: "ink",
    spin: true,
    shapes: spinner(44, 30, 12),
  },
} as const satisfies Record<string, MascotFace>;

export type MascotFaceId = keyof typeof MASCOT_FACES;

export const MASCOT_FACE_IDS = Object.keys(MASCOT_FACES) as MascotFaceId[];

/* ------------------------------------------------------------------ */
/* Emojis                                                             */
/* ------------------------------------------------------------------ */

/**
 * Le visage seul, redessiné dans une tuile carrée de 100 unités. Un
 * redessin et non une réduction : à 20 px, les traits de l'écran deviennent
 * des taches, il faut les épaissir et les rapprocher.
 */
export type MascotEmojiSpec = {
  label: string;
  shapes: Shape[];
  /** Tuile assombrie, pour la veille. */
  dim?: boolean;
  spin?: boolean;
};

export const MASCOT_EMOJIS = {
  heureux: {
    label: "heureux",
    shapes: [
      chevron(-20, 14, UP, { length: 20, thickness: 8 }),
      chevron(20, 14, UP, { length: 20, thickness: 8 }),
      bar(0, -16, 16, 12, "mouth"),
    ],
  },
  rire: {
    label: "rire",
    shapes: [
      chevron(-20, 20, UP, { length: 20, thickness: 8 }),
      chevron(20, 20, UP, { length: 20, thickness: 8 }),
      bar(0, -14, 30, 18, "mouth"),
    ],
  },
  clin: {
    label: "clin d'œil",
    shapes: [
      chevron(-20, 14, UP, { length: 20, thickness: 8 }),
      bar(20, 6, 22, 8),
      bar(0, -16, 16, 12, "mouth"),
    ],
  },
  prompt: {
    label: "prompt",
    shapes: [chevron(-4, 8, 0, { length: 30, thickness: 10 }), bar(18, -14, 22, 8, "mouth")],
  },
  concentre: {
    label: "concentré",
    shapes: [
      chevron(-12, 8, 0, { length: 22, thickness: 8 }),
      chevron(12, 8, Math.PI, { length: 22, thickness: 8 }),
      bar(0, -20, 12, 14, "mouth"),
    ],
  },
  amoureux: {
    label: "amoureux",
    shapes: [heart(-18, 8), heart(18, 8), bar(0, -22, 16, 10, "mouth")],
  },
  cool: {
    label: "cool",
    shapes: [
      bar(0, 14, 66, 6),
      bar(-16, 6, 24, 14),
      bar(16, 6, 24, 14),
      bar(8, -20, 18, 8, "mouth", 0.15),
    ],
  },
  malicieux: {
    label: "malicieux",
    shapes: [
      bar(-18, 6, 20, 7),
      bar(18, 6, 20, 7),
      bar(-18, 18, 20, 5, "eye", -0.25),
      bar(18, 18, 20, 5, "eye", 0.25),
      bar(10, -18, 20, 7, "mouth", 0.25),
    ],
  },
  surpris: {
    label: "surpris",
    shapes: [bar(-18, 10, 16, 16), bar(18, 10, 16, 16), bar(0, -20, 12, 18, "mouth")],
  },
  perplexe: {
    label: "perplexe",
    shapes: [
      bar(-16, 12, 12, 12),
      bar(22, 12, 12, 12),
      bar(22, 27, 18, 6, "eye", 0.2),
      bar(8, -18, 16, 8, "mouth", 0.15),
    ],
  },
  triste: {
    label: "triste",
    shapes: [
      bar(-20, 22, 22, 6, "eye", 0.38),
      bar(20, 22, 22, 6, "eye", -0.38),
      bar(-20, 8, 10, 10),
      bar(20, 8, 10, 10),
      bar(-20, -8, 9, 9, "tear", Math.PI / 4),
      bar(0, -24, 16, 6, "mouth"),
    ],
  },
  pleure: {
    label: "pleure",
    shapes: [
      bar(-20, 10, 20, 6),
      bar(20, 10, 20, 6),
      bar(-20, -13, 7, 26, "tear"),
      bar(20, -13, 7, 26, "tear"),
      bar(0, -22, 14, 6, "mouth"),
    ],
  },
  colere: {
    label: "colère",
    shapes: [
      bar(-18, 22, 22, 6, "eye", -0.45),
      bar(18, 22, 22, 6, "eye", 0.45),
      bar(-16, 6, 10, 10),
      bar(16, 6, 10, 10),
      bar(0, -22, 22, 6, "mouth"),
    ],
  },
  erreur: {
    label: "erreur",
    shapes: [
      bar(-18, 8, 24, 7, "eye", Math.PI / 4),
      bar(-18, 8, 24, 7, "eye", -Math.PI / 4),
      bar(18, 8, 24, 7, "eye", Math.PI / 4),
      bar(18, 8, 24, 7, "eye", -Math.PI / 4),
      bar(0, -22, 22, 6, "mouth"),
    ],
  },
  veille: {
    label: "veille",
    dim: true,
    shapes: [
      chevron(-18, 2, -UP, { length: 14, thickness: 7, angle: 1.12, tone: "soft" }),
      chevron(18, 2, -UP, { length: 14, thickness: 7, angle: 1.12, tone: "soft" }),
      bar(0, -18, 8, 8, "mouth"),
    ],
  },
  chargement: {
    label: "chargement",
    spin: true,
    shapes: spinner(22, 14, 7),
  },
} as const satisfies Record<string, MascotEmojiSpec>;

export type MascotEmojiId = keyof typeof MASCOT_EMOJIS;

export const MASCOT_EMOJI_IDS = Object.keys(MASCOT_EMOJIS) as MascotEmojiId[];

/* ------------------------------------------------------------------ */
/* Symbole                                                            */
/* ------------------------------------------------------------------ */

/**
 * La tête de face, à plat, en unités de tracé : base de la tête à y = 0.
 * Les cotes sont celles du modèle 3D multipliées par mille.
 */
export const HEAD = {
  w: 300,
  h: 240,
  /** Hauteur du centre de l'écran. */
  screenY: 129.6,
  /** Écart vertical des deux attaches d'oreille, depuis le milieu de la tête. */
  earSpread: 45.6,
} as const;

/**
 * Comment la tête se colore. Chaque schéma dit sur quel fond il est écrit :
 * une tête crème sans contour disparaît sur du papier crème.
 *
 * `face: null` garde les tons propres à chaque trait ; un token force tout le
 * visage dans ce ton, vermillon compris.
 */
export type MascotHeadScheme = {
  label: string;
  note: string;
  ground: FlatToken;
  head: FlatToken | null;
  outline: FlatToken | null;
  stroke: number;
  rule: FlatToken | null;
  metal: FlatToken;
  tip: FlatToken;
  screen: FlatToken | null;
  face: FlatToken | null;
};

export const MASCOT_HEAD_SCHEMES = {
  couleur: {
    label: "couleur",
    note: "La tête telle qu'elle est. Un contour encre la détache du papier.",
    ground: "cream",
    head: "cream",
    outline: "ink",
    stroke: 6,
    rule: "sand",
    metal: "charcoal",
    tip: "petrol",
    screen: "ink",
    face: null,
  },
  "sur-encre": {
    label: "sur encre",
    note: "Sur fond sombre, la tête n'a plus besoin de contour ; le métal passe en acier pour rester visible.",
    ground: "ink",
    head: "cream",
    outline: null,
    stroke: 0,
    rule: "sand",
    metal: "steel",
    tip: "petrol",
    screen: "ink",
    face: null,
  },
  encre: {
    label: "encre · un ton",
    note: "Un seul ton, pour l'impression, la gravure ou un tampon. Le curseur perd sa couleur et garde sa place.",
    ground: "cream",
    head: "ink",
    outline: null,
    stroke: 0,
    rule: "ink",
    metal: "ink",
    tip: "ink",
    screen: "cream",
    face: "ink",
  },
  trait: {
    label: "trait",
    note: "Le contour seul, pour les fonds chargés ou les très grands formats.",
    ground: "cream",
    head: null,
    outline: "ink",
    stroke: 8,
    rule: null,
    metal: "ink",
    tip: "ink",
    screen: null,
    face: "ink",
  },
} as const satisfies Record<string, MascotHeadScheme>;

export type MascotHeadSchemeId = keyof typeof MASCOT_HEAD_SCHEMES;

export const MASCOT_HEAD_SCHEME_IDS = Object.keys(MASCOT_HEAD_SCHEMES) as MascotHeadSchemeId[];
