import type { Metadata } from "next";
import { FlatBlock, Label, MascotEmoji, MascotHead, MascotScreen } from "@/components/system";
import { Principle, Section } from "@/components/system/docs";
import {
  MASCOT_EMOJIS,
  MASCOT_EMOJI_IDS,
  MASCOT_FACES,
  MASCOT_FACE_IDS,
  MASCOT_HEAD_SCHEMES,
  MASCOT_HEAD_SCHEME_IDS,
  type MascotEmojiId,
} from "@/lib/design/mascot-shapes";
import { FLAT, type FlatToken } from "@/lib/design/tokens";
import { MascotStage } from "./_components/mascot-stage";
import { MascotViewer } from "./_components/mascot-viewer";

export const metadata: Metadata = {
  title: "Mascotte · Système de design",
  description:
    "Prompt, la mascotte du site : un petit serveur dont le visage est une invite de commande. Ses règles, ses expressions et ses quatre niveaux de détail.",
};

/** Les tons dont la mascotte est faite, et ce que chacun habille. */
const COLOURS: { token: FlatToken; role: string }[] = [
  { token: "cream", role: "tête, mains" },
  { token: "sand", role: "filet de la tête" },
  { token: "petrol", role: "corps, antenne" },
  { token: "charcoal", role: "bras, oreilles" },
  { token: "ink", role: "écran, pieds" },
  { token: "vermillon", role: "le curseur" },
  { token: "steel", role: "la larme" },
];

const LEVELS = [
  {
    index: "L1",
    title: "Complète",
    text: "Le corps entier, ses poses et ses gestes. Illustrations, bannières, pages d'erreur.",
  },
  {
    index: "L2",
    title: "Tête",
    text: "La tête seule. Avatars, bulles de discussion, notifications : l'expression sans le corps.",
  },
  {
    index: "L3",
    title: "Symbole",
    text: "La tête de face, à plat, sans volume ni ombre. Elle ne descend pas sous 64 px.",
  },
  {
    index: "L4",
    title: "Emoji",
    text: "Le visage seul, dans une tuile. Réactions, messages, commentaires : la mascotte en un caractère.",
  },
] as const;

/** Le symbole à trois tailles, jusqu'au plancher de 64 px. */
const SIZES = [
  { size: 160, width: "w-40" },
  { size: 96, width: "w-24" },
  { size: 64, width: "w-16" },
] as const;

/** Un emoji posé dans une ligne de texte, à la hauteur de la ligne. */
function Inline({ emoji }: Readonly<{ emoji: MascotEmojiId }>) {
  return (
    <MascotEmoji
      emoji={emoji}
      label={MASCOT_EMOJIS[emoji].label}
      className="mx-0.5 inline-block h-[1.4em] w-[1.4em] align-[-0.35em]"
    />
  );
}

export default function MascottePage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="flex flex-wrap items-baseline gap-x-8 gap-y-2 border-b border-border px-6 py-4 md:px-12">
        <a href="/design-system" className="transition-opacity duration-300 hover:opacity-70">
          <Label tone="strong">← Système / mascotte</Label>
        </a>
        <Label numeric className="ml-auto">
          {MASCOT_FACE_IDS.length} expressions · {MASCOT_EMOJI_IDS.length} emojis · 4 niveaux
        </Label>
      </header>

      {/* ============================================================== */}
      {/* Couverture                                                     */}
      {/* ============================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-5">
        <div className="flex flex-col justify-end p-6 py-20 md:p-12 md:py-28 lg:col-span-2">
          <Label>mascotte · système de design</Label>
          <h1 className="mt-6 text-[clamp(3.5rem,10vw,8rem)]">
            PROMPT<span style={{ color: FLAT.vermillon }}>_</span>
          </h1>
          <p className="mt-8 max-w-md leading-relaxed text-muted-foreground">
            Un petit serveur dont le visage est une invite de commande. Les yeux en chevrons
            reprennent le « &gt; » de la marque, la bouche est le curseur. Il obéit aux règles du
            reste du système : des aplats, un rayon nul, un seul point chaud.
          </p>
        </div>
        <div className="border-t border-border bg-card lg:col-span-3 lg:border-l lg:border-t-0">
          <MascotViewer />
        </div>
      </section>

      {/* ============================================================== */}
      {/* 00 · Règles                                                    */}
      {/* ============================================================== */}
      <Section
        id="regles"
        index="00"
        title="Règles"
        note="Ce qui fait que la mascotte reste reconnaissable, quelle que soit sa taille ou son humeur."
      >
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <Principle index="01" title="Un seul point chaud">
            La bouche est le curseur vermillon. Elle change de forme avec l&apos;expression, jamais
            de place ni de couleur, et rien d&apos;autre sur la mascotte n&apos;est vermillon.
          </Principle>
          <Principle index="02" title="La tête ne change pas">
            Toute l&apos;expression tient dans l&apos;écran. Le contour reste le même d&apos;une
            émotion à l&apos;autre ; seul le visage varie.
          </Principle>
          <Principle index="03" title="Des aplats, pas de rondeurs">
            Des boîtes en volume, des rectangles et des polygones à plat. Ni biseau, ni dégradé, ni
            courbe.
          </Principle>
          <Principle index="04" title="Une seule entorse">
            La larme, en acier : la seule couleur froide qu&apos;un visage puisse porter, et
            seulement dans la tristesse.
          </Principle>
          <Principle index="05" title="Le logo reste le « > »">
            Prompt accompagne la marque, il ne la remplace pas. Il n&apos;apparaît jamais à la place
            du logo.
          </Principle>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-px bg-border sm:grid-cols-4 lg:grid-cols-7">
          {COLOURS.map(({ token, role }) => (
            <FlatBlock key={token} tone={token} className="p-4">
              <div className="flex min-h-28 flex-col justify-between gap-4">
                <Label tone="inherit">{token}</Label>
                <Label tone="inherit" className="opacity-80">
                  {role}
                </Label>
              </div>
            </FlatBlock>
          ))}
        </div>
      </Section>

      {/* ============================================================== */}
      {/* 01 · Expressions                                               */}
      {/* ============================================================== */}
      <Section
        id="expressions"
        index="01"
        title="Expressions"
        note="Douze états, chacun lié à un usage. Le même tracé habille l'écran en volume et l'illustration à plat."
      >
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {MASCOT_FACE_IDS.map((id) => (
            <figure key={id} className="bg-background p-6">
              <MascotScreen face={id} />
              <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <Label tone="strong">{MASCOT_FACES[id].label}</Label>
                <Label>{MASCOT_FACES[id].use}</Label>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* ============================================================== */}
      {/* 02 · Niveaux de détail                                         */}
      {/* ============================================================== */}
      <Section
        id="niveaux"
        index="02"
        title="Niveaux de détail"
        note="Quatre niveaux tirés du même modèle. Plus la place manque, plus on retire : le corps, puis le volume, puis la tête."
      >
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {LEVELS.map(({ index, title, text }) => (
            <article key={index} className="flex flex-col bg-background">
              <div className="p-6 pb-0">
                <div className="flex items-baseline gap-3">
                  <Label numeric tone="accent">
                    {index}
                  </Label>
                  <h3 className="text-xl tracking-tight">{title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
              <div className="flex min-h-72 flex-1 items-center justify-center">
                {index === "L1" && (
                  <MascotStage
                    deferred
                    pose="victoire"
                    label="Prompt en entier, bras levés"
                    className="h-72 w-full"
                  />
                )}
                {index === "L2" && (
                  <MascotStage
                    deferred
                    framing="head"
                    label="La tête de Prompt, en volume"
                    className="h-72 w-full"
                  />
                )}
                {index === "L3" && (
                  <MascotHead label="Le symbole : la tête de Prompt à plat" className="w-44" />
                )}
                {index === "L4" && (
                  <MascotEmoji emoji="heureux" label="L'emoji heureux" className="h-28 w-28" />
                )}
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* ============================================================== */}
      {/* 03 · Symbole                                                   */}
      {/* ============================================================== */}
      <Section
        id="symbole"
        index="03"
        title="Symbole"
        note="La tête à plat, en quatre traitements. Chacun dit sur quel fond il est écrit."
      >
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {MASCOT_HEAD_SCHEME_IDS.map((id) => {
            const scheme = MASCOT_HEAD_SCHEMES[id];
            return (
              <FlatBlock key={id} tone={scheme.ground} className="flex flex-col p-6">
                <Label tone="inherit">{scheme.label}</Label>
                <div className="flex flex-1 items-center justify-center py-10">
                  <MascotHead scheme={id} className="w-40" />
                </div>
                <p className="text-sm leading-relaxed opacity-80">{scheme.note}</p>
              </FlatBlock>
            );
          })}
        </div>

        <div className="mt-16">
          <Label>tailles · 160, 96 et 64 px, la plus petite admise</Label>
          <div className="mt-6 flex flex-wrap items-end gap-10">
            {SIZES.map(({ size, width }) => (
              <div key={size} className="flex flex-col items-start gap-3">
                <MascotHead className={width} />
                <Label numeric>{size}</Label>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================================== */}
      {/* 04 · Emojis                                                    */}
      {/* ============================================================== */}
      <Section
        id="emojis"
        index="04"
        title="Emojis"
        note="Seize visages, même tuile, même tracé. Redessinés plutôt que réduits : à 20 px, les traits de l'écran deviendraient des taches."
      >
        <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4 lg:grid-cols-8">
          {MASCOT_EMOJI_IDS.map((id) => (
            <figure key={id} className="flex flex-col gap-4 bg-background p-5">
              <MascotEmoji emoji={id} className="h-20 w-20" />
              <figcaption className="flex items-center justify-between gap-2">
                <Label>{MASCOT_EMOJIS[id].label}</Label>
                <span className="flex items-center gap-1.5">
                  <MascotEmoji emoji={id} className="h-8 w-8" />
                  <MascotEmoji emoji={id} className="h-5 w-5" />
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-16 max-w-2xl space-y-4">
          <Label>en situation</Label>
          <p className="leading-relaxed">
            Déploiement terminé <Inline emoji="rire" /> aucune erreur, douze services à jour.
          </p>
          <p className="leading-relaxed">
            Le test d&apos;intégration échoue encore <Inline emoji="pleure" /> je reprends demain{" "}
            <Inline emoji="veille" />
          </p>
        </div>
      </Section>

      <footer className="flex flex-wrap items-baseline gap-x-8 gap-y-2 border-t border-border px-6 py-10 md:px-12">
        <a href="/design-system" className="transition-opacity duration-300 hover:opacity-70">
          <Label>← retour au système</Label>
        </a>
      </footer>
    </main>
  );
}
