import { FLAT } from "@/lib/design/tokens";
import { Label } from "@/components/system";
import { cn } from "@/lib/utils";

const ROLES = [
  { code: "ÉCO", name: "Économiste" },
  { code: "JUR", name: "Juriste" },
  { code: "SOC", name: "Sociologue" },
  { code: "FCT", name: "Fact-checker" },
  { code: "HIS", name: "Historien" },
] as const;

const N = ROLES.length;

const COLUMNS = `repeat(${N}, minmax(0,1fr)) minmax(0,1fr)`;

type Panel = Readonly<{
  when: string;
  topology: string;
  peers: boolean;
  caption: string;
}>;

const PANELS: readonly Panel[] = [
  {
    when: "aujourd'hui",
    topology: "Étoile",
    peers: false,
    caption:
      "Chaque expert note sur sa seule dimension et remonte son score. Un désaccord entre deux d'entre eux finit traité comme une moyenne.",
  },
  {
    when: "ce qu'on construirait",
    topology: "Mesh",
    peers: true,
    caption:
      "Chaque expert lit les autres et peut réviser son avis avant que la synthèse ne tranche. Le consensus se construit, il ne se calcule pas.",
  },
];

function Cell({ state, edge }: Readonly<{ state: "on" | "off" | "self"; edge?: boolean }>) {
  return (
    <span
      className={cn(
        "flex aspect-square items-center justify-center bg-background",
        edge && "border-l border-dashed border-border",
      )}
      style={state === "on" ? { background: FLAT.ink } : undefined}
    >
      {state === "self" ? <span className="h-px w-2 bg-border" /> : null}
    </span>
  );
}

function Matrix({ panel }: Readonly<{ panel: Panel }>) {
  const exchanges = panel.peers ? N * (N - 1) : 0;

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between gap-4">
        <Label tone="accent">{panel.when}</Label>
        <Label numeric>
          {exchanges} échange{exchanges > 1 ? "s" : ""}
        </Label>
      </div>
      <p className="mt-3 text-xl leading-snug font-bold tracking-tight md:text-2xl">
        {panel.topology}
      </p>

      <div aria-hidden="true" className="mt-6 flex gap-2">
        <div className="flex w-14 shrink-0 flex-col">
          <div className="h-5" />
          <div
            className="grid flex-1 gap-px border border-transparent"
            style={{ gridTemplateRows: `repeat(${N}, minmax(0,1fr))` }}
          >
            {ROLES.map((role, i) => (
              <span key={role.code} className="flex items-center">
                <Label numeric={panel.peers}>
                  {panel.peers ? String(i + 1).padStart(2, "0") : role.code}
                </Label>
              </span>
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div
            className="grid h-5 items-center gap-px px-px"
            style={{ gridTemplateColumns: COLUMNS }}
          >
            {ROLES.map((role, i) => (
              <span key={role.code} className="text-center">
                <Label numeric={panel.peers}>
                  {panel.peers ? String(i + 1).padStart(2, "0") : role.code}
                </Label>
              </span>
            ))}
            <span className="border-l border-dashed border-border text-center">
              <Label>syn</Label>
            </span>
          </div>

          <div
            className="grid gap-px border border-border bg-border"
            style={{ gridTemplateColumns: COLUMNS }}
          >
            {ROLES.map((row, i) => (
              <Row key={row.code} index={i} peers={panel.peers} />
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm leading-relaxed">{panel.caption}</p>
    </div>
  );
}

function Row({ index, peers }: Readonly<{ index: number; peers: boolean }>) {
  const peerState = (j: number) => {
    if (j === index) return "self" as const;
    return peers ? ("on" as const) : ("off" as const);
  };

  return (
    <>
      {ROLES.map((col, j) => (
        <Cell key={col.code} state={peerState(j)} />
      ))}
      <Cell state="on" edge />
    </>
  );
}

export function AgentMesh({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn("grid gap-14 md:grid-cols-2 md:gap-16", className)}>
      {PANELS.map((panel) => (
        <Matrix key={panel.when} panel={panel} />
      ))}
    </div>
  );
}
