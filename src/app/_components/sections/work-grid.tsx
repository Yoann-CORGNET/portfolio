import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FlatBlock, Label, Reveal, Rule } from "@/components/system";
import { cn } from "@/lib/utils";

type Work = {
  id: string;
  name: string;
  line: string;
  href: string;
  // rust rather than vermillon: cream-on-vermillon is 3.64 contrast (below
  // the 4.5 required for body text); rust reaches 5.43.
  // cream is 0.94 lightness vs 0.965 page background (only 0.025 apart),
  // too little to read as a surface on its own — hence `edge` below.
  surface: "rust" | "ink" | "petrol" | "sand" | "cream";
  year: string;
  dots?: boolean;
  edge?: boolean;
  span: string;
  floor: string;
  lineBox: string;
  nameSize?: string;
};

const WORK: readonly Work[] = [
  {
    id: "hestia",
    name: "Hestia",
    year: "2026",
    line: "Un SaaS en production où l'architecture évolue avec le métier, plutôt que contre lui.",
    href: "/projets/hestia",
    surface: "rust",
    dots: true,
    span: "md:col-span-7",
    floor: "min-h-[28rem]",
    lineBox: "md:min-h-[4.875rem]",
    nameSize: "text-4xl md:text-5xl",
  },
  {
    id: "undrive",
    name: "Undrive",
    year: "2025",
    line: "Du concept au déploiement : besoins utilisateurs, ingénierie et livraison tenus ensemble.",
    href: "/projets/undrive",
    surface: "petrol",
    span: "md:col-span-5",
    floor: "min-h-[28rem]",
    lineBox: "md:min-h-[4.875rem]",
  },
  {
    id: "stockelec",
    name: "StockElec",
    year: "2023",
    line: "Hériter d'un codebase, tenir le dialogue avec le client, préparer le logiciel pour l'équipe suivante.",
    href: "/projets/stockelec",
    surface: "ink",
    span: "md:col-span-6",
    floor: "min-h-[22rem]",
    lineBox: "md:min-h-[6.5rem]",
  },
  {
    id: "kheiroton",
    name: "Kheiroton-IA",
    year: "2026",
    line: "L'IA peut-elle éclairer sans désinformer ?\nTrois jours pour transformer une question en système.",
    href: "/projets/kheiroton-ia",
    surface: "cream",
    edge: true,
    span: "md:col-span-6",
    floor: "min-h-[22rem]",
    lineBox: "md:min-h-[6.5rem]",
    nameSize: "text-2xl md:text-3xl",
  },
];

const WORK_NAME_SIZE = "text-3xl md:text-4xl";

function WorkTileBody({ item }: Readonly<{ item: Work }>) {
  return (
    <>
      <div className="flex items-baseline">
        <span className="opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 motion-reduce:transition-none">
          <Label numeric tone="inherit">
            {item.year}
          </Label>
        </span>
        <ArrowUpRight
          className={cn(
            "ml-auto h-4 w-4 shrink-0 transition-transform duration-300",
            "group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
          )}
          style={{ opacity: 0.9 }}
        />
      </div>

      <div className="mt-auto pt-10">
        <p
          className={cn(
            "font-heading font-bold leading-[0.95] tracking-tighter",
            item.nameSize ?? WORK_NAME_SIZE,
          )}
        >
          {item.name}
        </p>
        {/* Full opacity: at 0.88 the line dropped below 4.5 contrast on
            petrol (5.86 -> 4.92) and on the warm surface (3.64 -> 3.12). */}
        <p className={cn("mt-4 max-w-md leading-relaxed whitespace-pre-line", item.lineBox)}>
          {item.line}
        </p>
      </div>
    </>
  );
}

// `grid` on `FlatBlock` makes it stretch to the content height: `FlatBlock`
// wraps children in a div we don't control, and in grid layout that div
// becomes the sole grid item and stretches — in flow layout it would stop at
// content height and the `mt-auto` below would push nothing.
function WorkTile({ item }: Readonly<{ item: Work }>) {
  return (
    <Link
      href={item.href}
      id={item.id}
      className="group relative flex w-full scroll-mt-24 hover:z-10"
    >
      <FlatBlock
        tone={item.surface}
        dots={item.dots}
        className={cn(
          "grid w-full",
          item.floor,
          item.edge && "border border-border",
          // 1.5% of the widest tile is ~5px overflow per edge, a third of the
          // 16px gutter, so the hover scale never touches the neighbor.
          "transition-transform duration-700 ease-out group-hover:scale-[1.015]",
          "motion-reduce:transition-none motion-reduce:group-hover:scale-100",
        )}
      >
        <div className="relative flex h-full flex-col p-7 md:p-8">
          <WorkTileBody item={item} />
          <TileCorners />
        </div>
      </FlatBlock>
    </Link>
  );
}

function TileCorners() {
  const corner = "absolute h-3 w-3 border-current/25";
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-3 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 motion-reduce:transition-none"
    >
      <span className={cn(corner, "left-0 top-0 border-l border-t")} />
      <span className={cn(corner, "right-0 top-0 border-r border-t")} />
      <span className={cn(corner, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(corner, "bottom-0 right-0 border-b border-r")} />
    </span>
  );
}

export function WorkGrid() {
  return (
    <section id="travail" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          {/* 20 chars at ~0.55em effective width needs 11em, so the clamp
              floor stops at 1.5rem to keep the nowrap line inside a 375px
              viewport. */}
          <h2 className="text-[clamp(1.5rem,5vw,3.5rem)] font-bold leading-[0.95] tracking-tighter">
            {["Expériences qui ont", "façonné mon approche"].map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h2>
        </Reveal>

        <div className="mt-10">
          <Rule />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-12">
          {WORK.map((item, i) => (
            <Reveal key={item.id} delay={i * 60} className={cn("flex", item.span)}>
              <WorkTile item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
