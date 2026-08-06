/**
 * L'Acte III, et il ne ressemble pas aux deux premiers.
 *
 * Les Actes I et II reposent chacun sur un moment de bascule : un signal, une
 * décision, une leçon. Celui-ci n'en a pas. C'est une pratique accumulée, et la
 * traiter comme un troisième récit reviendrait à inventer un retournement qui
 * n'a pas eu lieu. Il est donc rendu comme un relevé — deux colonnes, une ligne
 * par vérification — et posé sur un aplat encre, seul de la page, pour que la
 * rupture se voie avant de se lire.
 *
 * Le tableau existe en deux rendus. Au-dessus de `md`, un vrai `<table>` : la
 * correspondance entre une vérification manuelle et son équivalent automatisé
 * est une donnée tabulaire, et l'annoncer comme telle est ce qui la rend
 * navigable autrement qu'à l'œil. En dessous, deux colonnes de texte n'ont plus
 * la place de se lire côte à côte, et la correspondance se déplie donc à la
 * verticale, chaque ligne devenant un couple.
 */

import { ArrowDown } from "lucide-react";
import { FlatBlock, Label, Watermark } from "@/components/system";
import { ProjectSectionTitle } from "@/app/projets/_components/project-section-title";
import { FLAT } from "@/lib/design/tokens";
import { ACT_THREE } from "../content";

const { columns, rows, cost, principle } = ACT_THREE;

/** L'équivalent automatisé : son nom, puis ce qu'il vérifie. */
function Automated({ name, children }: Readonly<{ name: string; children: string }>) {
  return (
    <>
      <span className="font-bold tracking-tight">{name}</span> : {children}
    </>
  );
}

/* La colonne manuelle est tenue en retrait. Ce n'est pas un effet : c'est la
   pratique que l'autre colonne remplace, et elle se lit comme telle. À 0,72
   d'opacité, la crème sur l'encre reste très au-dessus du seuil de contraste. */
const FADED = { opacity: 0.72 };

function Table() {
  return (
    <table className="mt-14 hidden w-full border-collapse text-left md:table">
      <thead>
        <tr>
          <th scope="col" className="w-1/2 border-b border-current/30 pr-8 pb-3 align-bottom">
            <Label tone="inherit" className="opacity-70">
              {columns.manual}
            </Label>
          </th>
          <th
            scope="col"
            className="w-1/2 border-b border-l border-current/30 pb-3 pl-8 align-bottom"
          >
            <Label tone="inherit" className="opacity-70">
              {columns.automated}
            </Label>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.key}>
            <td
              className="border-b border-current/20 py-7 pr-8 align-top leading-relaxed"
              style={FADED}
            >
              {row.manual}
            </td>
            <td className="border-b border-l border-current/20 py-7 pl-8 align-top leading-relaxed">
              <Automated name={row.name}>{row.automated}</Automated>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Stack() {
  return (
    <ul className="mt-12 space-y-10 md:hidden">
      {rows.map((row) => (
        <li key={row.key} className="border-t border-current/30 pt-6">
          <Label tone="inherit" className="opacity-70">
            {columns.manual}
          </Label>
          <p className="mt-3 leading-relaxed" style={FADED}>
            {row.manual}
          </p>

          <ArrowDown
            aria-hidden="true"
            className="my-6 h-4 w-4"
            style={{ color: FLAT.vermillon }}
          />

          <Label tone="inherit" className="opacity-70">
            {columns.automated}
          </Label>
          <p className="mt-3 leading-relaxed">
            <Automated name={row.name}>{row.automated}</Automated>
          </p>
        </li>
      ))}
    </ul>
  );
}

export function LedgerSection() {
  return (
    <section className="border-t border-border">
      {/* Tout le rembourrage descend sur le conteneur intérieur, et l'aplat
          n'en garde aucun. `FlatBlock` range ses enfants dans un `relative`
          intérieur, posé *dans* son propre rembourrage : porté par l'aplat, ce
          rembourrage deviendrait l'origine du filigrane, qui démarrerait cinq
          rem sous le haut du bloc au lieu de s'y coller. Sans rembourrage sur
          l'aplat, ce conteneur intérieur épouse le bloc entier et le filigrane
          s'accroche là où on l'attend.

          Il s'efface deux fois moins vite ici : la crème sur l'encre rend
          beaucoup moins que l'encre sur le papier à taux égal. */}
      <FlatBlock tone="ink">
        <Watermark opacity={0.16}>{ACT_THREE.ordinal}</Watermark>

        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          {/* Plancher plus bas que celui des Actes I et II : la ligne la plus
              longue fait ici vingt-trois caractères, contre dix-neuf. */}
          <ProjectSectionTitle
            lines={ACT_THREE.title}
            className="text-[clamp(1.25rem,4.5vw,3rem)] leading-[0.95] font-bold tracking-tighter"
          />

          <p className="mt-10 max-w-2xl text-lg leading-relaxed" style={{ opacity: 0.86 }}>
            {ACT_THREE.intro}
          </p>

          <Table />
          <Stack />

          {/* Le prix porte une étiquette là où le principe n'en a pas : le
              principe s'affirme, celui-ci répond à une question que le relevé
              vient de poser. Au corps du texte courant, pas à celui d'une
              citation. */}
          <div className="mt-14 md:mt-16">
            <Label tone="inherit" className="opacity-70">
              {cost.label}
            </Label>
            <p className="mt-5 max-w-2xl leading-relaxed" style={{ opacity: 0.86 }}>
              {cost.text}
            </p>
          </div>

          <div className="mt-16 md:mt-20">
            <blockquote className="max-w-3xl text-[clamp(1.375rem,3.4vw,2.25rem)] leading-[1.08] font-bold tracking-tighter">
              {principle}
            </blockquote>
          </div>
        </div>
      </FlatBlock>
    </section>
  );
}
