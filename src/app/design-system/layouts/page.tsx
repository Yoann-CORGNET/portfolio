import type { Metadata } from "next";
import {
  Action,
  Bracketed,
  Etude,
  FlatBlock,
  FlowField,
  Frame,
  HoverIndex,
  Label,
  Marquee,
  Reveal,
  Segmented,
  StaggerHeading,
} from "@/components/system";
import { FLAT, dotScreen } from "@/lib/design/tokens";

export const metadata: Metadata = {
  title: "Layouts · Système de design",
  description: "Treize compositions bâties avec la bibliothèque.",
};

/**
 * Layout studies.
 *
 * The library page states what the pieces are; this one states what they are
 * *for*. Two rules hold across every étude below.
 *
 * 1. The texture is frozen at one setting and stays a *minority* surface. It
 *    lives in bounded panels — a tile, a band, a disc — and never sits full
 *    bleed behind body text, where it fought the type and read as psychedelic.
 * 2. The flat colour blocks carry the rest.
 *
 * Motion is one-shot and slow throughout: things arrive, then hold still.
 */

/** The frozen texture setting. Every field on the site is a variation of this. */
const BASE = {
  palette: "machine",
  spacing: 7,
  scale: 360,
  curl: 1.05,
  lineWidth: 1,
} as const;

const PROJECTS = [
  { name: "orbital-sync", meta: "Go · Postgres", year: "2026" },
  { name: "greeble", meta: "TypeScript · WebGL", year: "2025" },
  { name: "petrichor", meta: "Rust · WASM", year: "2025" },
  { name: "hollowpoint", meta: "Go · gRPC", year: "2024" },
  { name: "driftwood", meta: "Rust · Redis", year: "2024" },
];

export default function LayoutsPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="flex flex-wrap items-baseline gap-x-8 gap-y-2 px-6 py-4">
        <a href="/design-system" className="transition-opacity duration-300 hover:opacity-70">
          <Label tone="strong">← Système / layouts</Label>
        </a>
        <Label numeric className="ml-auto">
          13 compositions · texture minoritaire
        </Label>
      </header>

      {/* ================================================================== */}
      {/* 01 — Split. The texture gets a third of the screen and stops there. */}
      {/* ================================================================== */}
      <Etude index="01" title="Split 2/3 · 1/3" rule="La texture est un panneau, pas un fond.">
        <div className="grid min-h-[88vh] grid-cols-1 md:grid-cols-3">
          <div className="flex flex-col justify-end p-10 md:col-span-2 md:p-16">
            <Label>développeur backend</Label>
            <StaggerHeading
              text="YOANN"
              className="mt-6 text-[clamp(3.5rem,12vw,10rem)] font-bold leading-[0.82] tracking-tighter"
            />
            <StaggerHeading
              text="CORGNET"
              className="text-[clamp(3.5rem,12vw,10rem)] font-bold leading-[0.82] tracking-tighter"
            />
            <Reveal delay={400} className="mt-10 flex flex-wrap gap-x-10 gap-y-2">
              <Label>Go · Rust · TypeScript</Label>
              <Label>Toulouse</Label>
              <Label numeric>2026</Label>
            </Reveal>
            {/* The mechanical key on its home surface: an ink block cast on
                cream paper, at rest, absorbed on press. */}
            <Reveal delay={600} className="mt-10 flex flex-wrap gap-4">
              <Action href="#e13" size="lg">
                Me contacter
              </Action>
              <Action href="#e02" variant="ghost" size="lg">
                Voir les projets
              </Action>
            </Reveal>
          </div>
          <Frame className="min-h-[40vh] border-l border-border bg-card">
            <FlowField
              {...BASE}
              seed={3}
              intensity={0.95}
              maxSteps={900}
              interactive
              cursor
              influence={110}
              strength={42}
              plateau={0.55}
            />
          </Frame>
        </div>
      </Etude>

      {/* ================================================================== */}
      {/* 02 — Bento. Flat blocks carry the colour; one tile carries texture. */}
      {/* ================================================================== */}
      <Etude index="02" title="Bento" rule="Un seul carreau texturé parmi les aplats.">
        <div className="p-6 md:p-10">
          <div className="grid auto-rows-[minmax(120px,auto)] grid-cols-2 gap-3 md:grid-cols-4">
            <FlatBlock tone="ink" dots className="col-span-2 row-span-2 p-8">
              <Label style={{ color: FLAT.cream, opacity: 0.6 }}>01 · profil</Label>
              <p className="mt-6 text-3xl leading-tight tracking-tight">
                Backend, systèmes distribués, et le goût des machines qu&apos;on entretient.
              </p>
            </FlatBlock>

            <FlatBlock tone="vermillon" className="flex flex-col justify-between p-6">
              <Label style={{ color: FLAT.cream, opacity: 0.7 }}>projets</Label>
              <p className="text-5xl font-bold tabular-nums tracking-tighter">12</p>
            </FlatBlock>

            {/* The texture tile runs the full height of the last column, so the
                grid closes cleanly instead of leaving a hole under it. */}
            <Frame className="row-span-3 min-h-[240px] border border-border bg-card">
              <FlowField {...BASE} seed={21} intensity={1} maxSteps={700} />
            </Frame>

            <FlatBlock tone="amber" dots className="flex flex-col justify-between p-6">
              <Label style={{ opacity: 0.7 }}>années</Label>
              <p className="text-5xl font-bold tabular-nums tracking-tighter">4</p>
            </FlatBlock>

            <FlatBlock tone="petrol" className="col-span-2 flex items-end p-6">
              <p className="text-lg tracking-tight">Disponible pour de l&apos;alternance.</p>
            </FlatBlock>

            <FlatBlock tone="moss" className="flex flex-col justify-between p-6">
              <Label style={{ color: FLAT.cream, opacity: 0.75 }}>stack</Label>
              <p className="text-lg tracking-tight">Go</p>
            </FlatBlock>
          </div>
        </div>
      </Etude>

      {/* ================================================================== */}
      {/* 03 — Ticker. Motion that loops, kept to a single 40px-tall band.    */}
      {/* ================================================================== */}
      <Etude index="03" title="Bandeau défilant" rule="La seule animation en boucle du système.">
        <Marquee
          items={["GO", "RUST", "POSTGRESQL", "KAFKA", "DOCKER", "TERRAFORM", "GRPC", "REDIS"]}
        />
      </Etude>

      {/* ================================================================== */}
      {/* 04 — Stacked blocks. The one place a radius is allowed.            */}
      {/* ================================================================== */}
      <Etude index="04" title="Aplats empilés" rule="Coins généreux, trame de points, zéro ombre.">
        <div className="relative min-h-[70vh] overflow-hidden p-6 md:p-10">
          <FlatBlock
            tone="cream"
            dots
            className="h-64 rounded-[2.5rem] border border-border p-10"
            style={{ marginBottom: "-3rem" }}
          >
            <Label style={{ opacity: 0.6 }}>couche 01</Label>
            <p className="mt-4 max-w-md text-2xl leading-tight tracking-tight">
              L&apos;empilement remplace l&apos;ombre portée.
            </p>
          </FlatBlock>
          <FlatBlock
            tone="vermillon"
            dots
            className="relative z-10 ml-0 h-56 rounded-[2.5rem] p-10 md:ml-16"
            style={{ marginBottom: "-3rem" }}
          >
            <Label style={{ color: FLAT.cream, opacity: 0.7 }}>couche 02</Label>
            <p className="mt-4 max-w-md text-2xl leading-tight tracking-tight">
              La profondeur vient du chevauchement.
            </p>
          </FlatBlock>
          <FlatBlock
            tone="amber"
            dots
            className="relative z-20 ml-0 h-48 rounded-[2.5rem] p-10 md:ml-32"
          >
            <Label style={{ opacity: 0.7 }}>couche 03</Label>
          </FlatBlock>
        </div>
      </Etude>

      {/* ================================================================== */}
      {/* 05 — Interactive index. No texture at all; the accent is the hover. */}
      {/* ================================================================== */}
      <Etude
        index="05"
        title="Index survolable"
        rule="Le point chaud suit le curseur, un seul à la fois."
      >
        <div className="px-6 py-20 md:px-16">
          <Label>05 · projets</Label>
          <div className="mt-10 max-w-4xl">
            <HoverIndex items={PROJECTS} />
          </div>
        </div>
      </Etude>

      {/* ================================================================== */}
      {/* 06 — Column and rail. The tower: content refuses the width, and the */}
      {/* texture is a narrow vertical band standing beside it.               */}
      {/* ================================================================== */}
      <Etude index="06" title="Colonne + rail" rule="Refuser la largeur disponible.">
        <div className="grid min-h-screen grid-cols-12">
          <div className="col-span-1 hidden border-r border-border md:block" />
          <div className="col-span-12 py-20 pl-6 md:col-span-4 md:pl-12">
            <Label>06 · parcours</Label>
            <ol className="mt-12 space-y-12">
              {[
                ["2026", "Ingénieur logiciel", "Alternance"],
                ["2024", "Développeur backend", "Stage"],
                ["2023", "Premiers projets", "Perso"],
              ].map(([year, role, kind], i) => (
                <Reveal key={year} delay={i * 120}>
                  <li>
                    <Label numeric>{year}</Label>
                    <p className="mt-2 text-xl leading-tight tracking-tight">{role}</p>
                    <Label>{kind}</Label>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
          <Frame className="col-span-2 hidden border-x border-border bg-card md:block">
            <FlowField {...BASE} seed={2} intensity={0.9} maxSteps={900} fade="bottom" />
          </Frame>
          <div className="hidden md:col-span-5 md:block" />
        </div>
      </Etude>

      {/* ================================================================== */}
      {/* 07 — Segmented panels.                                             */}
      {/* ================================================================== */}
      <Etude index="07" title="Panneaux segmentés" rule="Bascule instantanée, transition douce.">
        <div className="px-6 py-20 md:px-16">
          <Label>07 · stack</Label>
          <div className="mt-10 max-w-3xl">
            <Segmented
              options={["Backend", "Frontend", "Infra"]}
              panels={[
                <FlatBlock key="b" tone="ink" className="p-10">
                  <p className="text-2xl leading-tight tracking-tight">Go · Rust · PostgreSQL</p>
                </FlatBlock>,
                <FlatBlock key="f" tone="petrol" className="p-10">
                  <p className="text-2xl leading-tight tracking-tight">
                    TypeScript · React · Next.js
                  </p>
                </FlatBlock>,
                <FlatBlock key="i" tone="charcoal" className="p-10">
                  <p className="text-2xl leading-tight tracking-tight">
                    Docker · Terraform · CI/CD
                  </p>
                </FlatBlock>,
              ]}
            />
          </div>
        </div>
      </Etude>

      {/* ================================================================== */}
      {/* 08 — Scale crush, flat. No texture competing with the display type. */}
      {/* ================================================================== */}
      <Etude index="08" title="Écrasement d'échelle" rule="Deux tailles, aucune intermédiaire.">
        <FlatBlock tone="cream" className="px-6 py-24 md:px-16">
          <Label style={{ opacity: 0.6 }}>08 · typographie</Label>
          <StaggerHeading
            text="DENSE"
            className="mt-6 text-[clamp(4rem,20vw,16rem)] font-bold leading-[0.8] tracking-tighter"
          />
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
            <Label style={{ opacity: 0.6 }}>aucune taille intermédiaire</Label>
            <Label style={{ opacity: 0.6 }}>ratio ≈ 25:1</Label>
          </div>
        </FlatBlock>
      </Etude>

      {/* ================================================================== */}
      {/* 09 — Sticky. One texture disc holds while the content scrolls past. */}
      {/* ================================================================== */}
      <Etude index="09" title="Panneau collant" rule="La texture tient, le contenu défile.">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="hidden md:block">
            <div className="sticky top-0 flex h-screen items-center justify-center p-16">
              <Frame className="aspect-square w-full max-w-sm rounded-full border border-border bg-card">
                <FlowField {...BASE} seed={5} intensity={1} maxSteps={500} fade="radial" />
              </Frame>
            </div>
          </div>
          <div className="space-y-24 px-6 py-24 md:px-12">
            {[
              ["Systèmes", "Des machines qu'on entretient, pas qu'on remplace."],
              ["Lisibilité", "Le code se lit plus souvent qu'il ne s'écrit."],
              ["Sobriété", "Rien n'explose, rien ne clignote."],
            ].map(([title, body], i) => (
              <Reveal key={title} delay={i * 100}>
                <Label numeric>{String(i + 1).padStart(2, "0")}</Label>
                <p className="mt-3 text-3xl leading-tight tracking-tight">{title}</p>
                <p className="mt-3 max-w-sm leading-relaxed text-muted-foreground">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Etude>

      {/* ================================================================== */}
      {/* 10 — Offset grid. Flat tiles stepped down a diagonal.              */}
      {/* ================================================================== */}
      <Etude index="10" title="Grille décalée" rule="Chaque colonne descend d'un cran.">
        <div className="px-6 py-20 md:px-16">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {(["steel", "moss", "rust", "charcoal"] as const).map((tone, i) => (
              <FlatBlock
                key={tone}
                tone={tone}
                dots={i % 2 === 0}
                className="flex h-56 flex-col justify-between p-6"
                style={{ marginTop: `${i * 2.5}rem` }}
              >
                <Label style={{ color: "inherit", opacity: 0.7 }}>
                  {String(i + 1).padStart(2, "0")}
                </Label>
                <p className="text-sm tracking-tight">{tone}</p>
              </FlatBlock>
            ))}
          </div>
        </div>
      </Etude>

      {/* ================================================================== */}
      {/* 11 — Atmospheric depth. The fade is on the decorative rails behind  */}
      {/* the list; the list itself stays fully legible.                      */}
      {/* ================================================================== */}
      <Etude
        index="11"
        title="Profondeur atmosphérique"
        rule="Le fondu porte sur le décor, jamais sur le texte."
      >
        <div className="relative overflow-hidden px-6 py-24 md:px-16">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={`rail-${i}`}
                className="absolute inset-y-0 border-l border-foreground"
                style={{ left: `${12 + i * 18}%`, opacity: 0.16 - i * 0.03 }}
              />
            ))}
          </div>
          <div className="relative">
            <Label>11 · écriture</Label>
            <ul className="mt-10 max-w-2xl space-y-6">
              {[
                "Le contraste du décor décroît par plans.",
                "Le contenu, lui, garde un contraste constant.",
                "Le fondu ne touche jamais ce qui se lit.",
              ].map((line) => (
                <li key={line} className="text-lg leading-relaxed tracking-tight">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Etude>

      {/* ================================================================== */}
      {/* 12 — The one full-bleed texture on the page, and it is 96px tall.   */}
      {/* ================================================================== */}
      <Etude
        index="12"
        title="Bande pleine largeur"
        rule="La seule texture pleine largeur, et elle est fine."
      >
        <Frame className="h-24 border-y border-border">
          <FlowField {...BASE} seed={88} intensity={0.9} maxSteps={600} fade="sides" />
        </Frame>
      </Etude>

      {/* ================================================================== */}
      {/* 13 — Composite. Flat block, one warm accent, texture as a detail.   */}
      {/* ================================================================== */}
      <Etude index="13" title="Composite" rule="Toutes les règles ensemble.">
        <FlatBlock tone="ink" className="px-6 py-28 md:px-16">
          <div className="grid gap-16 md:grid-cols-12">
            <div className="md:col-span-7">
              <Label style={{ color: FLAT.cream, opacity: 0.55 }}>13 · contact</Label>
              <StaggerHeading
                text="On en parle ?"
                className="mt-8 text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[0.85] tracking-tighter"
              />
              {/* On the ink block: the two variants built to survive a dark
                  surface. `link` keeps the warm rule; `outline` borrows the
                  block's own cream for its key, and warms to the accent when
                  touched. */}
              <Reveal delay={500} className="mt-12 flex flex-wrap items-center gap-6">
                <Action href="#e01" variant="link" size="lg">
                  yoann@exemple.fr
                </Action>
                <Action href="#e01" variant="outline" size="lg">
                  Télécharger le CV
                </Action>
              </Reveal>
            </div>
            <div className="md:col-span-5">
              <Bracketed className="p-2">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{ background: dotScreen(FLAT.cream) }}
                  />
                  <div className="absolute inset-0">
                    <FlowField
                      {...BASE}
                      seed={12}
                      intensity={0.8}
                      maxSteps={700}
                      fade="edges"
                      interactive
                      influence={95}
                      strength={34}
                      plateau={0.55}
                    />
                  </div>
                </div>
              </Bracketed>
            </div>
          </div>
        </FlatBlock>
      </Etude>

      <footer className="flex flex-wrap items-baseline gap-x-8 gap-y-2 border-t border-border px-6 py-10">
        <a href="/design-system" className="transition-opacity duration-300 hover:opacity-70">
          <Label>← retour au système</Label>
        </a>
        <Label numeric className="ml-auto">
          6 instances de texture · 13 compositions
        </Label>
      </footer>
    </main>
  );
}
