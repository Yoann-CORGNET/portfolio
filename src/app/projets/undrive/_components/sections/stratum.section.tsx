import type React from "react";
import { FlatBlock, Label } from "@/components/system";
import { FLAT } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import { LAYERS, STEP_REM, type Layer } from "../layers";

export function Lesson({
  children,
  className,
}: Readonly<{ children: string; className?: string }>) {
  return (
    <div className={className}>
      <Label tone="inherit" className="opacity-60">
        ce que ça force
      </Label>
      <span
        aria-hidden="true"
        className="mt-4 block h-px w-10"
        style={{ background: FLAT.vermillon }}
      />
      <p className="mt-4 text-xl tracking-tight">{children}</p>
    </div>
  );
}

function Stratum({ layer, depth }: Readonly<{ layer: Layer; depth: number }>) {
  const onFlat = layer.tone !== null;
  const pad = "py-16 md:py-24";

  const body = (
    <div className="mx-auto max-w-6xl px-6">
      <div
        className="border-l border-current/30 pl-6 md:ml-[var(--depth)] md:pl-10"
        style={{ "--depth": `${depth * STEP_REM}rem` } as React.CSSProperties}
      >
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <span
              aria-hidden="true"
              className="block select-none text-[clamp(3rem,8vw,4.5rem)] font-bold leading-[0.8] tracking-tighter tabular-nums"
              style={{ opacity: layer.mark }}
            >
              {layer.index}
            </span>
            <h2 className="mt-4 text-2xl font-bold leading-[0.95] tracking-tighter md:text-3xl">
              {layer.title}
            </h2>
          </div>
          <div className="lg:col-span-8">
            <p
              className={cn("max-w-xl text-lg leading-relaxed", !onFlat && "text-muted-foreground")}
              style={onFlat ? { color: "inherit", opacity: 0.86 } : undefined}
            >
              {layer.body}
            </p>
            <Lesson className="mt-10">{layer.forces}</Lesson>
          </div>
        </div>
      </div>
    </div>
  );

  if (layer.tone === null) {
    return <div className={cn(pad, "bg-background")}>{body}</div>;
  }

  return (
    <FlatBlock tone={layer.tone} className={pad}>
      {body}
    </FlatBlock>
  );
}

export function DescentSection() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 pb-12 pt-16 md:pb-16 md:pt-24">
        {/* Rust et non `tone="accent"` : le vermillon du système ne donne
            que 3,86 de contraste sur le papier de la page, sous le seuil de
            4,5 qu'un texte de dix pixels réclame — rust, une clarté plus
            bas, remonte le rapport à 5,77. */}
        <Label style={{ color: FLAT.rust }}>de l&apos;idée jusqu&apos;à la machine</Label>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed">
          Il n&apos;y a pas de méthode à réciter. Une idée devient un produit en tombant : chaque
          couche hérite d&apos;une contrainte posée par celle du dessus, et aucune ne se saute sans
          que la suivante la paie. La dernière rend la contrainte dans l&apos;autre sens : rien de
          ce qui est au-dessus ne fonctionne tant qu&apos;elle n&apos;est pas debout.
        </p>
      </div>

      {LAYERS.map((layer, i) => (
        <Stratum key={layer.index} layer={layer} depth={i} />
      ))}
    </section>
  );
}
