/**
 * Les Actes I et II.
 *
 * La respiration qui les sépare n'est plus ici : c'est `ProjectHinge`, partagée
 * par les pages projet.
 *
 * Un seul composant rend les deux actes, et c'est le fond du parti pris : ils
 * partagent une ouverture et une fermeture — le corps, le signal, puis la
 * citation. Cette identité n'est pas une économie de code, c'est elle qui rend
 * visible la rupture de l'Acte III. Deux sections copiées à la main auraient
 * dérivé au premier ajustement, et la rupture avec.
 *
 * Entre les deux, chaque acte remplit à sa mesure. `middle` sort une réponse en
 * regard d'une figure, `paper` déroule un développement en sections. Un acte
 * peut prendre l'un, l'autre, ou les deux — mais les deux ne se cumulent que si
 * l'encadré dit ce que le développement ne redit pas.
 *
 * Le signal est le seul temps qui sort du papier. Il passe sur un aplat sable,
 * pleine largeur, et entre guillemets : ce n'est pas le récit de ce qui est
 * arrivé un jour, c'est le constat que l'acte vient défendre. Le voir avant de
 * le lire est le but.
 */

import { FlatBlock, Label, Reveal, Rule, Watermark } from "@/components/system";
import { ProjectSectionTitle } from "@/app/projets/_components/project-section-title";
import { FLAT } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import { ACCENT } from "../accent";
import { ActNumber } from "../act-number";
import type { Act, PaperRow, PaperSection } from "../content";

/* La mesure du développement, plus étroite que celle du corps de l'acte : un
   texte long ne se lit pas à la même mesure qu'un texte de dix lignes. Elle est
   fixe plutôt qu'une fraction de la grille, sinon elle s'élargirait avec le
   conteneur au-delà de ce qui se lit. */
const MEASURE = "max-w-[34rem]";

/** Le texte d'une section : son titre, puis son corps. Rien d'autre — la figure
 *  et la place qu'elle prend sont l'affaire de la rangée. */
function SectionText({ section }: Readonly<{ section: PaperSection }>) {
  return (
    <div>
      <h3 className="text-xl leading-tight font-bold tracking-tight md:text-2xl">
        {section.heading}
      </h3>
      {/* Indexés : un paragraphe peut porter une glose, donc ce n'est plus
          forcément une chaîne dont on pourrait faire une clé. La liste est
          statique et ne se réordonne jamais. */}
      {section.body.map((paragraph, position) => (
        <p key={position} className="mt-4 leading-relaxed text-muted-foreground">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

/**
 * Le développement, en rangées qui alternent de bord.
 *
 * Deux colonnes de trente-quatre rem tiennent côte à côte dans les soixante-
 * douze du conteneur sans se recouvrir, donc l'alternance produit deux
 * verticales franches plutôt qu'un décalage. C'est cette largeur-là qui la rend
 * lisible : l'élargir ferait se chevaucher les deux bords et l'alternance
 * retomberait en simple retrait.
 *
 * L'alternance ne tient que si le bord d'en face porte quelque chose. Avec deux
 * figures pour six sections, elle faisait quatre fois sur six passer le texte
 * devant une demi-page vide, et c'est ce vide-là qui se lisait — pas le
 * balancement. D'où deux façons de remplir ce bord, et une seule règle : rien
 * n'y est posé pour occuper la place.
 *
 *  — **une figure ou un repère**, quand la section a un état du découpage à
 *    montrer. Le texte reste ferré à gauche des deux côtés — aligner à droite
 *    un paragraphe de six lignes déplace le point d'attaque de chaque ligne et
 *    se paie en vitesse de lecture — et seul le bloc d'en face bascule, par
 *    `col-start` et jamais par `order` : l'ordre du DOM reste texte puis
 *    figure, pour qu'on lise l'argument avant son illustration ;
 *  — **une seconde section**, quand deux d'entre elles se répondent assez pour
 *    que le vis-à-vis dise quelque chose. Celles-là n'ont ni figure ni bord :
 *    elles se font mutuellement face.
 *
 * Toutes passent par la même grille de deux colonnes. C'est ce qui garantit les
 * deux verticales : un bloc poussé à droite par `justify-end` se calerait sur le
 * bord du conteneur et non sur la colonne, et le demi-rem d'écart suffirait à
 * denteler la marge d'une rangée à l'autre.
 *
 * En dessous de `md`, l'alternance et les deux mises en regard tombent, faute
 * d'une largeur où les voir : la figure repasse sous son texte, et deux sections
 * en vis-à-vis se remettent à la file.
 */
function Paper({ rows }: Readonly<{ rows: readonly PaperRow[] }>) {
  /* Le bord de chaque rangée simple. Il se déduit du nombre de rangées simples
     qui la précèdent, et non d'un compteur qu'on incrémente au fil du rendu :
     les rangées doubles n'ont pas de bord, donc les laisser consommer un rang
     renverrait la rangée suivante du côté de la précédente, et le balancement
     se casserait là où on l'a interrompu. */
  const laid = rows.map((row, index) => {
    const singlesBefore = rows.slice(0, index).filter((earlier) => earlier.length === 1).length;
    return { row, right: row.length === 1 && singlesBefore % 2 === 1 };
  });

  return (
    <div className="mt-20 space-y-16 md:space-y-20">
      {laid.map(({ row, right }) =>
        row.length > 1 ? (
          /* Deux sections en vis-à-vis, séparées d'un filet.

             C'est le filet, et non la gouttière, qui fait la séparation : deux
             textes de même corps simplement écartés se lisent comme une seule
             colonne qui passe à la ligne, et il faut arriver au bas de la
             première pour comprendre que ce n'en était pas une.

             Il est centré entre les deux — gouttière nulle, et le retrait porté
             par chaque volet — sans quoi il collerait au volet de droite. En
             dessous de `md` la grille tombe à une colonne : le filet disparaît
             plutôt que de basculer à l'horizontale, où il ne se distinguerait
             plus d'une séparation de sections. */
          <div key={row[0].key} className="grid gap-16 md:grid-cols-2 md:gap-0">
            {row.map((section, position) => (
              <div
                key={section.key}
                className={position === 0 ? "md:pr-10" : "md:border-l md:border-border md:pl-10"}
              >
                <SectionText section={section} />
              </div>
            ))}
          </div>
        ) : (
          /* Les deux cases s'étirent à la hauteur de la rangée — pas de
             `items-start` — parce que c'est la seule chose qui donne à la
             colonne de figure une hauteur où se centrer. Le texte, lui, ne
             bouge pas pour autant : il remplit sa case depuis le haut. */
          <div key={row[0].key} className="md:grid md:grid-cols-2 md:gap-12">
            <div className={cn(MEASURE, right && "md:col-start-2")}>
              <SectionText section={row[0]} />
            </div>

            {/* Centrée sur la hauteur du texte qu'elle accompagne, et non calée
                sur son premier mot : une figure haute de six rem posée en tête
                d'une section qui en fait quarante se lit comme un reste en haut
                d'une colonne vide. Le centrage est en colonne flex plutôt qu'en
                `items-center` de grille, pour que les enfants gardent leur pleine
                largeur — un `align-items` centré les ferait tomber à la largeur
                de leur contenu, et le cadre des deux figures avec. */}
            {row[0].figure && (
              <div
                className={cn(
                  "mt-10 md:mt-0 md:flex md:h-full md:flex-col md:justify-center",
                  right && "md:col-start-1 md:row-start-1",
                )}
              >
                {row[0].figure}
              </div>
            )}
          </div>
        ),
      )}
    </div>
  );
}

/** Le filet chaud qui ouvre un intertitre. */
function AccentRule() {
  return (
    <span
      aria-hidden="true"
      className="mt-4 block h-px w-10"
      style={{ background: FLAT.vermillon }}
    />
  );
}

/** La citation qui ferme un acte : une affirmation, pas un résumé. Son filet
 *  la distingue des transitions, qui n'en ont pas. */
function ActQuote({ children }: Readonly<{ children: string }>) {
  return (
    <div className="mt-20">
      <Rule />
      <blockquote className="mt-8 max-w-3xl text-[clamp(1.375rem,3.4vw,2.25rem)] leading-[1.08] font-bold tracking-tighter">
        {children}
      </blockquote>
    </div>
  );
}

/* Coupé à la main : chaque ligne est rendue sans césure possible, donc c'est
   la plus longue (19 caractères) qui fixe le plancher du clamp. */
const ACT_TITLE = "text-[clamp(1.5rem,5vw,3.5rem)] leading-[0.95] font-bold tracking-tighter";

/* Le chiffre, calibré sur les deux lignes du titre plutôt que choisi à l'œil.
   Deux rapports le fixent, et les deux se déduisent de `ACT_TITLE` :

    — le **corps**. L'encre du titre va du haut des capitales de la première
      ligne à la ligne de base de la seconde, soit un interligne plus une
      hauteur de capitale : 0,95 + 0,73 = 1,68 fois son corps. Les chiffres
      occupant eux aussi 0,73 de leur corps, il faut 1,68 / 0,73 ≈ 2,3 fois
      celui du titre. D'où le clamp, qui est exactement celui du titre
      multiplié par 2,3 — les deux grandissent donc ensemble à toute largeur,
      là où deux clamps indépendants se désaccorderaient entre les paliers ;
    — l'**interlignage**. À 0,83, la boîte du chiffre (2,3 × 0,83 ≈ 1,9) vaut
      exactement celle des deux lignes du titre (2 × 0,95 = 1,9). Les deux
      blocs font alors la même hauteur, ce qui laisse `items-start` les caler
      sans décalage à corriger à la main.

   La graisse, elle, ne se calcule pas : elle descend à `light` pendant que le
   titre reste gras. À ce corps, le chiffre pèse déjà par sa taille, et le
   laisser gras lui ferait disputer au titre une attention qu'il ne demande
   pas. JetBrains Mono est chargée en fonte variable (aucun `weight` n'est
   passé dans `layout.tsx`), donc l'axe 300 existe pour de vrai. */
const ACT_MARK = "text-[clamp(3.45rem,11.5vw,8.05rem)] leading-[0.83] font-light";

/* Le point médian prend le corps du titre, pas celui du chiffre : il sépare
   deux choses sans prétendre peser autant qu'elles. Il reste sur le clamp du
   titre plutôt que sur une valeur fixe pour suivre les mêmes paliers, et garde
   l'encre pleine — allégé en plus d'être réduit, il disparaîtrait. */
const ACT_DOT = "text-[clamp(1.5rem,5vw,3.5rem)] leading-none text-foreground";

/**
 * Comment l'acte annonce son rang.
 *
 * `watermark` le pose en filigrane derrière le titre, `beside` en clair dans
 * une colonne à côté. Les deux coexistent sur la page à dessein, pour se
 * comparer à l'œil ; c'est aussi la seule raison pour laquelle ce composant
 * porte un choix plutôt qu'une règle.
 */
export type ActMark = "watermark" | "beside";

export function ActSection({
  act,
  figure,
  mark,
}: Readonly<{ act: Act; figure?: React.ReactNode; mark: ActMark }>) {
  const beside = mark === "beside";

  return (
    <section className="border-t border-border">
      {/* Le filigrane s'accroche à ce bloc, pas à la section : centré sur la
          section entière il tomberait derrière la bande sable, qui est opaque
          et le masquerait. `overflow-hidden` le rogne sur son débord gauche. */}
      <div className={cn("pt-20 md:pt-28", !beside && "relative overflow-hidden")}>
        {beside ? null : <Watermark opacity={0.08}>{act.ordinal}</Watermark>}

        {/* Positionné, donc peint après le filigrane. Statique, il passerait
            dessous : un absolu l'emporte toujours sur un élément hors flux. */}
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            {beside ? (
              /* Un flex plutôt qu'une grille de douze : le chiffre ne prend
                 que sa largeur et le titre se pose contre lui, là où une
                 colonne de trois douzièmes réservait dix-huit rem pour deux
                 caractères et repoussait le titre d'autant. `flex-wrap` le
                 renvoie au-dessus quand le titre, insécable, ne tient plus à
                 côté. */
              <div className="flex flex-wrap items-start gap-x-7 gap-y-2 md:gap-x-10">
                <ActNumber className={ACT_MARK}>{act.ordinal}</ActNumber>
                {/* Le point médian sépare, il ne se lit pas : masqué aux
                    lecteurs d'écran, et centré sur la rangée plutôt que calé
                    en haut comme ses deux voisins — un séparateur se pose au
                    milieu de ce qu'il sépare. */}
                <span aria-hidden="true" className={cn(ACT_DOT, "self-center")}>
                  ·
                </span>
                <ProjectSectionTitle lines={act.title} className={ACT_TITLE} />
              </div>
            ) : (
              <ProjectSectionTitle lines={act.title} className={ACT_TITLE} />
            )}
          </Reveal>

          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {act.body}
          </p>
        </div>
      </div>

      {/* Le signal, pleine largeur : il sort du conteneur pour que la bande
          traverse la page au lieu d'être un encadré de plus dans la colonne. */}
      <FlatBlock tone="sand" className="mt-14 border-y border-border">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          {/* Guillemets posés ici et non dans les données : les deux actes
              passent par ce composant, donc aucun signal ne peut les oublier.
              Espaces insécables, pour qu'un chevron ne tombe jamais seul en
              bout de ligne. */}
          <p className="max-w-3xl text-xl leading-snug tracking-tight md:text-2xl">
            {"« "}
            {act.signal}
            {" »"}
          </p>
        </div>
      </FlatBlock>

      <div className="mx-auto max-w-6xl px-6 pb-24 md:pb-32">
        {act.middle && (
          <div className="mt-16 grid gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <Label style={ACCENT}>{act.middle.label}</Label>
              <AccentRule />
              <p className="mt-5 leading-relaxed text-muted-foreground">{act.middle.text}</p>
            </div>
            <div className="md:col-span-7">{figure}</div>
          </div>
        )}

        {act.paper && <Paper rows={act.paper} />}

        <ActQuote>{act.quote}</ActQuote>
      </div>
    </section>
  );
}
