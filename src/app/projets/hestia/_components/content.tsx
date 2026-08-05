/**
 * Le texte de la page, en un seul endroit.
 *
 * Le garder ici plutôt qu'au fil du JSX est ce qui rend une relecture suivie
 * possible, et ce qui évite qu'une apostrophe échappée devienne une réécriture.
 *
 * Quatre règles tiennent le texte et ne se voient pas dans le rendu :
 *
 *  — la construction « n'est pas X, c'est Y » n'apparaît qu'une fois, dans la
 *    conclusion. Toute ligne ajoutée doit éviter cette forme ;
 *  — aucune ligne forte ne repose sur une image. Ce qui les porte, c'est le
 *    constat ou l'aveu ;
 *  — les deux actes ne s'enchaînent pas. Le trop-plein de contextes ne vient
 *    pas du découpage de l'usine ; les deux se rejoignent sur la même question.
 *    Rien ne doit les relier par une cause, et rien n'a besoin de dire qu'ils
 *    sont distincts ;
 *  — rien d'interne à Hestia n'est nommé. L'exemple Catalogue / Stock est la
 *    seule illustration concrète, et il est volontairement pris ailleurs ;
 *  — toute filiation nommée doit se retrouver dans le texte de l'auteur cité,
 *    et toute citation entre guillemets dans l'ouvrage qu'on lui prête. Deux
 *    erreurs ont déjà été prises ici, l'une et l'autre venues de la mémoire :
 *    Cockburn refusant un port par contexte, alors qu'il laisse la granularité
 *    « largely a matter of taste » ; et « the work of a particular team » donné
 *    pour la définition du livre de 2003, alors qu'elle vient de la DDD
 *    Reference, dix ans plus tard. Une citation qu'on n'a pas relue dans sa
 *    source n'entre pas dans la page.
 *
 * Une dette connue : l'Acte II est le seul dont le prix n'est pas énoncé.
 */

import type { ReactNode } from "react";

import {
  CommunityMark,
  ContextsAfterFigure,
  ContextsBeforeFigure,
  VocabularyMark,
} from "./figures";
import { Gloss } from "./gloss";

/* ------------------------------------------------------------------ */
/* Hero                                                               */
/* ------------------------------------------------------------------ */

export const HERO = {
  /** Le nom du projet, à la taille d'affichage — comme sur les autres pages
   *  projet, et comme sur la tuile d'accueil qui mène ici. */
  name: "Hestia",
  /** La ligne d'accroche. Elle suit le nom au lieu de le remplacer : c'est le
   *  premier temps fort de la page, pas son identité. Elle reste au niveau du
   *  projet, jamais à celui d'un acte, sans quoi le premier passerait pour le
   *  sujet de la page et le second tomberait dehors.
   *
   *  Reprise mot pour mot de la tuile d'accueil, comme le rust de l'aplat : la
   *  surface sur laquelle on arrive est celle qu'on a cliquée, et la phrase
   *  qu'on relit est celle qui a décidé du clic. */
  thesis: "Un SaaS en production où l'architecture évolue avec le métier, plutôt que contre lui.",
} as const;

/* Rien sous la ligne d'accroche : la page va accroche, puis cadrage, puis les
   trois étages. Un chapô ici raconterait les étages avant eux. */

/* ------------------------------------------------------------------ */
/* Cadrage                                                            */
/* ------------------------------------------------------------------ */

/**
 * Le décor, et le seul endroit de la page qui dise le rôle.
 *
 * Il reste au niveau de la catégorie de produit, jamais de ce qu'on y livre :
 * dire *pourquoi* le logiciel change suffit à tenir les deux actes, dire
 * *ce qui* change décrirait le produit.
 */
export const CONTEXT = {
  statement: "Un moteur de réservation dans l'hôtellerie.",
  body: [
    "Un logiciel qui tourne chez de vrais clients continue de changer : le métier évolue plus vite que le code écrit pour le servir. Construire Hestia a donc surtout consisté à faire de la place au changement suivant.",
    "J'y suis tech lead. Les décisions d'architecture qui suivent sont les miennes, y compris celles qu'il a fallu défaire.",
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Actes I et II                                                      */
/* ------------------------------------------------------------------ */

/**
 * Les deux actes qui partagent une forme.
 *
 * Ils ont le même rythme en quatre temps — corps, signal, réponse, citation —
 * parce que c'est cette identité qui rend lisible la rupture du troisième
 * étage, qui n'en a aucun des quatre.
 *
 * Le signal et la citation se partagent le travail, sans quoi la seconde redit
 * le premier dix lignes plus bas : le signal énonce la panne, la citation donne
 * le critère qui tranche.
 *
 * Un signal est un fait de structure, vrai quoi que l'acte réponde ensuite. Y
 * énoncer une conséquence — ce que la structure interdit, ce qu'elle oblige à
 * défaire — la rend fausse au premier cas voisin, et une bande réfutable ne
 * défend plus rien. Les deux partagent cette grammaire, la structure en sujet
 * et sa conséquence en verbe, mais jamais un axe : écrits en miroir, ils
 * feraient des deux actes les deux faces d'un même problème. Ils se rendent
 * entre guillemets, et c'est le composant qui les pose.
 */
/**
 * Une section du développement théorique d'un acte.
 *
 * Le titre affirme, il n'annonce pas : lus seuls, à la file, les titres doivent
 * donner l'argument entier. C'est la condition qui rend un développement long
 * acceptable sur une page qu'on parcourt, et c'est elle qu'il faut vérifier
 * avant d'en ajouter une.
 */
export type PaperSection = Readonly<{
  key: string;
  heading: string;
  body: readonly ReactNode[];
  /** La figure qui illustre cette section-là, posée après elle. Une figure qui
   *  ouvre un argumentaire en donne la fin avant la démonstration. Absente
   *  d'une section en rangée double : celle-ci n'a pas la largeur d'en porter
   *  une, et l'autre section lui tient déjà lieu de vis-à-vis. */
  figure?: ReactNode;
}>;

/**
 * Une rangée du développement : une section seule, ou deux côte à côte.
 *
 * Une rangée simple garde l'alternance — texte d'un bord, figure de l'autre.
 * Une rangée double n'a ni figure ni alternance : les deux sections se
 * regardent, et c'est ce vis-à-vis qui les lie.
 *
 * L'alternance ne compte pas les rangées doubles. Elle reprend après elles du
 * bord où elle s'était arrêtée, sinon deux rangées simples séparées par une
 * double tomberaient du même côté et le balancement se casserait à cet
 * endroit-là précisément.
 */
export type PaperRow = readonly PaperSection[];

export type Act = Readonly<{
  key: string;
  /** Rendu en filigrane derrière le titre, et nulle part ailleurs : c'est le
   *  seul repère de rang de l'acte. */
  ordinal: string;
  /** Coupé à la main : chaque ligne est rendue sans césure possible. */
  title: readonly string[];
  body: ReactNode;
  signal: string;
  /** Facultatif : un acte dont l'exemple s'est fondu dans le développement n'a
   *  plus de bloc à part, et l'y laisser ferait lire deux fois la même chose. */
  middle?: Readonly<{ label: string; text: ReactNode }>;
  /** Le développement théorique, entre l'exemple et la citation. Facultatif :
   *  un acte dont la panne se démontre en quatre temps n'a rien à développer,
   *  et le lui imposer produirait du remplissage argumenté. */
  paper?: readonly PaperRow[];
  /** La citation qui ferme l'acte. Sans étiquette : une affirmation qui a
   *  besoin qu'on annonce qu'elle en est une n'en est pas une. */
  quote: string;
}>;

export const ACT_ONE: Act = {
  key: "interface",
  ordinal: "01",
  title: ["Quand une interface", "devient une usine"],
  /* La glose pose la prémisse que le signal vient trancher : si tout le métier
     passe par ce système, on comprend que tout ait fini sur la même interface.
     En appel de note plutôt qu'en parenthèse, pour que la phrase reste intacte
     et que seul qui a besoin de la définition aille la chercher. */
  body: (
    <>
      {"Une intégration "}
      <Gloss id="gloss-pms" term="PMS" marker="(i)">
        <span className="block text-xs leading-relaxed">
          {
            "Le système central de l'hôtel : chambres, tarifs, réservations et séjours y passent tous."
          }
        </span>
      </Gloss>
      {
        " commence petit : une poignée d'endpoints, un besoin clair. Elle grossit. De plus en plus de fonctionnalités viennent se greffer sur la même interface, jusqu'à ce qu'elle serve tous les callers, que leurs besoins se recoupent ou non."
      }
    </>
  ),
  signal: "Une interface partagée expose chaque caller aux besoins de tous les autres.",
  middle: {
    label: "la réponse",
    text: (
      <>
        {
          "Ports & adapters, mais un port par contexte au lieu d'un par système intégré. Chaque contexte décrit ce dont il a besoin, un adapter n'implémente que ça : l'Interface Segregation Principle appliqué au port. "
        }
        <Gloss id="gloss-cockburn" term="Cockburn" marker="(i)">
          <span className="block text-xs leading-relaxed">
            {
              "« Hexagonal Architecture », alistair.cockburn.us. Il y écrit que ce qu'un port est ou n'est pas « is largely a matter of taste », et qu'il préfère « a small number, two, three or four ports »."
            }
          </span>
        </Gloss>
        {
          " laisse la granularité au goût et penche pour deux à quatre ports. Un port porte d'ordinaire le nom du système en face ; ici il porte celui du besoin."
        }
      </>
    ),
  },
  quote:
    "Une interface décide lequel des deux côtés commande. Tant qu'elle sert tout le monde, c'est le caller le plus pressé qui commande.",
};

/**
 * Le développement théorique de l'Acte II.
 *
 * Il existe parce que la panne de cet acte n'est pas une maladresse d'exécution
 * mais un désaccord entre deux écoles, et qu'un désaccord ne se raconte pas en
 * quatre temps. Les deux positions sont tenues à leur meilleur : celle qu'on a
 * suivie sans la choisir garde ses raisons, sans quoi le pivot ne vaudrait rien.
 *
 * Les filiations sont nommées et vérifiables. Aucune ne sert d'autorité — elles
 * servent à situer un désaccord qui existait avant nous.
 *
 * La règle 4 de l'en-tête — rien d'interne à Hestia n'est nommé — est ici
 * annoncée plutôt que subie. Le cas est explicitement substitué, et la
 * substitution est dite en toutes lettres : le lecteur sait ce qu'il lit, les
 * noms empruntés portent la démonstration jusqu'au bout, et l'argument gagne
 * l'ancrage que l'anonymat lui refusait. Ce qui est emprunté, ce sont les noms.
 * Le coût, lui, est le nôtre, et la phrase de substitution doit continuer de le
 * dire — sans elle, tout le développement se lit comme une hypothèse d'école.
 *
 * Deux choses qu'une réécriture rendra spontanément à l'état lisse, et qui sont
 * délibérées :
 *
 *  — la longueur des phrases varie beaucoup, jusqu'à en laisser tomber de trois
 *    mots. Une suite de phrases du même moule est le tell le plus net d'un texte
 *    généré, et lisser celles-ci n'ajouterait rien qu'une régularité ;
 *  — le désaccord avec Evans est posé en question ouverte, jamais en réfutation.
 *    Il a traité l'arbitrage, il ne l'a pas tranché : c'est ce que la question
 *    demande, et le passer à l'affirmative reviendrait à lui prêter un tort
 *    qu'il n'a pas, pour un gain d'assurance qui ne convainc personne.
 *
 * L'audience étant experte, rien ne réexplique un terme qu'elle tient déjà. Les
 * paragraphes qui reposaient les bases du bounded context ont sauté à ce titre.
 */
const ACT_TWO_PAPER: readonly PaperRow[] = [
  [
    {
      key: "criteres",
      heading: "Deux critères qui ne tranchent pas dans le même sens",
      body: [
        "Deux façons de décider où passe une frontière. Elles ne répondent pas à la même question.",
        <>
          {
            "Evans, d'abord. La frontière est linguistique : deux sens d'un même mot appellent deux contextes. Le patron va au bout de sa logique et prévoit le raccordement, avec une "
          }
          <Gloss id="gloss-context-map" term="context map" marker="(i)">
            <span className="block text-xs leading-relaxed">
              {
                "Chez Evans, le relevé des contextes d'un système et de la nature du lien entre chaque paire. Il ne supprime aucune frontière, il rend son prix visible."
              }
            </span>
          </Gloss>
          {
            " qui recense les relations, et un patron nommé pour chacune : shared kernel, anticorruption layer. La traduction fait partie du dessin."
          }
        </>,
        <>
          {
            "Parnas ensuite, 1972. La frontière est causale : un module se découpe autour d'une décision susceptible de changer, jamais autour d'une étape du traitement. Page-Jones en fait une règle. Minimiser la "
          }
          {/* La source de Page-Jones tient dans cette bulle-là plutôt que sur son
            nom : les deux marqueurs tomberaient à quinze mots l'un de l'autre,
            et une définition qui porte déjà son inventeur peut porter sa
            référence. L'année des trois règles n'y figure pas — elles sont dans
            l'un de ses deux livres de conception objet, et je ne les ai pas
            relues pour savoir lequel. */}
          <Gloss id="gloss-connascence" term="connascence" marker="(i)">
            <span className="block text-xs leading-relaxed">
              {
                "Le lien qui oblige à changer un morceau de code quand un autre change : plus il est fort, plus les deux doivent rester proches. Nommé par Meilir Page-Jones dans « Comparing Techniques by Means of Encapsulation and Connascence », CACM, 1992."
              }
            </span>
          </Gloss>
          {
            " qui traverse une frontière d'encapsulation, maximiser celle qui reste dedans. Martin la range au niveau du composant : ce qui change pour la même raison au même moment tient ensemble."
          }
        </>,
        "Le premier sépare ce qui se dit autrement. Le second réunit ce qui change ensemble. Tant que deux sens évoluent à des rythmes différents, les deux critères tombent d'accord. Quand ils évoluent ensemble, ils s'opposent.",
        "Pour ne rien citer d'Hestia, un cas qu'on croise partout ailleurs : un contexte « Catalogue » qui définit Product, un contexte « Stock » qui définit Item. Les noms viennent d'ailleurs, la forme est celle qu'on a eue. Au premier critère, deux contextes et une traduction entre eux. Au second, un seul module.",
      ],
      figure: <ContextsBeforeFigure />,
    },
  ],
  [
    {
      key: "vocabulaire",
      heading: "On hérite du premier avec son vocabulaire",
      body: [
        "Le choix ne se pose pas. Le premier critère arrive avec les mots.",
        "« Bounded context » est le nom de l'unité de découpage. Le vocabulaire n'offre aucune façon de nommer deux choses sans les séparer : dès qu'on nomme, on a deux contextes. Personne n'a décidé qu'il y en aurait deux. On a nommé Catalogue, on a nommé Stock, et la frontière est venue avec les substantifs.",
        "On la trace en croyant décrire.",
      ],
      figure: <VocabularyMark />,
    },
  ],
  /* Les deux mécanismes du même aveuglement, donc la même rangée : l'un dit
     pourquoi la frontière a été tracée, l'autre ce qu'elle a coûté une fois
     tracée. Ni figure ni repère — deux textes qui se regardent n'ont pas de
     bord libre à occuper, et c'est le vis-à-vis lui-même qui les rapproche. */
  [
    {
      key: "coutprevu",
      heading: "Le patron prévoit son coût, donc on ne le voit pas",
      body: [
        "Le raccordement appartient au modèle au même titre que les contextes. Il est documenté, il est enseigné.",
        "Alors le jour où apparaît du code dont le seul travail est de tenir Product et Item d'accord, il ne se lit pas comme un symptôme. Il se lit comme la context map annoncée, à l'endroit annoncé.",
        "Un cadre qui classe une dépense en comportement attendu supprime la question de savoir si elle valait son prix.",
      ],
    },
    {
      key: "prix",
      heading: "Ce que la synchronisation a coûté",
      body: [
        "Rien ne s'est payé au moment du découpage. Tout s'est payé à chaque évolution.",
        "Une règle métier qui touchait l'identité partagée devait être portée deux fois, dans deux vocabulaires, et livrée en même temps des deux côtés. Un retard d'un côté ne cassait rien tout de suite. Il laissait deux vérités coexister, et la panne arrivait plus tard, chez quelqu'un qui n'avait pas touché à ce code.",
        "Le raccordement, lui, n'avait pas de propriétaire. Aucun besoin métier ne le réclamait, donc personne ne le portait dans un arbitrage, donc il vieillissait pendant que les deux côtés bougeaient.",
      ],
    },
  ],
  [
    {
      key: "communaute",
      heading: "La frontière n'avait personne à séparer",
      body: [
        <>
          <Gloss id="gloss-evans" term="Evans" marker="(i)">
            <span className="block text-xs leading-relaxed">
              {
                "Domain-Driven Design, 2003, p. 270. La formule « the work of a particular team », souvent donnée pour la définition de 2003, vient en fait de la DDD Reference, 2015."
              }
            </span>
          </Gloss>
          {
            " le pose dès 2003 : « there is a correspondence of one team per BOUNDED CONTEXT ». Une frontière de contexte suit une communauté de langage, et une communauté de langage suit des gens."
          }
        </>,
        "De part et d'autre de celle-là, c'étaient les mêmes. Les mêmes personnes disaient Product et Item dans la même réunion, et traduisaient de tête sans y penser. Aucun malentendu à protéger.",
        "La frontière retirée, il restait un problème de nom. Product et Item désignaient une seule identité sous deux rôles : ce qu'on vend / ce qu'on compte. Les deux contextes existaient pour qu'un même objet puisse vouloir dire deux choses selon l'endroit d'où on le regardait.",
        "Nommer les deux rôles fait ce travail-là sans frontière. Renommer se paie une fois. Une frontière se paie à chaque évolution.",
      ],
      figure: <CommunityMark />,
    },
  ],
  [
    {
      key: "these",
      heading: "Compter les communautés, pas les sens",
      body: [
        "Evans n'ignore pas le problème. L'ampleur d'un contexte est chez lui un arbitrage, et un besoin d'intégration fort est un argument pour élargir. Reste la question qu'il laisse ouverte : combien de traversées avant qu'une frontière coûte plus qu'elle ne rapporte ?",
        "Je ne crois pas que ça se compte. Les gens, si. Deux sens justifient une frontière quand deux groupes les portent séparément, parce que la traduction entre eux a alors une valeur pour quelqu'un. Sans ces deux groupes, il reste deux sens et personne pour les tenir à l'écart.",
        "D'où la question à poser avant de tracer : qui parle de chaque côté. Mêmes gens des deux côtés, la frontière n'a personne à séparer.",
        "Reste à nommer ce qu'on avait séparé. Un seul contexte, SellableProduct et StockUnit, mutuellement exclusives. Deux noms disent ce que deux contextes disaient, sans le raccordement.",
      ],
      figure: <ContextsAfterFigure />,
    },
  ],
];

export const ACT_TWO: Act = {
  key: "frontieres",
  ordinal: "02",
  title: ["Quand le découpage", "va trop loin"],
  /* « Bounded context » n'est pas glosé, là où « PMS » l'est : l'audience de
     cette page tient le terme, et le lui définir revient à lui expliquer son
     métier. Le sigle hôtelier, lui, ne s'invente pas. */
  body: "Ailleurs dans le même système, j'ai tracé les frontières moi-même. Trop de bounded contexts, avec des lignes posées trop tôt et trop finement.",
  signal: "Une idée définie dans deux contextes doit être changée dans les deux.",
  /* Pas de bloc « l'exemple » ici : Catalogue / Stock court à travers tout le
     développement, du cas posé en ouverture aux deux noms qui le referment. Le
     sortir en encadré le ferait lire deux fois, et la seconde en résumé. */
  paper: ACT_TWO_PAPER,
  quote:
    "Une frontière se juge au nombre de fois qu'on la traverse. Deux contextes qui se synchronisent tous les jours en font un, avec du travail en plus.",
};

/* ------------------------------------------------------------------ */
/* Transitions                                                        */
/* ------------------------------------------------------------------ */

/** Autonomes : elles ne récapitulent pas l'acte qui précède, elles ouvrent le
 *  suivant. C'est la seule chose qui les distingue d'un remplissage.
 *
 *  Découpées en lignes, jamais en phrases rendues à la file : la coupe est ici
 *  un fait de sens. Les deux questions sont posées l'une sous l'autre parce
 *  qu'elles s'énumèrent, et une seule ligne les laisserait se fondre en une
 *  phrase où la seconde passe pour la fin de la première. */
export const TRANSITIONS = {
  oneToTwo: [
    "Première question : où placer une frontière.",
    "Deuxième : est-ce vraiment une frontière.",
  ],
  /* La seule qui ne pose pas la question d'après : elle donne la raison
     d'avant. Le troisième étage n'est pas le prix de l'Acte II, il est la
     condition des deux, et c'est ce qui le rattache sans lui inventer une
     bascule. */
  twoToThree: [
    "Me tromper deux fois n'a rien coûté d'irréparable, pour une seule raison : livrer ne coûtait rien.",
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Troisième étage (coda)                                             */
/* ------------------------------------------------------------------ */

/**
 * Le troisième étage, qui n'est pas un troisième acte.
 *
 * Les deux premiers reposent sur un moment de bascule. Celui-ci est une
 * pratique accumulée : il n'y a pas de retournement à raconter, donc pas de
 * récit à calquer, et l'intro le dit au lieu de le laisser deviner. Il est
 * rendu comme un relevé — deux colonnes, une ligne par vérification — et sur un
 * aplat encre, pour que la rupture se voie avant d'être lue.
 */
export const ACT_THREE = {
  ordinal: "03",
  title: ["Même logique, appliquée", "à chaque fois"],
  intro:
    "Ce qui est assez important pour être vérifié à chaque livraison mérite d'être automatisé. Pas de bascule ici, pas d'erreur à défaire : des gestes qui ont cessé d'être faits à la main.",
  columns: { manual: "vérifié à la main", automated: "vérifié automatiquement" },
  rows: [
    /* Le relevé dit ce qui est vérifié et à quelle fréquence, jamais quel chemin
       passe où : nommer le parcours couvert reviendrait à décrire un flux
       interne. */
    {
      key: "parcours",
      manual: "Rejouer les chemins critiques à la main, avant chaque mise en production",
      name: "Test e2e",
      automated: "vérifie le comportement, les parcours fonctionnent toujours comme prévu",
    },
    {
      key: "rendu",
      manual: "Repérer une dérive visuelle à l'œil, si quelqu'un la remarque",
      name: "Test de régression visuelle",
      automated: "vérifie le rendu, rien n'a dérivé silencieusement",
    },
  ],
  cost: {
    label: "le prix",
    text: "Du temps pris, tôt, sur des fonctionnalités qu'un client attendait, et qu'il a fallu justifier autrement que par le confort de l'équipe.",
  },
  principle: "Ce qu'on n'ose plus déployer, on a déjà cessé de le faire évoluer.",
} as const;

/* ------------------------------------------------------------------ */
/* Conclusion                                                         */
/* ------------------------------------------------------------------ */

export const CLOSING =
  "Aucun outil ne m'a appris ça. L'architecture n'est pas une destination, c'est une décision qu'on reprend toutes les semaines.";
