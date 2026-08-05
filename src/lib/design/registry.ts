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

export type Group = "primitive" | "data" | "control" | "motion" | "texture" | "figure" | "layout";

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
  figure: {
    label: "Figures",
    note: "Ce qui démontre au lieu d'énumérer. La géométrie est calculée, jamais approchée.",
  },
  layout: {
    label: "Structures",
    note: "Les conteneurs. Ils portent la structure et rien d'autre.",
  },
};

export const GROUP_ORDER: Group[] = [
  "primitive",
  "data",
  "control",
  "motion",
  "texture",
  "figure",
  "layout",
];

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
        name: "external",
        type: "boolean",
        fallback: "false",
        note: "Nouvel onglet, avec le rel qui va avec — un target posé à la main est un rel qu'on oublie. Ne dit rien à voix haute : la langue reste au point d'appel.",
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
        note: "« duo » est la marque. « craie » est la même sur un fond sombre, où les chevrons encre s'éteindraient. « encre » lui retire une couleur quand elle est composée dans du texte.",
      },
      {
        name: "label",
        type: "string",
        note: "À poser quand la marque est seule. Omis, le SVG est masqué aux lecteurs d'écran.",
      },
    ],
  },
  {
    id: "tooltip",
    name: "Tooltip",
    group: "primitive",
    file: "primitives.tsx",
    client: false,
    purpose:
      "Une bulle que son ancre révèle, au-dessus d'elle. En CSS seul, donc rendue par le serveur ; en échange elle ne se retourne pas quand elle sortirait de l'écran.",
    variants: ["au survol", "au clavier"],
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        note: "Contenu phrasé uniquement : la bulle est un span, pour tenir aussi dans du texte courant.",
      },
      {
        name: "id",
        fallback: "—",
        type: "string",
        note: "Cible du aria-describedby de l'ancre. Omis, la bulle reste purement visuelle.",
      },
      {
        name: "className",
        fallback: "—",
        type: "string",
        note: "Pour replacer la bulle quand elle sortirait du cadre, ou changer sa largeur.",
      },
    ],
  },
  {
    id: "watermark",
    name: "Watermark",
    group: "primitive",
    file: "primitives.tsx",
    client: false,
    purpose:
      "Un chiffre démesuré et presque effacé, derrière ce qu'il repère. Il remplace le surtitre : une section se situe à sa marque, pas à une ligne de dix pixels qui redit le titre juste en dessous.",
    variants: ["sur papier", "sur aplat"],
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        note: "La marque. Un rang le plus souvent, mais rien n'oblige à un chiffre.",
      },
      {
        name: "opacity",
        type: "number",
        note: "Requis, sans valeur par défaut : le sombre sur clair et le clair sur sombre ne s'effacent pas au même taux.",
      },
      {
        name: "className",
        type: "string",
        note: "Pour déplacer l'ancrage. Le parent doit porter overflow-hidden et être positionné.",
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
        name: "mark",
        type: "React.ReactNode",
        note: "Appel de note contre le chiffre. Dans sa boîte : à dimensionner en absolu, jamais en em.",
      },
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
        fallback: "0.4",
        note: "Part du rayon à poussée pleine avant l'amorti. Bas, la descente s'étale sur tout le rayon et le bord reste doux ; haut, elle se tasse en un anneau net et le champ se lit comme une loupe posée dessus.",
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
  /* ---------------------------------------------------------------- */
  /* Figures                                                          */
  /* ---------------------------------------------------------------- */
  {
    id: "overlap-cascade",
    name: "OverlapCascade",
    group: "figure",
    file: "overlap.tsx",
    client: false,
    purpose:
      "Trois ensembles en escalier sur la diagonale, et ce qu'ils ont en commun peint dessous. Un seul paramètre commande la figure : le côté se déduit du décalage pour que l'escalier remplisse toujours le cadre.",
    variants: ["décalage 15", "décalage 20", "décalage 22"],
    props: [
      {
        name: "shift",
        type: "number",
        fallback: "20",
        note: "Décalage entre deux carrés, en % du cadre. À 25 l'intersection disparaît.",
      },
      { name: "dotSize", type: "number", fallback: "11", note: "Pas de la trame, en pixels." },
      { name: "dotWeight", type: "number", fallback: "30", note: "Opacité de la trame, sur 100." },
      {
        name: "tone",
        type: "string",
        fallback: "vermillon",
        note: "Couleur de l'intersection — le seul aplat de la figure.",
      },
      {
        name: "labels",
        type: "[string, string, string]",
        note: "Les trois ensembles, nommés. Omis, la figure est muette.",
      },
    ],
  },
  {
    id: "overlap-triangle",
    name: "OverlapTriangle",
    group: "figure",
    file: "overlap.tsx",
    client: false,
    purpose:
      "Trois ensembles en triangle, chacun pivoté de l'angle exact qui met une de ses pointes dans l'axe du centre. L'intersection est un polygone quelconque, calculée par découpage successif plutôt qu'approchée par un carré.",
    variants: ["pointes au centre", "faces au centre", "désaxé"],
    props: [
      {
        name: "side",
        type: "number",
        fallback: "60",
        note: "Côté de chaque carré, en % du cadre.",
      },
      {
        name: "radius",
        type: "number",
        fallback: "25",
        note: "Écartement des trois centres. Trop grand, les pointes n'atteignent plus le centre.",
      },
      {
        name: "orientation",
        type: "number",
        fallback: "120",
        note: "Oriente le triangle entier, en degrés. 90 place un ensemble en haut.",
      },
      {
        name: "skew",
        type: "number",
        fallback: "45",
        note: "Écart à la règle « une pointe vers le centre ». 0 l'applique, 45 met les faces face au centre.",
      },
      { name: "dotSize", type: "number", fallback: "12", note: "Pas de la trame, en pixels." },
      { name: "dotWeight", type: "number", fallback: "20", note: "Opacité de la trame, sur 100." },
      {
        name: "tone",
        type: "string",
        fallback: "vermillon",
        note: "Couleur de l'intersection — le seul aplat de la figure.",
      },
      {
        name: "labels",
        type: "[string, string, string]",
        note: "Les trois ensembles, nommés. Omis, la figure est muette.",
      },
    ],
  },
  {
    id: "pipeline-flow",
    name: "PipelineFlow",
    group: "figure",
    file: "pipeline-flow.tsx",
    client: false,
    purpose:
      "Une suite d'étapes, chacune une nappe de cartes, reliées par des peignes qui montrent combien de cartes alimentent combien d'autres. Rien n'est figé — ni le nombre d'étapes, ni le nombre de cartes par étape, ni ce qu'une carte dit. Une étape choisit seulement comment ses cartes se révèlent au survol (« tip » ou « unfold ») et si chaque carte est une face ou deux côte à côte — c'est cette seconde forme qui laisse une étape réclamer deux numéros de nœud au lieu d'un.",
    variants: ["bureau — chronologie complète", "mobile — liste dépliée"],
    props: [
      {
        name: "steps",
        type: "readonly PipelineFlowStep[]",
        note: "La suite d'étapes du pipeline, dans l'ordre. Chaque étape porte ses propres intitulés, son style de survol et ses cartes.",
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
