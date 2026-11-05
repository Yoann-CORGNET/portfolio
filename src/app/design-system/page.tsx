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
  Logo,
  Marquee,
  Meter,
  OverlapCascade,
  OverlapTriangle,
  Preview,
  Reveal,
  Rule,
  Segmented,
  Stat,
  StatCell,
  StatGrid,
  SurfaceProvider,
  SurfaceSwitch,
  Tag,
  Tooltip,
  Watermark,
} from "@/components/system";
import type { ActionSize, ActionState, ActionVariant } from "@/components/system";
import {
  Inventory,
  OverlapCascadeBench,
  OverlapTriangleBench,
  Principle,
  Section,
  Spec,
  Swatch,
  Variant,
  Variants,
} from "@/components/system/docs";
import { MotionScale, TypeSpecimen } from "@/components/system/specimens";
import { TerminalDefaultDemo, TerminalSpecialisedDemo } from "./_components/terminal-demo";
import {
  GROUP_ORDER,
  GROUPS,
  INVENTORY,
  REGISTRY,
  byGroup,
  type Group,
} from "@/lib/design/registry";
import { FLAT, FLAT_TOKENS, TYPE, WARM_TOKENS, dotScreen } from "@/lib/design/tokens";
import { LOGO_SCHEMES, LOGO_SCHEME_IDS, type LogoScheme } from "@/lib/design/brand";
import { cn } from "@/lib/utils";
import { PALETTES, buildRamp } from "@/lib/design/palette";

export const metadata: Metadata = {
  title: "Système de design",
  description: "La bibliothèque, ses fondations, ses composants et leurs variantes.",
};

/**
 * The design system, documented.
 *
 * Every section below the foundations is generated from `REGISTRY`, so the page
 * cannot fall behind the library: a component that exists but is not listed
 * simply is not in the system, and one that is listed but has no preview here
 * shows up as a hole rather than quietly vanishing.
 *
 * The previews themselves live in this file rather than in the registry,
 * because a preview is JSX and JSX in a data file stops being data.
 */

/** The frozen texture setting every field on the site is a variation of. */
const BASE = {
  palette: "machine",
  spacing: 7,
  scale: 360,
  curl: 1.05,
  lineWidth: 1,
} as const;

const RAMP = buildRamp(PALETTES.machine, 72);

const PROJECTS = [
  { name: "orbital-sync", meta: "Go · Postgres", year: "2026" },
  { name: "greeble", meta: "TypeScript · WebGL", year: "2025" },
  { name: "petrichor", meta: "Rust · WASM", year: "2025" },
];

/* Each role is shown with the wording it would actually carry, because a row of
   five buttons all reading "Bouton" documents the styling and nothing else. */
const ACTION_VARIANTS: { id: ActionVariant; label: string }[] = [
  { id: "primary", label: "Me contacter" },
  { id: "secondary", label: "Voir le code" },
  { id: "outline", label: "Télécharger le CV" },
  { id: "ghost", label: "Ignorer" },
  { id: "link", label: "yoann@exemple.fr" },
];

const ACTION_SIZES: ActionSize[] = ["sm", "md", "lg"];

/** The six states a control can be in, pinned so they can be read at rest. */
const ACTION_STATES: {
  id: string;
  name: string;
  props: { force?: ActionState; disabled?: boolean; loading?: boolean };
}[] = [
  { id: "rest", name: "repos", props: {} },
  { id: "hover", name: "survol", props: { force: "hover" } },
  { id: "active", name: "appui", props: { force: "active" } },
  { id: "focus", name: "focus", props: { force: "focus" } },
  { id: "disabled", name: "indispo.", props: { disabled: true } },
  { id: "loading", name: "en cours", props: { loading: true } },
];

/**
 * La marque sur le fond qu'elle demande.
 *
 * Une partition dont les chevrons sont en crème n'est lisible que sur un aplat
 * sombre : elle emporte donc son fond, plutôt que de dépendre du commutateur
 * d'aperçu de la page. Les autres ne reçoivent rien du tout — un cadre autour
 * d'une seule des trois cases suggérerait une différence de nature là où il n'y
 * a qu'une différence de fond.
 */
function LogoOnItsGround({
  scheme,
  className,
}: Readonly<{ scheme: LogoScheme; className?: string }>) {
  const mark = <Logo scheme={scheme} className={cn("shrink-0", className)} />;
  if (LOGO_SCHEMES[scheme].tones[0] !== "cream") return mark;
  return (
    <span className="inline-flex w-fit p-3" style={{ background: FLAT.ink }}>
      {mark}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Previews                                                           */
/* ------------------------------------------------------------------ */

const PREVIEWS: Record<string, React.ReactNode> = {
  label: (
    <Variants>
      <Variant name="muted">
        <Label>développeur backend</Label>
      </Variant>
      <Variant name="strong">
        <Label tone="strong">Système / composition</Label>
      </Variant>
      <Variant name="accent">
        <Label tone="accent">disponible</Label>
      </Variant>
      <Variant name="numeric">
        <Label numeric>2026 · 04 · 12</Label>
      </Variant>
      <Variant name="inherit · sur un aplat" padded={false}>
        <FlatBlock tone="vermillon" className="p-8">
          <Label tone="inherit">hérite de la couleur du bloc</Label>
        </FlatBlock>
      </Variant>
    </Variants>
  ),

  rule: (
    <Variants>
      <Variant name="border">
        <Rule />
      </Variant>
      <Variant name="accent">
        <Rule tone="accent" />
      </Variant>
    </Variants>
  ),

  tag: (
    <Variants columns={1}>
      <Variant name="filaire et pleins">
        <div className="flex flex-wrap gap-2">
          <Tag>Go</Tag>
          <Tag tone="petrol">Rust</Tag>
          <Tag tone="vermillon">TypeScript</Tag>
          <Tag tone="moss">Postgres</Tag>
        </div>
      </Variant>
    </Variants>
  ),

  action: (
    <Variants columns={1}>
      <Variant name="les cinq rôles">
        <div className="flex flex-wrap items-center gap-4">
          {ACTION_VARIANTS.map(({ id, label }) => (
            <Action key={id} href="#action" variant={id}>
              {label}
            </Action>
          ))}
        </div>
      </Variant>

      {/* The whole point of the matrix: a state you can only reach with a
          pointer is a state nobody documents, and therefore a state that rots.
          `force` pins each one so they are read side by side, at rest. */}
      <Variant name="états">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {ACTION_STATES.map(({ id, name, props }) => (
            <div key={id} className="flex flex-col items-start gap-3">
              <Label tone="inherit" className="opacity-50">
                {name}
              </Label>
              <Action href="#action" size="sm" {...props}>
                Envoyer
              </Action>
              <Action href="#action" size="sm" variant="outline" {...props}>
                Envoyer
              </Action>
            </div>
          ))}
        </div>
      </Variant>

      <Variant name="trois tailles">
        <div className="flex flex-wrap items-center gap-4">
          {ACTION_SIZES.map((size) => (
            <Action key={size} href="#action" variant="outline" size={size}>
              {size}
            </Action>
          ))}
        </div>
      </Variant>

      <Variant name="lien ou bouton">
        <div className="flex flex-wrap items-center gap-4">
          <Action href="#action" variant="secondary">
            avec href : &lt;a&gt;
          </Action>
          <Action variant="secondary">sans href : &lt;button&gt;</Action>
        </div>
      </Variant>
    </Variants>
  ),

  "flat-block": (
    <Variants columns={1}>
      <Variant name="les dix tons" padded={false}>
        <div className="grid grid-cols-5">
          {FLAT_TOKENS.map((tone) => (
            <FlatBlock key={tone} tone={tone} className="flex aspect-square items-end p-3">
              <span className="text-[10px] tracking-tight">{tone}</span>
            </FlatBlock>
          ))}
        </div>
      </Variant>
      <Variant name="trame de points">
        <div className="grid grid-cols-2 gap-3">
          <FlatBlock tone="vermillon" className="flex h-28 items-end p-4">
            <Label style={{ color: "inherit", opacity: 0.8 }}>sans trame</Label>
          </FlatBlock>
          <FlatBlock tone="vermillon" dots className="flex h-28 items-end p-4">
            <Label style={{ color: "inherit", opacity: 0.8 }}>avec trame</Label>
          </FlatBlock>
        </div>
      </Variant>
    </Variants>
  ),

  tooltip: (
    <Variants columns={1}>
      {/* Le rembourrage haut n'est pas décoratif : la bulle se pose en
          `bottom-full`, donc sans place au-dessus elle sortirait du volet et
          serait rognée. C'est la limite assumée d'une bulle sans mesure. */}
      <Variant name="au survol">
        <div className="flex justify-center px-6 pt-24 pb-8">
          <span
            tabIndex={0}
            aria-describedby="ds-tooltip"
            className="group relative inline-block cursor-help border-b border-dashed border-border text-sm"
          >
            un terme à expliciter
            <Tooltip id="ds-tooltip">
              <span className="block text-xs leading-relaxed">
                L&apos;ancre porte <code>group relative</code> et reçoit le focus : la même bulle
                s&apos;ouvre au survol et au clavier.
              </span>
            </Tooltip>
          </span>
        </div>
      </Variant>
    </Variants>
  ),

  watermark: (
    <Variants>
      {/* Les deux surfaces sont montrées côte à côte parce que c'est tout le
          sujet du composant : `opacity` est requis, et la même valeur ne rend
          pas la même chose sur le papier et sur l'encre. Chaque volet porte
          `relative overflow-hidden` — sans quoi la marque n'aurait rien à quoi
          s'accrocher et déborderait au lieu d'être rognée.

          La hauteur des deux volets vient du rembourrage du texte, jamais du
          cadre : `FlatBlock` range ses enfants dans un `relative` intérieur
          posé dans son propre rembourrage, donc un aplat rembourré décalerait
          la marque vers le bas. Rembourrer le contenu et laisser le cadre nu
          garde les deux volets comparables et la marque à sa place. */}
      <Variant name="sur papier">
        <div className="relative overflow-hidden border border-border bg-background">
          <Watermark opacity={0.08}>01</Watermark>
          <p className="relative px-6 py-16 text-sm leading-relaxed">
            Encre sur papier : la marque s&apos;impose vite, donc elle s&apos;efface tôt.
          </p>
        </div>
      </Variant>
      <Variant name="sur aplat">
        <FlatBlock tone="ink">
          <Watermark opacity={0.16}>02</Watermark>
          <p className="relative px-6 py-16 text-sm leading-relaxed">
            Crème sur encre : à taux égal elle rendrait moins, donc elle monte.
          </p>
        </FlatBlock>
      </Variant>
    </Variants>
  ),

  bracketed: (
    <Variants columns={1}>
      <Variant name="default">
        <Bracketed className="p-6">
          <p className="text-center text-sm leading-relaxed">
            Cadrer sans enfermer. Les équerres marquent la zone, la boîte fermée l&apos;isolerait.
          </p>
        </Bracketed>
      </Variant>
    </Variants>
  ),

  logo: (
    <Variants>
      {/* Chaque partition est posée sur la surface pour laquelle elle est
          écrite, et non sur celle du commutateur d'aperçu : « craie » sur le
          crème est une case vide, ce qui donnerait à voir un défaut là où il n'y
          en a pas. La règle est dans la partition elle-même — un premier ton
          crème veut un fond encre. */}
      {LOGO_SCHEME_IDS.map((scheme) => (
        <Variant key={scheme} name={scheme}>
          <div className="flex flex-col gap-5">
            <LogoOnItsGround scheme={scheme} className="h-20 w-20" />
            <p className="text-xs leading-relaxed opacity-70">{LOGO_SCHEMES[scheme].note}</p>
          </div>
        </Variant>
      ))}

      <Variant name="en situation · à la taille de la navigation">
        <div className="space-y-5">
          {LOGO_SCHEME_IDS.map((scheme) => (
            <div key={scheme} className="flex items-center gap-3">
              <LogoOnItsGround scheme={scheme} className="h-9 w-9" />
              <span className="text-xl tracking-tight">
                <span style={{ color: FLAT.vermillon }}>{">"}</span> Yoann CORGNET
              </span>
            </div>
          ))}
        </div>
      </Variant>

      <Variant name="composée dans du texte">
        <p className="text-sm leading-loose">
          Une marque posée dans une ligne{" "}
          <Logo scheme="encre" className="inline-block h-4 w-4 translate-y-0.5" /> se compose comme
          un caractère : l&apos;accent est déjà pris par ce qui l&apos;entoure.
        </p>
      </Variant>
    </Variants>
  ),

  stat: (
    <Variants>
      <Variant name="default">
        <Stat value={12} label="projets" />
      </Variant>
      <Variant name="avec unité">
        <Stat value={4} label="expérience" unit="ans" />
      </Variant>
      <Variant name="avec delta">
        <Stat value={98} label="couverture" unit="%" delta={3} />
      </Variant>
      <Variant name="display">
        <Stat value="2026" label="promotion" size="display" />
      </Variant>
    </Variants>
  ),

  "stat-grid": (
    <Variants columns={1}>
      <Variant name="4 colonnes" padded={false}>
        <StatGrid>
          <StatCell>
            <Stat value={12} label="projets" />
          </StatCell>
          <StatCell>
            <Stat value={4} label="années" unit="ans" />
          </StatCell>
          <StatCell tone="vermillon">
            <Stat value={3} label="langages" />
          </StatCell>
          <StatCell>
            <Stat value={98} label="couverture" unit="%" delta={3} />
          </StatCell>
        </StatGrid>
      </Variant>
    </Variants>
  ),

  meter: (
    <Variants columns={1}>
      <Variant name="trois tons, une échelle libre">
        <div className="space-y-5">
          <Meter value={9} label="Go" />
          <Meter value={7} label="Rust" tone="petrol" />
          <Meter value={6} label="TypeScript" tone="moss" />
          <Meter value={3} max={5} label="Terraform" tone="amber" />
        </div>
      </Variant>
    </Variants>
  ),

  "hover-index": (
    <Variants columns={1}>
      <Variant name="survole une ligne">
        <HoverIndex items={PROJECTS} />
      </Variant>
    </Variants>
  ),

  segmented: (
    <Variants columns={1}>
      <Variant name="3 segments" padded={false}>
        <Segmented
          options={["Backend", "Frontend", "Infra"]}
          panels={[
            <FlatBlock key="b" tone="ink" className="p-8">
              <p className="text-xl leading-tight tracking-tight">Go · Rust · PostgreSQL</p>
            </FlatBlock>,
            <FlatBlock key="f" tone="petrol" className="p-8">
              <p className="text-xl leading-tight tracking-tight">TypeScript · React · Next.js</p>
            </FlatBlock>,
            <FlatBlock key="i" tone="charcoal" className="p-8">
              <p className="text-xl leading-tight tracking-tight">Docker · Terraform · CI/CD</p>
            </FlatBlock>,
          ]}
        />
      </Variant>
    </Variants>
  ),

  "surface-switch": (
    <Variants columns={1}>
      <Variant name="pilote tous les aperçus de la page">
        <SurfaceSwitch />
      </Variant>
    </Variants>
  ),

  // Both are live: type in them. The pair is the point — the second is the
  // first with a disk and two commands, which is all a specialised terminal
  // ever is.
  terminal: (
    <Variants columns={1}>
      <Variant name="shell par défaut — <Terminal {...useShell()} />" padded={false}>
        <TerminalDefaultDemo />
      </Variant>
      <Variant name="spécialisé — disk et commandes propres" padded={false}>
        <TerminalSpecialisedDemo />
      </Variant>
    </Variants>
  ),

  reveal: (
    <Variants columns={1}>
      <Variant name="en cascade, une seule fois">
        <div className="space-y-4">
          {["Systèmes", "Lisibilité", "Sobriété"].map((word, i) => (
            <Reveal key={word} delay={i * 150}>
              <p className="text-xl leading-tight tracking-tight">{word}</p>
            </Reveal>
          ))}
        </div>
      </Variant>
    </Variants>
  ),

  marquee: (
    <Variants columns={1}>
      <Variant name="ink · 38 s" padded={false}>
        <Marquee items={["GO", "RUST", "POSTGRESQL", "KAFKA", "DOCKER", "TERRAFORM"]} />
      </Variant>
      <Variant name="petrol · 70 s" padded={false}>
        <Marquee
          tone={FLAT.petrol}
          duration={70}
          items={["GRPC", "REDIS", "NATS", "OPENTELEMETRY", "CI/CD"]}
        />
      </Variant>
    </Variants>
  ),

  /* Les figures se documentent au banc plutôt qu'en vignettes : leurs réglages
     forment un espace continu, borné par des inégalités, et c'est en poussant
     un curseur jusqu'à la rupture qu'on comprend où sont les bords. Deux
     variantes fixes suffisent ensuite à montrer ce que le défaut n'est pas. */
  "overlap-cascade": (
    <Variants columns={1}>
      <Variant name="réglage · pousse les curseurs" padded={false}>
        <OverlapCascadeBench />
      </Variant>
      <Variant name="décalage 15 · décalage 22">
        <div className="grid grid-cols-2 gap-6">
          <OverlapCascade shift={15} />
          <OverlapCascade shift={22} />
        </div>
      </Variant>
    </Variants>
  ),

  "overlap-triangle": (
    <Variants columns={1}>
      <Variant name="réglage · pousse les curseurs" padded={false}>
        <OverlapTriangleBench />
      </Variant>
      <Variant name="pointes au centre · skew 0 · faces au centre · skew 45">
        <div className="grid grid-cols-2 gap-6">
          <OverlapTriangle skew={0} side={44} radius={16} orientation={90} />
          <OverlapTriangle side={44} radius={16} orientation={90} />
        </div>
      </Variant>
    </Variants>
  ),

  "flow-field": (
    <Variants columns={1}>
      <Variant name="statique · fondu radial" padded={false}>
        <div className="grid grid-cols-2">
          <Frame className="aspect-square border-r border-border">
            <FlowField {...BASE} seed={21} maxSteps={700} />
          </Frame>
          <Frame className="aspect-square">
            <FlowField {...BASE} seed={5} maxSteps={500} fade="radial" />
          </Frame>
        </div>
      </Variant>
      {/* The reactive field, full size. This is the one place on the site where
          the texture answers back, so it gets the room to be understood. */}
      <Variant name="réactif · réticule · promène le curseur" padded={false}>
        <Frame className="h-[26rem]" style={{ background: FLAT.ink }}>
          <FlowField
            {...BASE}
            seed={17}
            intensity={0.95}
            maxSteps={900}
            interactive
            cursor
            influence={120}
            strength={48}
            swirl={0.55}
          />
        </Frame>
      </Variant>
    </Variants>
  ),

  frame: (
    <Variants columns={3}>
      <Variant name="carré" padded={false}>
        <Frame className="aspect-square">
          <FlowField {...BASE} seed={21} maxSteps={600} />
        </Frame>
      </Variant>
      <Variant name="bande" padded={false}>
        <Frame className="h-24">
          <FlowField {...BASE} seed={88} maxSteps={600} fade="sides" />
        </Frame>
      </Variant>
      <Variant name="disque" padded={false}>
        <Frame className="aspect-square rounded-full">
          <FlowField {...BASE} seed={5} maxSteps={500} fade="radial" />
        </Frame>
      </Variant>
    </Variants>
  ),

  etude: (
    <Variants columns={1}>
      <Variant name="avec règle" padded={false}>
        <Etude index="00" title="Exemple" rule="La règle que la composition illustre.">
          <div className="px-6 pb-10">
            <p className="text-sm leading-relaxed">Le contenu de la composition vient ici.</p>
          </div>
        </Etude>
      </Variant>
    </Variants>
  ),
};

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

/** Groups get their section number from their position in the canonical order. */
const groupIndex = (group: Group) => String(GROUP_ORDER.indexOf(group) + 2).padStart(2, "0");

export default function DesignSystemPage() {
  return (
    <SurfaceProvider>
      <main className="min-h-screen bg-background">
        <header className="sticky top-0 z-20 flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-border bg-background/90 px-6 py-4 backdrop-blur md:px-12">
          <Label tone="strong">Système de design</Label>
          <a
            href="/design-system/layouts"
            className="transition-opacity duration-300 hover:opacity-70"
          >
            <Label>layouts →</Label>
          </a>
          <div className="ml-auto flex items-center gap-4">
            <Label className="hidden sm:block">surface</Label>
            <SurfaceSwitch />
          </div>
        </header>

        {/* ============================================================== */}
        {/* Cover                                                          */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-3">
          <div className="flex flex-col justify-end p-6 py-20 md:col-span-2 md:p-12 md:py-28">
            <Label>bibliothèque · fondations · variantes</Label>
            <h2 className="mt-6 text-[clamp(3rem,11vw,9rem)] font-bold leading-[0.82] tracking-tighter">
              SYSTÈME
            </h2>
            <p className="mt-8 max-w-xl leading-relaxed text-muted-foreground">
              Une texture générative tenue en minorité, des aplats francs pour tout le reste, et un
              seul point chaud par écran. Ce qui suit est la bibliothèque qui applique ces règles,
              et les règles elles-mêmes, écrites une seule fois.
            </p>
            <div className="mt-10">
              <Action href="#principes">Les principes</Action>
            </div>
          </div>
          <Frame className="min-h-[16rem] border-l border-border bg-card">
            <FlowField
              {...BASE}
              seed={3}
              intensity={0.95}
              maxSteps={900}
              interactive
              influence={110}
              strength={42}
            />
          </Frame>
        </section>

        <StatGrid className="border-y border-border">
          <StatCell>
            <Stat value={INVENTORY.components} label="composants" />
          </StatCell>
          <StatCell>
            <Stat value={INVENTORY.variants} label="variantes" />
          </StatCell>
          <StatCell>
            <Stat value={INVENTORY.props} label="props documentées" />
          </StatCell>
          <StatCell tone="vermillon">
            <Stat value={FLAT_TOKENS.length} label="tons d'aplat" />
          </StatCell>
        </StatGrid>

        {/* ============================================================== */}
        {/* 01 — Principes                                                 */}
        {/* ============================================================== */}
        <Section
          id="principes"
          index="00"
          title="Principes"
          note="Cinq règles. Tout le reste de cette page n'en est qu'une application."
        >
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <Principle index="01" title="La texture reste minoritaire">
              Elle vit dans des panneaux bornés (un carreau, une bande, un disque) et ne passe
              jamais en fond derrière du texte courant, où elle le rendait illisible.
            </Principle>
            <Principle index="02" title="Un seul point chaud">
              Le vermillon marque une chose à la fois. Trois accents simultanés n&apos;en font
              aucun.
            </Principle>
            <Principle index="03" title="Écrasement d'échelle">
              Du display à l&apos;annotation, un rapport d&apos;environ 25:1, et presque rien entre
              les deux. Remplir ce vide ramènerait le système à la moyenne.
            </Principle>
            <Principle index="04" title="Séparer par un filet">
              Un pixel, ou rien. Ni ombre portée, ni carte arrondie : le rayon par défaut du système
              est zéro.
            </Principle>
            <Principle index="05" title="Le mouvement fait arriver">
              Une fois, lentement, puis plus rien. La seule boucle du système tient dans un bandeau
              de quelques dizaines de pixels.
            </Principle>
          </div>
        </Section>

        {/* ============================================================== */}
        {/* 01 — Fondations                                                */}
        {/* ============================================================== */}
        <Section
          id="fondations"
          index="01"
          title="Fondations"
          note="Les valeurs dont tout le reste est fait. Elles vivent dans src/lib/design/tokens.ts et dans les variables de globals.css : les mêmes nombres des deux côtés."
        >
          <div className="space-y-16">
            <div>
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <h3 className="text-xl tracking-tight">Couleur</h3>
                <Label className="opacity-60">authored en OKLCh · L · C · H</Label>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                L&apos;axe des teintes fait le travail : tous les neutres sont chauds (h ≈ 85) et
                tous les gris qui portent du texte sont froids (h ≈ 250). C&apos;est cette
                séparation qui empêche la page de virer au beige. Un clic copie l&apos;aplat et
                passe à la notation suivante : OKLCh, puis rgb(), puis hexadécimal.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-5">
                {FLAT_TOKENS.map((token) => (
                  <Swatch key={token} token={token} warm={WARM_TOKENS.includes(token)} />
                ))}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <h3 className="text-xl tracking-tight">Rampe de texture</h3>
                <Label className="opacity-60">{PALETTES.machine.label}</Label>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {PALETTES.machine.note}. Les positions sont volontairement inégales : le chaud
                n&apos;occupe que les 20 derniers pourcents, pour qu&apos;un champ rendu se lise
                comme froid avec un accent, et non comme un arc-en-ciel.
              </p>
              <div className="mt-8 flex h-16 border border-border">
                {RAMP.map(([r, g, b], i) => (
                  <span
                    key={`${i}-${r}-${g}-${b}`}
                    className="flex-1"
                    style={{ background: `rgb(${r} ${g} ${b})` }}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl tracking-tight">Typographie</h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                JetBrains Mono partout, display comme annotation. Le trou au milieu de
                l&apos;échelle est le principe, pas un oubli.
              </p>
              <div className="mt-8 divide-y divide-border border-y border-border">
                {TYPE.map((step) => (
                  <div key={step.name} className="grid gap-4 py-8 md:grid-cols-12">
                    <div className="md:col-span-3">
                      <Label tone="strong">{step.name}</Label>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {step.note}
                      </p>
                    </div>
                    <div className="overflow-hidden md:col-span-9">
                      <TypeSpecimen className={step.className} sample={step.sample} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h3 className="text-xl tracking-tight">Trames</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Un dégradé radial répété, sans image ni requête, qui se recolore librement.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-px bg-border">
                  {[8, 12, 18].map((size) => (
                    <div key={size} className="bg-card p-4">
                      <div
                        className="h-20"
                        style={{ background: dotScreen("currentColor", size), opacity: 0.5 }}
                      />
                      <Label numeric className="mt-3 block">
                        {size} px
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl tracking-tight">Mouvement</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Quatre durées. Lentes par système : rien ici n&apos;est en train d&apos;exploser.
                </p>
                <div className="mt-6">
                  <MotionScale />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ============================================================== */}
        {/* 02… — one section per group, straight off the registry         */}
        {/* ============================================================== */}
        {GROUP_ORDER.map((group) => (
          <Section
            key={group}
            id={group}
            index={groupIndex(group)}
            title={GROUPS[group].label}
            note={GROUPS[group].note}
          >
            {byGroup(group).map((spec) => (
              <Spec key={spec.id} spec={spec}>
                {PREVIEWS[spec.id] ?? (
                  <Preview>
                    <Label tone="accent">aperçu manquant</Label>
                  </Preview>
                )}
              </Spec>
            ))}
          </Section>
        ))}

        {/* ============================================================== */}
        {/* Inventaire                                                     */}
        {/* ============================================================== */}
        <Section
          id="inventaire"
          index={String(GROUP_ORDER.length + 2).padStart(2, "0")}
          title="Inventaire"
          note="Compté depuis le registre, jamais saisi à la main : un « 18 composants » écrit en dur est faux le lendemain."
        >
          <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-3 lg:grid-cols-6">
            <Inventory value={INVENTORY.components} label="composants" />
            <Inventory value={INVENTORY.variants} label="variantes" />
            <Inventory value={INVENTORY.props} label="props" />
            <Inventory value={INVENTORY.groups} label="familles" />
            <Inventory value={INVENTORY.server} label="serveur" />
            <Inventory value={INVENTORY.client} label="client" />
          </div>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-border">
                  {["composant", "famille", "fichier", "variantes", "props"].map((head) => (
                    <th key={head} className="py-2 pr-6 font-normal">
                      <Label>{head}</Label>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {REGISTRY.map((spec) => (
                  <tr key={spec.id} className="border-b border-border">
                    <td className="py-3 pr-6">
                      <a
                        href={`#${spec.id}`}
                        className="text-sm transition-opacity hover:opacity-70"
                      >
                        {spec.name}
                      </a>
                    </td>
                    <td className="py-3 pr-6">
                      <Label>{GROUPS[spec.group].label}</Label>
                    </td>
                    <td className="py-3 pr-6 font-mono text-xs text-muted-foreground">
                      {spec.file}
                    </td>
                    <td className="py-3 pr-6 font-mono text-xs tabular-nums text-muted-foreground">
                      {spec.variants.length}
                    </td>
                    <td className="py-3 font-mono text-xs tabular-nums text-muted-foreground">
                      {spec.props.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <footer className="flex flex-wrap items-baseline gap-x-8 gap-y-2 border-t border-border px-6 py-12 md:px-12">
          <Label>système de design</Label>
          <a
            href="/design-system/layouts"
            className="transition-opacity duration-300 hover:opacity-70"
          >
            <Label tone="accent">13 compositions →</Label>
          </a>
          <Label numeric className="ml-auto">
            {INVENTORY.components} composants · {INVENTORY.variants} variantes
          </Label>
        </footer>
      </main>
    </SurfaceProvider>
  );
}
