import { FLAT } from "@/lib/design/tokens";
import { Label } from "@/components/system";
import { cn } from "@/lib/utils";

const UNITS = 10;

type Row = Readonly<{
  label: string;
  cells: number;
  note: string;
  hot?: boolean;
}>;

const ROWS: readonly Row[] = [
  {
    label: "Produire une contre-vérité",
    cells: 1,
    note: "Une phrase. Aucune source à réunir, aucune contradiction à lever.",
    hot: true,
  },
  {
    label: "La réfuter, la sourcer, la publier",
    cells: UNITS,
    note: "Le même temps humain qu'avant l'IA — la charge n'a pas bougé d'un cran.",
  },
];

function Bar({ row }: Readonly<{ row: Row }>) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <Label tone={row.hot ? "accent" : "strong"}>{row.label}</Label>
        <Label numeric>
          {row.cells}/{UNITS}
        </Label>
      </div>
      <div className="mt-3 flex gap-1" aria-hidden="true">
        {Array.from({ length: UNITS }, (_, i) => (
          <span
            key={`cell-${i}`}
            className={cn(
              "h-10 flex-1 border",
              i < row.cells ? "border-transparent" : "border-border",
            )}
            style={
              i < row.cells
                ? { background: row.hot ? FLAT.vermillon : FLAT.ink }
                : { background: "transparent" }
            }
          />
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{row.note}</p>
    </div>
  );
}

export function BrandoliniScale({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn("grid gap-10 md:grid-cols-12 md:items-end md:gap-16", className)}>
      <div className="space-y-10 md:col-span-8">
        {ROWS.map((row) => (
          <Bar key={row.label} row={row} />
        ))}
      </div>

      <div className="md:col-span-4">
        <p className="text-[clamp(3.5rem,12vw,7rem)] leading-[0.8] font-bold tracking-tighter tabular-nums">
          ×10
        </p>
        <p className="mt-4 text-sm leading-relaxed">
          L&apos;énergie qu&apos;il faut pour réfuter une bêtise est d&apos;un ordre de grandeur
          supérieure à celle qu&apos;il a fallu pour la produire.
        </p>
        <Label className="mt-3 block">loi de Brandolini</Label>
      </div>
    </div>
  );
}
