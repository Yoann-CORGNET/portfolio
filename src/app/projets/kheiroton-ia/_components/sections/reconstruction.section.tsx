import { SplitHeader } from "@/components/sections/split-header";
import { PipelineFlow, type PipelineFlowStep } from "@/components/system";
import { RobustnessCard } from "@/app/projets/kheiroton-ia/_components/robustness-card";
import { cn } from "@/lib/utils";
import { COLUMN_TITLE, SUBHEAD } from "../typography";

const PIPELINE_LEAD = "Rien n'entre sans preuve. Rien ne sort sans consensus.";

const PIPELINE: readonly PipelineFlowStep[] = [
  {
    key: "sources",
    headings: ["Collecte"],
    hover: "tip",
    cards: [
      {
        key: "promesses",
        lead: "Promesses",
        cells: [
          {
            reveal:
              "Programmes officiels, chiffrages de l'Institut Montaigne et de l'IFRAP, presse : une recherche par candidat quand c'est possible.",
            example: "Baisser l'impôt sur le revenu de 2 points d'ici 2027",
          },
        ],
      },
      {
        key: "economie",
        lead: "Économie",
        cells: [
          {
            reveal:
              "INSEE, budget.gouv.fr, Agence France Trésor, Eurostat, Haut Conseil des finances publiques.",
            example: "Dette publique : 113 % du PIB",
          },
        ],
      },
      {
        key: "droit",
        lead: "Droit",
        cells: [
          {
            reveal: "Légifrance, Assemblée nationale, Vie publique, droit européen (EUR-Lex).",
            example: "Article 34 de la Constitution",
          },
        ],
      },
      {
        key: "precedents",
        lead: "Précédents",
        cells: [
          {
            reveal: "Cour des comptes, Vie publique, OCDE, FMI.",
            example: "Réforme des retraites, 2023",
          },
        ],
      },
    ],
  },
  {
    key: "gate",
    headings: ["Audit qualité"],
    hover: "tip",
    cards: [
      {
        key: "gate",
        lead: "Go / No-go",
        cells: [
          {
            reveal:
              "Tout passe par là. Sans source vérifiable ni deux orientations croisées par promesse, la suite attend et les recherches repartent.",
          },
        ],
      },
    ],
  },
  {
    key: "agents",
    headings: ["Analyse", "Scoring"],
    hover: "unfold",
    weight: 2.6,
    cards: [
      {
        key: "economiste",
        lead: "Économiste",
        cells: [{ reveal: "Le chiffrage tient-il ?" }, { reveal: "Coût et financement" }],
      },
      {
        key: "juriste",
        lead: "Juriste",
        cells: [
          { reveal: "C'est légal, et à quel prix ?" },
          { reveal: "Conformité, réformes requises" },
        ],
      },
      {
        key: "sociologue",
        lead: "Sociologue",
        cells: [{ reveal: "Acceptable, et pour qui ?" }, { reveal: "Impact et résistances" }],
      },
      {
        key: "fact-checker",
        lead: "Fact-checker",
        cells: [{ reveal: "Les chiffres sont-ils vrais ?" }, { reveal: "Vérification et sources" }],
      },
      {
        key: "historien",
        lead: "Historien",
        cells: [{ reveal: "Déjà tenté ailleurs ?" }, { reveal: "60 à 70 % réalisé en moyenne" }],
      },
    ],
  },
  {
    key: "outcome",
    headings: ["Synthèse"],
    hover: "tip",
    cards: [
      {
        key: "outcome",
        lead: "Rapport final",
        cells: [
          {
            reveal:
              "L'analyse multicritère recolle les cinq notes en un score unique, avec son intervalle de confiance et les désaccords expliqués plutôt que masqués.",
          },
        ],
      },
    ],
  },
];

const ROBUSTESSE = [
  {
    tone: "sand",
    title: "Méthode issue de la recherche, pas inventée",
    body: "Le scoring s'appuie sur l'analyse multicritère (MCDA), une méthode utilisée en évaluation des politiques publiques, en ingénierie et en santé, justement parce qu'elle rend le raisonnement transparent : on voit exactement pourquoi une promesse obtient tel score plutôt qu'un autre.",
  },
  {
    tone: "charcoal",
    title: "Zéro invention",
    body: "Règle non négociable : pas de donnée disponible, pas d'inclusion. L'absence d'information dans les sources n'est jamais confondue avec l'absence de financement proposé par le candidat.",
  },
  {
    tone: "moss",
    title: "Diversité de sources systématique",
    body: "Chaque promesse est confrontée à au moins deux orientations différentes (un chiffrage de l'Institut Montaigne face à une analyse de la Cour des Comptes, par exemple) pour éviter le biais d'une seule source.",
  },
  {
    tone: "steel",
    title: "Marge d'incertitude affichée",
    body: "Chaque score est accompagné d'un indice de confiance. Quand les données sont fragiles ou que les sources divergent, la marge augmente au lieu que le score cache le doute.",
  },
  {
    tone: "rust",
    title: "Un garde-fou dédié dans le pipeline",
    body: "L'étape d'audit qualité (le nœud 02 de la timeline) existe uniquement pour bloquer la suite du processus tant que les données ne sont pas complètes et vérifiées, avant même de lancer l'analyse.",
  },
] as const;

export function ReconstructionSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SplitHeader
          titleLines={["Ce qu'on a", "reconstruit"]}
          titleClassName={COLUMN_TITLE}
          lead={PIPELINE_LEAD}
          leadClassName={cn(SUBHEAD, "max-w-2xl")}
        />

        <PipelineFlow steps={PIPELINE} className="mt-14 -ml-4 md:ml-0" />

        <div className="mt-20">
          <h3 className={SUBHEAD}>Comment on l&apos;a rendu robuste</h3>
          <div className="mt-8 grid gap-px border border-border bg-border md:grid-cols-3">
            {ROBUSTESSE.map((item, i) => (
              <RobustnessCard
                key={item.title}
                tone={item.tone}
                title={item.title}
                body={item.body}
                className={i === 0 ? "md:col-span-2" : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
