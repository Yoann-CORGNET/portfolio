/**
 * Les figures des Actes I et II.
 *
 * Elles partagent une grammaire — cartes à filet, liens vermillon, étiquettes à
 * dix pixels — parce qu'elles sont dessinées avec le vocabulaire déjà posé sur
 * le site, non parce que les deux actes se répondraient. Chacune montre un état
 * puis celui qui l'a remplacé.
 *
 * Les liens sont en SVG plutôt qu'en bordures absolues parce qu'un faisceau qui
 * converge a besoin de diagonales. Le cadre est étiré (`preserveAspectRatio`
 * désactivé) pour que les extrémités tombent exactement sur le centre des
 * cartes quelle que soit la hauteur ; `vectorEffect` garde malgré ça le trait à
 * un pixel, sinon l'étirement l'épaissirait dans un seul axe.
 */

import { ArrowLeftRight, User } from "lucide-react";
import { Label } from "@/components/system";
import { FLAT } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Pièces communes                                                    */
/* ------------------------------------------------------------------ */

/** Le centre de la i-ème piste sur n, en % de la hauteur du cadre. */
const rail = (i: number, n: number) => ((i + 0.5) / n) * 100;

/** Une case du diagramme. Filet et rien d'autre : le système ne pose ni angle
 *  arrondi ni ombre, et une figure n'a pas de raison d'y déroger. */
function Node({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center border border-border bg-background px-3 py-2 text-center",
        className,
      )}
    >
      <Label>{children}</Label>
    </div>
  );
}

/** Une colonne de n cases, chacune centrée dans une piste de hauteur égale.
 *  C'est cette égalité qui fait tomber les liens pile au bon endroit. */
function Rails({ children }: Readonly<{ children: readonly React.ReactNode[] }>) {
  return (
    <div
      className="grid h-full"
      style={{ gridTemplateRows: `repeat(${children.length}, minmax(0,1fr))` }}
    >
      {children.map((node, i) => (
        <div key={i} className="flex items-center">
          {node}
        </div>
      ))}
    </div>
  );
}

/** Les liens entre deux colonnes, une paire d'ordonnées par trait. */
function Links({ pairs }: Readonly<{ pairs: readonly (readonly [number, number])[] }>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="h-full w-full"
    >
      {pairs.map(([from, to]) => (
        <line
          key={`${from}-${to}`}
          x1="0"
          y1={from}
          x2="100"
          y2={to}
          stroke={FLAT.vermillon}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/**
 * Un volet de figure : son étiquette, le dessin, sa légende.
 *
 * `side` réserve la gouttière contre le filet central du diptyque, et il la
 * réserve sur la figure entière. La poser sur le seul dessin décalerait celui-ci
 * sans décaler l'étiquette ni la légende, qui resteraient collées au filet : les
 * trois éléments d'un même volet doivent partir de la même verticale. Sans
 * `side`, le volet est seul et n'a pas de filet dont s'écarter.
 */
function Panel({
  caption,
  note,
  side,
  children,
}: Readonly<{
  caption: string;
  note: string;
  side?: "left" | "right";
  children: React.ReactNode;
}>) {
  return (
    <figure
      className={cn("min-w-0", side === "left" && "md:pr-10", side === "right" && "md:pl-10")}
    >
      <figcaption>
        <Label>{caption}</Label>
      </figcaption>
      <div className="mt-4 h-48 md:h-52">{children}</div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{note}</p>
    </figure>
  );
}

/** Les deux volets côte à côte, séparés d'un filet sur écran large, à parts
 *  égales — ce qui suppose que les deux dessins portent la même charge. */
function Diptych({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid gap-10 md:grid-cols-2 md:gap-0 md:divide-x md:divide-border">
      {children}
    </div>
  );
}

/* La grille d'un volet : colonne, gouttière de liens, colonne.
   La gouttière est large — un faisceau qui converge tombe de 33 % de la hauteur
   du cadre, soit plus de quatre rem, et sur deux rem et demi de largeur les
   trois diagonales se pincent en un angle si fermé qu'elles se lisent comme un
   nœud plutôt que comme un entonnoir. Les combs orthogonaux du système s'en
   passent, une diagonale non. */
const WIRING = "grid h-full grid-cols-[1fr_2rem_1fr] md:grid-cols-[1fr_3.5rem_1fr]";

/* ------------------------------------------------------------------ */
/* Acte I — l'usine, puis les ports                                   */
/* ------------------------------------------------------------------ */

const DOMAINS = ["domaine a", "domaine b", "domaine c"] as const;

const FAN_IN = DOMAINS.map((_, i) => [rail(i, DOMAINS.length), 50] as const);
const PARALLEL = DOMAINS.map((_, i) => {
  const y = rail(i, DOMAINS.length);
  return [y, y] as const;
});

export function PortsFigure() {
  const callers = DOMAINS.map((name) => <Node key={name}>{name}</Node>);

  return (
    <Diptych>
      <Panel
        side="left"
        caption="avant"
        note="Une seule interface sert tous les callers. Deux besoins sans rapport se retrouvent à la modifier au même endroit."
      >
        <div className={WIRING}>
          <Rails>{callers}</Rails>
          <Links pairs={FAN_IN} />
          <div className="flex h-full items-center">
            <Node className="h-full">une interface</Node>
          </div>
        </div>
      </Panel>

      <Panel
        side="right"
        caption="après"
        note="Un port par contexte, qui ne décrit que son propre besoin. Les adapters implémentent exactement cela."
      >
        <div className={WIRING}>
          <Rails>{callers}</Rails>
          <Links pairs={PARALLEL} />
          <Rails>
            {DOMAINS.map((name) => (
              <Node key={name}>{`port ${name.at(-1)}`}</Node>
            ))}
          </Rails>
        </div>
      </Panel>
    </Diptych>
  );
}

/* ------------------------------------------------------------------ */
/* Acte II — deux contextes jumeaux, puis un seul                     */
/* ------------------------------------------------------------------ */

/** Un contexte : son nom, et l'abstraction qu'il porte. */
function Context({ name, children }: Readonly<{ name: string; children: React.ReactNode }>) {
  return (
    <div className="flex h-full min-w-0 flex-col border border-border bg-background">
      <div className="border-b border-border px-4 py-2">
        <Label>{name}</Label>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-6">{children}</div>
    </div>
  );
}

/** Le nom d'une abstraction, dans une figure. Souligné plutôt qu'en italique :
 *  le site est entièrement monospace et n'a pas de vraie italique à offrir. */
function Model({ children }: Readonly<{ children: string }>) {
  return (
    <span className="text-center text-sm leading-snug tracking-tight break-words underline decoration-current/30 underline-offset-4">
      {children}
    </span>
  );
}

/*
 * Les deux volets de l'Acte II ne forment plus un diptyque.
 *
 * Ils sont séparés parce que l'argument qui les porte les sépare : l'avant est
 * le cas qu'on pose au début, l'après la conclusion qu'on en tire six sections
 * plus bas. Côte à côte, la figure donnait la réponse avant la démonstration.
 */

export function ContextsBeforeFigure() {
  return (
    <Panel
      caption="le cas"
      note="Deux contextes, deux noms, une identité quasi identique. Ce qui reste à écrire, c'est la synchronisation entre les deux."
    >
      <div className="grid h-full grid-cols-[1fr_2.5rem_1fr]">
        <Context name="« catalogue »">
          <Model>Product</Model>
        </Context>
        <div className="flex flex-col items-center justify-center gap-2">
          <ArrowLeftRight
            aria-hidden="true"
            className="h-4 w-4 shrink-0"
            style={{ color: FLAT.vermillon }}
          />
          <span
            aria-hidden="true"
            className="w-px flex-none"
            style={{ height: "1.5rem", background: FLAT.vermillon }}
          />
        </div>
        <Context name="« stock »">
          <Model>Item</Model>
        </Context>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Acte II — les deux repères de section                               */
/* ------------------------------------------------------------------ */

/**
 * Deux repères, et non deux figures de plus.
 *
 * Le développement alterne texte et bord d'en face à chaque section, donc les
 * six ont besoin de quelque chose en regard. Mais six figures pleines — cadre,
 * étiquette, légende — font six documents de même poids : la colonne devient un
 * second texte, la légende répète le paragraphe d'à côté, et aucune ne compte
 * plus qu'une autre. Seules les deux qui portent l'avant et l'après restent des
 * figures. Les quatre autres sont des repères : un dessin nu, sans cadre, sans
 * étiquette, sans légende, et petit.
 *
 * Deux règles les tiennent, et elles suffisent à ce qu'ils forment une série :
 *
 *  — **le vermillon est la frontière**, et rien d'autre. Le trait qui sépare,
 *    et ce qui le traverse. Tout le reste — fourche, cartouches, silhouettes —
 *    est à l'encre. C'est ce qui rend la couleur lisible d'un repère à l'autre
 *    au lieu d'en faire du grain sur toute la hauteur de l'acte ;
 *  — **aucun ne se lit deux fois.** Quatre variantes du même dessin ne valent
 *    pas mieux qu'un blanc : chacun a sa silhouette — une fourche, une rangée
 *    de cartouches, un trait traversé, un rang de silhouettes.
 */
function Mark({
  className,
  children,
}: Readonly<{ className?: string; children: React.ReactNode }>) {
  return (
    /* Décoratif, et pas par commodité : un repère sans légende n'a rien à
       annoncer qui ne soit déjà dans le paragraphe d'en face. Les deux figures
       de l'acte, elles, portent une légende et restent lisibles.

       `mx-auto` le centre dans sa colonne. Chaque repère porte une largeur
       propre — celle que son dessin demande — donc ferrés à gauche ils
       donneraient quatre bords différents le long de l'acte, là où le texte
       n'en a qu'un. Centrés, ils partagent un axe. */
    <div
      aria-hidden="true"
      className={cn("mx-auto flex min-h-24 w-full flex-col justify-center", className)}
    >
      {children}
    </div>
  );
}

/**
 * La frontière elle-même : un filet vertical vermillon.
 *
 * C'est la seule chose que les repères de l'Acte II ont en commun, et c'est
 * voulu — l'acte raconte une frontière, donc on doit la reconnaître d'un repère
 * à l'autre sans avoir à relire le texte. Elle est pleine tant qu'elle sépare,
 * pointillée quand elle ne sépare plus personne.
 *
 * Elle se pose elle-même en absolu et tire sa hauteur de `inset-y-0`, plutôt que
 * de demander cent pour cent d'un parent : un `h-full` dans un parent dont la
 * hauteur est calculée par le flux se résout à `auto`, et le filet se réduit
 * alors à un talon de quelques pixels — visible, donc pris pour un choix.
 */
function Boundary({
  dashed = false,
  className,
}: Readonly<{ dashed?: boolean; className?: string }>) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute inset-y-0 left-1/2 w-0 -translate-x-1/2 border-l",
        dashed && "border-dashed",
        className,
      )}
      style={{ borderColor: FLAT.vermillon }}
    />
  );
}

/** Un mot posé dans une figure : le nom qu'on donne, pas le modèle qu'il
 *  désigne. Sans filet autour — ce qui compte ici est l'acte de nommer. */
function Naming({ children }: Readonly<{ children: string }>) {
  return <span className="text-sm tracking-tight">{children}</span>;
}

/**
 * Les deux contextes nommés, de part et d'autre de la frontière.
 *
 * Sans eux, un repère qui montre ce qui arrive à la frontière ne montre qu'un
 * trait : le rang de silhouettes devient un groupe posé sur rien. Nommer les
 * deux côtés est le minimum qui rende un dessin lisible sans sa légende — et
 * c'est une nomenclature, pas une glose : la légende paraphrasait le paragraphe
 * d'en face, ces deux mots-là ne se trouvent nulle part ailleurs dans le
 * repère.
 *
 * À dix pixels, c'est-à-dire à l'échelle des étiquettes de tout le site, et non
 * à celle des noms de la fourche : ceux-là sont le sujet de leur repère, ceux-ci
 * situent le sujet des autres.
 */
function BoundarySides() {
  return (
    <div className="grid grid-cols-2">
      <span className="block text-center">
        <Label>« catalogue »</Label>
      </span>
      <span className="block text-center">
        <Label>« stock »</Label>
      </span>
    </div>
  );
}

/**
 * Le vocabulaire — une identité, deux noms, et la frontière qui vient avec.
 *
 * La fourche est faite de filets, pas d'un dessin : un trait horizontal fermé de
 * deux montants, et une amorce au-dessus de son milieu. À cette taille, deux
 * diagonales en SVG auraient donné un angle de quelques degrés, qu'on lit comme
 * un trait tremblé plutôt que comme une bifurcation.
 *
 * Elle est à l'encre là où la frontière est vermillon : la section dit que la
 * frontière arrive avec les mots, donc c'est elle qu'on doit voir, pas la
 * dérivation qui la précède.
 */
export function VocabularyMark() {
  return (
    <Mark className="max-w-[19rem]">
      {/* Ce que la fourche divise, dit en toutes lettres. Une fourche dont le
          pied est vide ne divise rien de nommé : on voit deux branches sortir
          d'un point, ce qui est un dessin, pas un argument. */}
      <span className="block text-center">
        <Label>une identité</Label>
      </span>

      <div className="relative mt-2">
        <span className="absolute -top-2 left-1/2 h-2 w-px -translate-x-1/2 bg-border" />
        <div className="h-4 border-t border-r border-l border-border" />
      </div>

      {/* La rangée porte une hauteur pour que la frontière ait quelque chose à
          occuper : calée sur les seuls noms, elle se réduirait à la hauteur
          d'une ligne et se lirait comme un trait d'union vertical. */}
      <div className="relative mt-3 grid h-10 grid-cols-2 items-center">
        <span className="justify-self-center">
          <Naming>« Catalogue »</Naming>
        </span>
        <Boundary />
        <span className="justify-self-center">
          <Naming>« Stock »</Naming>
        </span>
      </div>
    </Mark>
  );
}

/* Les gens, en rang. Ils ne sont pas répartis de part et d'autre : le rang est
   centré sur la frontière et la chevauche, ce qui est tout l'argument de la
   section — la même communauté des deux côtés. */
const PEOPLE = 5;

/** La communauté — les mêmes personnes de chaque côté de la frontière.
 *
 *  Les silhouettes sont à l'encre et la frontière seule est vermillon : ce sont
 *  les gens qui la traversent sans y penser, donc c'est elle qui doit avoir
 *  l'air d'être là pour rien. */
export function CommunityMark() {
  return (
    <Mark className="max-w-[15rem]">
      <div className="relative">
        <Boundary dashed />
        <BoundarySides />

        <div className="mt-4 flex h-14 items-center justify-center gap-3">
          {Array.from({ length: PEOPLE }, (_, i) => (
            <User key={i} className="relative h-5 w-5 text-muted-foreground" />
          ))}
        </div>
      </div>
    </Mark>
  );
}

export function ContextsAfterFigure() {
  return (
    <Panel
      caption="ce qui a tenu"
      note="Un seul contexte, deux abstractions mutuellement exclusives. Elles y coexistent, il n'y a plus rien à reconnecter."
    >
      <Context name="un seul contexte">
        {/* Empilées, une par ligne. En deux colonnes, chaque nom se coupait au
            milieu d'un mot — un modèle dont le nom se brise ne se lit plus
            comme un nom. Le pointillé passe donc à l'horizontale : il sépare
            toujours les deux, et c'est lui qui porte le « mutuellement
            exclusives ». */}
        <div className="grid w-full grid-rows-2 items-center">
          <div className="flex justify-center border-b border-dashed border-border pb-3">
            <Model>SellableProduct</Model>
          </div>
          <div className="flex justify-center pt-3">
            <Model>StockUnit</Model>
          </div>
        </div>
      </Context>
    </Panel>
  );
}
