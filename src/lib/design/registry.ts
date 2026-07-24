/**
 * The library, described as data.
 *
 * Every component the system ships is listed here once, and the system page is
 * generated from this list rather than hand-written alongside it. That is the
 * whole point: a component added to the library but forgotten in the docs is
 * the normal failure mode of a design system, and it cannot happen if the docs
 * are a `.map()` over the registry.
 *
 * The inventory figures at the top of the page are counted from this file for
 * the same reason. A hand-typed "18 composants" is wrong the day after it is
 * written.
 *
 * What lives here is *metadata*. The live previews stay next to the page that
 * renders them, because a preview is JSX and JSX in a data file stops being
 * data.
 */

import { LOGO_SCHEME_IDS } from "./brand";

export type Group = "primitive" | "data" | "control" | "motion" | "texture" | "layout";

export type PropSpec = {
  name: string;
  type: string;
  /** Omitted when the prop is required. */
  fallback?: string;
  note: string;
};

export type ComponentSpec = {
  /** Anchor on the system page, and the key everything else joins on. */
  id: string;
  name: string;
  group: Group;
  /** Path under `src/components/system/`. */
  file: string;
  /** True when the component needs the browser — state, effects, measurement. */
  client: boolean;
  purpose: string;
  /** Named variants shown side by side on the page. */
  variants: string[];
  props: PropSpec[];
};

export const GROUPS: Record<Group, { label: string; note: string }> = {
  primitive: {
    label: "Primitives",
    note: "Les plus petites pièces. Aucun état, aucun effet : du rendu pur.",
  },
  data: {
    label: "Chiffres",
    note: "Ce qui porte les données. Chiffres tabulaires, deux tailles, rien entre les deux.",
  },
  control: {
    label: "Contrôles",
    note: "Ce qui répond au curseur. Un seul point chaud à la fois.",
  },
  motion: {
    label: "Mouvement",
    note: "Le mouvement sert à arriver, jamais à attirer l'œil en boucle.",
  },
  texture: {
    label: "Texture",
    note: "La moitié générative du système. Toujours minoritaire, toujours bornée.",
  },
  layout: {
    label: "Structures",
    note: "Les conteneurs. Ils portent la structure et rien d'autre.",
  },
};

export const GROUP_ORDER: Group[] = ["primitive", "data", "control", "motion", "texture", "layout"];

export const REGISTRY: ComponentSpec[] = [
  /* ---------------------------------------------------------------- */
  /* Primitives                                                       */
  /* ---------------------------------------------------------------- */
  {
    id: "label",
    name: "Label",
    group: "primitive",
    file: "primitives.tsx",
    client: false,
    purpose:
      "La seule petite typographie du système. Toute annotation passe par là : il n'existe volontairement pas de second petit palier.",
    variants: ["muted", "strong", "accent", "inherit", "numeric"],
    props: [
      {
        name: "tone",
        type: '"muted" | "strong" | "accent" | "inherit"',
        fallback: '"muted"',
        note: "Rôle. « inherit » pour tout ce qui est posé sur un aplat.",
      },
      {
        name: "numeric",
        type: "boolean",
        fallback: "false",
        note: "Chiffres tabulaires, pour ce qui change en place.",
      },
    ],
  },
  {
    id: "rule",
    name: "Rule",
    group: "primitive",
    file: "primitives.tsx",
    client: false,
    purpose:
      "Un filet d'un pixel. Dans ce système, séparer c'est tracer une ligne ou ne rien faire : jamais une ombre, jamais un contour arrondi.",
    variants: ["border", "accent"],
    props: [
      {
        name: "tone",
        type: '"border" | "accent"',
        fallback: '"border"',
        note: "Le filet chaud marque, il ne sépare pas.",
      },
    ],
  },
  {
    id: "tag",
    name: "Tag",
    group: "primitive",
    file: "primitives.tsx",
    client: false,
    purpose:
      "Une puce bordée. Ce qui serait devenu, ailleurs, une pastille colorée avec une ombre portée.",
    variants: ["outline", "petrol", "vermillon", "moss"],
    props: [
      { name: "tone", type: "FlatToken", note: "Remplit la puce. Omis, elle reste filaire." },
    ],
  },
  {
    id: "action",
    name: "Action",
    group: "primitive",
    file: "primitives.tsx",
    client: false,
    purpose:
      "L'action du système, lien ou bouton. Cinq rôles sous leurs noms conventionnels, aucun sixième : rien ici ne détruit, donc il n'y a pas de « danger ». C'est une touche mécanique : la face repose au-dessus d'un bloc décalé net (zéro flou — le corps de la touche, pas une ombre portée), le survol réchauffe la face sans la bouger, et l'appui fait glisser la touche sur son bloc jusqu'à l'absorber, en 75 ms. Le décalage franc est l'unique entorse assumée au « filet ou rien » du système, justifiée parce que c'est la seule pièce qu'on enfonce. « link » échappe au traitement : c'est un mot dans une phrase, il garde un filet chaud qui pousse au survol.",
    variants: ["primary", "secondary", "outline", "ghost", "link"],
    props: [
      {
        name: "href",
        type: "string",
        note: "Présent : rend un <a>. Absent : rend un vrai <button>.",
      },
      {
        name: "variant",
        type: '"primary" | "secondary" | "outline" | "ghost" | "link"',
        fallback: '"primary"',
        note: "« outline » et « ghost » empruntent la couleur de la surface, donc survivent à la bascule crème / encre.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        fallback: '"md"',
        note: "Trois paliers. « link » ignore le rembourrage, pas la taille de texte.",
      },
      {
        name: "disabled",
        type: "boolean",
        fallback: "false",
        note: "Sur un bouton, l'attribut natif. Sur un lien, le href est retiré : il n'y a plus rien à suivre.",
      },
      {
        name: "loading",
        type: "boolean",
        fallback: "false",
        note: "aria-busy, le libellé ne bouge pas, un curseur clignote au bord. Ne pâlit pas.",
      },
      {
        name: "force",
        type: '"hover" | "active" | "focus"',
        note: "Épingle un état pour cette page. Rien sur le site ne doit le poser.",
      },
    ],
  },
  {
    id: "flat-block",
    name: "FlatBlock",
    group: "primitive",
    file: "primitives.tsx",
    client: false,
    purpose:
      "Un panneau d'aplat. La moitié plate du système, et le support par défaut de toute couleur.",
    variants: ["10 tons", "avec trame", "sans trame"],
    props: [
      { name: "tone", type: "FlatToken", note: "Fond. La couleur de texte suit automatiquement." },
      {
        name: "dots",
        type: "boolean",
        fallback: "false",
        note: "Superpose la trame de points.",
      },
    ],
  },
  {
    id: "logo",
    name: "Logo",
    group: "primitive",
    file: "logo.tsx",
    client: false,
    purpose:
      "La marque, recolorée depuis la palette. Le vert d'origine (#377138) est antérieur au système : il avait un équivalent presque exact dans « moss », mais la marque voisine toujours un prompt vermillon, et un second ton saturé sur cette ligne dispute l'accent au lieu de le céder. Les chevrons portent donc la structure, les lames portent l'accent. « encre » retire l'accent pour les cas où la marque est composée comme de la typo : c'est la même marque, pas une variante de repli.",
    variants: LOGO_SCHEME_IDS,
    props: [
      {
        name: "scheme",
        type: LOGO_SCHEME_IDS.map((id) => `"${id}"`).join(" | "),
        fallback: '"duo"',
        note: "« duo » est la marque. « encre » la retire d'une couleur quand elle est composée dans du texte.",
      },
      {
        name: "label",
        type: "string",
        note: "À poser quand la marque est seule. Omis, le SVG est masqué aux lecteurs d'écran.",
      },
    ],
  },
  {
    id: "bracketed",
    name: "Bracketed",
    group: "primitive",
    file: "primitives.tsx",
    client: false,
    purpose: "Des équerres d'angle au lieu d'une boîte fermée : cadrer sans enfermer.",
    variants: ["default"],
    props: [],
  },

  /* ---------------------------------------------------------------- */
  /* Chiffres                                                         */
  /* ---------------------------------------------------------------- */
  {
    id: "stat",
    name: "Stat",
    group: "data",
    file: "stats.tsx",
    client: false,
    purpose:
      "Un chiffre et sa légende. Un portfolio est surtout fait d'affirmations, et une affirmation chiffrée porte plus loin.",
    variants: ["default", "display", "avec unité", "avec delta"],
    props: [
      { name: "value", type: "string | number", note: "Le chiffre. Toujours tabulaire." },
      { name: "label", type: "string", note: "Légende, au palier label." },
      { name: "unit", type: "string", note: "Suffixe, au palier label lui aussi." },
      {
        name: "delta",
        type: "number",
        note: "Variation signée. Le seul endroit où une seconde couleur entre.",
      },
      {
        name: "size",
        type: '"default" | "display"',
        fallback: '"default"',
        note: "Deux tailles, rien entre les deux.",
      },
    ],
  },
  {
    id: "stat-grid",
    name: "StatGrid",
    group: "data",
    file: "stats.tsx",
    client: false,
    purpose:
      "Une rangée de chiffres séparés par des filets plutôt qu'enfermés dans des cartes. Un fond, un écart d'un pixel, et les cellules se tiennent à distance toutes seules.",
    variants: ["2 colonnes", "3 colonnes", "4 colonnes"],
    props: [
      { name: "columns", type: "2 | 3 | 4", fallback: "4", note: "Colonnes au-delà du mobile." },
    ],
  },
  {
    id: "meter",
    name: "Meter",
    group: "data",
    file: "stats.tsx",
    client: false,
    purpose:
      "Une proportion, dessinée en cellules discrètes. Compter des cases est une lecture plus honnête qu'estimer une longueur. Une barre en dégradé appartient à un autre système.",
    variants: ["vermillon", "petrol", "moss", "échelle libre"],
    props: [
      { name: "value", type: "number", note: "Cellules pleines. Borné dans 0…max." },
      { name: "max", type: "number", fallback: "10", note: "Nombre total de cellules." },
      { name: "tone", type: "FlatToken", fallback: '"vermillon"', note: "Couleur de remplissage." },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Contrôles                                                        */
  /* ---------------------------------------------------------------- */
  {
    id: "hover-index",
    name: "HoverIndex",
    group: "control",
    file: "controls.tsx",
    client: true,
    purpose:
      "Une liste où le survol fait glisser un filet chaud sous la ligne. L'accent n'existe que sous le curseur : une interface qui surligne trois choses à la fois ne surligne rien.",
    variants: ["repos", "ligne active"],
    props: [
      {
        name: "items",
        type: "{ name; meta; year }[]",
        note: "Le rang est numéroté automatiquement.",
      },
    ],
  },
  {
    id: "segmented",
    name: "Segmented",
    group: "control",
    file: "controls.tsx",
    client: true,
    purpose: "Bascule à segments. Aplats, un seul actif, aucune ombre.",
    variants: ["2 segments", "3 segments"],
    props: [
      { name: "options", type: "string[]", note: "Libellés." },
      { name: "panels", type: "ReactNode[]", note: "Un panneau par option, dans le même ordre." },
    ],
  },
  {
    id: "surface-switch",
    name: "SurfaceSwitch",
    group: "control",
    file: "controls.tsx",
    client: true,
    purpose:
      "Bascule crème / encre pour les aperçus de cette page. Le choix est mémorisé : c'est une préférence de lecture, pas un état de page.",
    variants: ["cream", "ink"],
    props: [],
  },

  /* ---------------------------------------------------------------- */
  /* Mouvement                                                        */
  /* ---------------------------------------------------------------- */
  {
    id: "reveal",
    name: "Reveal",
    group: "motion",
    file: "motion.tsx",
    client: true,
    purpose:
      "Fait arriver son contenu une fois, au premier passage à l'écran. Une seule fois : rejouer à chaque défilement transforme une arrivée en tic.",
    variants: ["sans délai", "en cascade"],
    props: [
      { name: "delay", type: "number", fallback: "0", note: "Décalage en ms, pour les cascades." },
    ],
  },
  {
    id: "stagger-heading",
    name: "StaggerHeading",
    group: "motion",
    file: "motion.tsx",
    client: true,
    purpose:
      "Découpe un titre en caractères pour les faire arriver l'un après l'autre. Purement décoratif, donc la chaîne entière reste dans un seul libellé accessible.",
    variants: ["35 ms", "80 ms"],
    props: [
      { name: "text", type: "string", note: "Sert aussi d'aria-label." },
      { name: "step", type: "number", fallback: "35", note: "Délai entre deux caractères, en ms." },
    ],
  },
  {
    id: "marquee",
    name: "Marquee",
    group: "motion",
    file: "motion.tsx",
    client: true,
    purpose:
      "La seule animation en boucle du système, et ce qui l'autorise est qu'elle tient dans un bandeau de quelques dizaines de pixels. En pause au survol, absente si le mouvement est réduit.",
    variants: ["ink", "petrol", "lent"],
    props: [
      { name: "items", type: "string[]", note: "Dupliqués une fois pour une boucle sans couture." },
      { name: "tone", type: "string", fallback: "FLAT.ink", note: "Fond du bandeau." },
      { name: "duration", type: "number", fallback: "38", note: "Secondes par passage." },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Texture                                                          */
  /* ---------------------------------------------------------------- */
  {
    id: "flow-field",
    name: "FlowField",
    group: "texture",
    file: "flow-field.tsx",
    client: true,
    purpose:
      "Des lignes de courant régulièrement espacées sur un champ de bruit. Pas un champ de particules : une courbe répétée à intervalle constant, ce qui tient la densité égale d'un bord à l'autre.",
    variants: ["statique", "fondu", "réactif", "réticule"],
    props: [
      {
        name: "seed",
        type: "number",
        fallback: "1",
        note: "Même graine, même champ. Un redimensionnement ne rebat pas les cartes.",
      },
      {
        name: "spacing",
        type: "number",
        fallback: "7",
        note: "Distance tenue entre deux courbes voisines, en px.",
      },
      {
        name: "scale",
        type: "number",
        fallback: "360",
        note: "Longueur d'onde du bruit. Plus grand = bandes plus calmes.",
      },
      {
        name: "curl",
        type: "number",
        fallback: "1.05",
        note: "Amplitude angulaire, en demi-tours.",
      },
      {
        name: "fade",
        type: "FlowFieldFade",
        fallback: '"none"',
        note: "Fondu des bords : edges, bottom, radial, sides.",
      },
      {
        name: "interactive",
        type: "boolean",
        fallback: "false",
        note: "Le curseur écarte les courbes.",
      },
      {
        name: "influence",
        type: "number",
        fallback: "170",
        note: "Rayon d'influence du curseur, en px.",
      },
      { name: "strength", type: "number", fallback: "26", note: "Déplacement maximal, en px." },
      {
        name: "plateau",
        type: "number",
        fallback: "0.5",
        note: "Part du rayon à poussée pleine avant l'amorti. Aplatit la cloche en disque.",
      },
      {
        name: "cursor",
        type: "boolean",
        fallback: "true",
        note: "Remplace le curseur système par un réticule au rayon réel.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Structures                                                       */
  /* ---------------------------------------------------------------- */
  {
    id: "frame",
    name: "Frame",
    group: "layout",
    file: "layout.tsx",
    client: false,
    purpose:
      "Une surface bornée pour la texture. Toute étude texturée a besoin des deux mêmes éléments imbriqués ; les réunir ici garantit qu'ils ne divergent jamais.",
    variants: ["carré", "bande", "disque"],
    props: [],
  },
  {
    id: "etude",
    name: "Etude",
    group: "layout",
    file: "layout.tsx",
    client: false,
    purpose:
      "Le cadre d'une composition, avec sa légende annotée en haut à droite plutôt qu'empilée en second bandeau pleine largeur.",
    variants: ["avec règle", "sans règle"],
    props: [
      { name: "index", type: "string", note: "Sert aussi d'ancre : #e07." },
      { name: "title", type: "string", note: "Nom de la composition." },
      { name: "rule", type: "string", note: "La règle que l'étude illustre." },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Inventory                                                          */
/* ------------------------------------------------------------------ */

/** Counted, never typed. See the note at the top of the file. */
export const INVENTORY = {
  components: REGISTRY.length,
  variants: REGISTRY.reduce((n, c) => n + c.variants.length, 0),
  props: REGISTRY.reduce((n, c) => n + c.props.length, 0),
  groups: GROUP_ORDER.length,
  client: REGISTRY.filter((c) => c.client).length,
  server: REGISTRY.filter((c) => !c.client).length,
};

export const byGroup = (group: Group) => REGISTRY.filter((c) => c.group === group);
