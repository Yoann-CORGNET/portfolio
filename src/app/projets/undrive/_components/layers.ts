import type { FlatToken } from "@/lib/design/tokens";

export type Layer = {
  index: string;
  title: string;
  body: string;
  forces: string;
  tone: FlatToken | null;
  /**
   * `FlatBlock` gives a dark ink to `steel` and a cream ink to the other
   * three tones, so the same opacity value doesn't read the same on both
   * sides of that switch — these are tuned per layer, not one constant.
   */
  mark: number;
};

export const LAYERS: readonly Layer[] = [
  {
    index: "01",
    title: "L'idée",
    body: "Encourager les transports en commun : l'idée tient en une phrase, et une phrase n'est pas un produit. Personne ne change de mode de transport parce qu'un écran le lui demande. Avant la première ligne de code, il a fallu décider ce qui déclenche le geste, et ce que le produit renonce à faire. Cadrer coûte plus cher que coder, et évite d'écrire ce dont personne n'a besoin.",
    forces: "pensée produit",
    tone: null,
    mark: 0.16,
  },
  {
    index: "02",
    title: "Construire un MVP",
    body: "Un MVP est la plus petite version qui tienne debout d'un bout à l'autre : un trajet proposé, une carte qui se lit d'un coup d'œil. Tout le reste attend. Ce qu'on décide d'afficher commande ce que le serveur doit savoir répondre, et en combien de temps. Un écran de plus coûte du travail plus bas dans la pile, et ce travail se chiffre après la maquette.",
    forces: "couper avant d'ajouter",
    tone: "steel",
    mark: 0.2,
  },
  {
    index: "03",
    title: "Les décisions produit",
    body: "Cette première version debout, chaque ajout se discute. Personne n'était là pour trancher : pas de retours d'usage, pas de chiffres. Une équipe, un semestre, des envies qui ne tiennent pas toutes. Les décisions qui ont compté portaient sur ce que l'application ne fait pas, et ne demande jamais au voyageur. Chaque oui se paie plus bas, et on soupèse ce prix avant de le dire.",
    forces: "trancher sans données",
    tone: "petrol",
    mark: 0.3,
  },
  {
    index: "04",
    title: "La propriété full-stack",
    body: "Un oui rendu sur l'écran devient une règle dans l'API, puis une question posée à la base. Là, un trajet est une géométrie : des distances et des intersections. PostGIS les calcule parce que le trajet est la donnée. La frontière entre l'écran et la base se déplace à chaque décision prise plus haut. Tenir les deux côtés, c'est savoir où elle passe avant qu'elle ne coûte.",
    forces: "tenir les deux côtés",
    tone: "charcoal",
    mark: 0.32,
  },
  {
    index: "05",
    title: "L'infrastructure",
    body: "Le déploiement est en bas de la descente et contraint depuis le premier jour : une application mobile ne fonctionne pas tant qu'un serveur ne tourne pas ailleurs. Ça change ce qu'on écrit au-dessus : une configuration hors du code, un état hors de la machine. Production, préproduction, un aperçu par pull request : trois environnements décrits en Terraform, livrés en continu sur GCP.",
    forces: "concevoir pour être redéployé",
    tone: "ink",
    mark: 0.34,
  },
];

/** Distance dont le filet se décale d'une couche à la suivante ; alimente `--depth` dans `Stratum`. */
export const STEP_REM = 2;

export const HERO_STEP_REM = STEP_REM / 4;
