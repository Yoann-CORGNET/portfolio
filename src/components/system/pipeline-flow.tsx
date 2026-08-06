import { Fragment } from "react";
import { FLAT } from "@/lib/design/tokens";
import { Label, Tooltip } from "./primitives";
import { cn } from "@/lib/utils";

/**
 * A pipeline of steps, each a rail of cards, joined by fans that show how
 * many cards feed into how many. Desktop draws it as a timeline; below `md`
 * it unfolds into a plain vertical list, since a multi-column diagram has
 * nothing left to compress on a narrow screen.
 *
 * Nothing about the pipeline's shape is fixed here — not its stage count,
 * not how many cards a stage holds, not what a card says. Two things a step
 * does choose:
 *
 *  — **how many cards it holds.** A step with one card reads as a single
 *    checkpoint; a step with several fans the timeline out or in around it —
 *    that fan is what `Comb` draws between two adjacent steps.
 *  — **how its cards reveal themselves on hover** (`hover`), and **whether
 *    each card is one face or two side by side** (`cards[].cells`). A
 *    two-cell card is what lets one step claim two node numbers in the
 *    running count — the two cells sit under two headings instead of one,
 *    without being two separate steps or two rows.
 */

export type PipelineFlowHoverStyle = "tip" | "unfold";

export type PipelineFlowCell = Readonly<{
  /** Revealed on hover, in the step's hover style. */
  reveal: string;
  /** `"tip"` hover only: an italic quoted example under the reveal body. */
  example?: string;
}>;

export type PipelineFlowCard = Readonly<{
  key: string;
  /**
   * The card's always-visible title, shown once above the first cell. On a
   * two-cell card the second cell reserves the same space with an invisible
   * duplicate, so both cells' reveals start at the same vertical offset.
   */
  lead: string;
  cells: readonly [PipelineFlowCell] | readonly [PipelineFlowCell, PipelineFlowCell];
}>;

export type PipelineFlowStep = Readonly<{
  key: string;
  /**
   * One heading per cell-slot — length must match every card's `cells`
   * length in this step: one heading for a plain step, two for a step whose
   * cards are split in half. Each heading consumes one number in the
   * pipeline's running 01, 02, 03… count.
   */
  headings: readonly [string] | readonly [string, string];
  /** How this step's cards reveal their content on hover. */
  hover: PipelineFlowHoverStyle;
  /** Column weight relative to the other steps, in `fr` units. Default 1 —
   *  raise it for a step whose cards need more width than a single-cell
   *  step (a two-cell step usually does). */
  weight?: number;
  cards: readonly PipelineFlowCard[];
}>;

const railY = (i: number, n: number) => ((i + 0.5) / n) * 100;

const columnTemplate = (steps: readonly PipelineFlowStep[]) =>
  steps.map((step) => `minmax(0,${step.weight ?? 1}fr)`).join(" 2.5rem ");

/** The node number each step starts at, given every step before it consumes
 *  one number per heading. */
const startIndices = (steps: readonly PipelineFlowStep[]) => {
  const starts: number[] = [];
  let next = 1;
  for (const step of steps) {
    starts.push(next);
    next += step.headings.length;
  }
  return starts;
};

const CARD = "relative flex h-16 w-full items-center border border-border bg-background";
const CARD_LEAD = "text-lg leading-snug font-bold tracking-tight";

// `overflow-hidden` on the child is what makes the grid-rows animation work:
// without it, content overflows a zero-height row instead of being clipped.
const UNFOLD =
  "grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr] motion-reduce:transition-none";
const UNFOLD_TEXT =
  "opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:transition-none";

// The bubble itself is the system's `Tooltip`; only its contents belong here.
// They are spans rather than paragraphs because `Tooltip` renders a `<span>`,
// so that it can also be dropped inside running text — see its own docs.
function Tip({
  cells,
  className,
}: Readonly<{ cells: readonly PipelineFlowCell[]; className?: string }>) {
  return (
    <Tooltip className={className}>
      {cells.map((cell, i) => (
        <span key={i} className={cn("block", i > 0 && "mt-2 border-t border-border pt-2")}>
          <span className="block text-xs leading-relaxed">{cell.reveal}</span>
          {cell.example ? (
            <span className="mt-2 block border-t border-border pt-2 text-right text-xs leading-relaxed text-muted-foreground italic">
              « {cell.example} »
            </span>
          ) : null}
        </span>
      ))}
    </Tooltip>
  );
}

function Comb({ from, to }: Readonly<{ from: number; to: number }>) {
  const left = Array.from({ length: from }, (_, i) => railY(i, from));
  const right = Array.from({ length: to }, (_, i) => railY(i, to));
  const all = [...left, ...right];
  const top = Math.min(...all);
  const bottom = Math.max(...all);

  return (
    <div aria-hidden="true" className="relative">
      {left.map((y) => (
        <span
          key={`l-${y}`}
          className="absolute left-0 h-px w-1/2"
          style={{ top: `${y}%`, background: FLAT.vermillon }}
        />
      ))}
      <span
        className="absolute left-1/2 w-px"
        style={{ top: `${top}%`, height: `${bottom - top}%`, background: FLAT.vermillon }}
      />
      {right.map((y) => (
        <span
          key={`r-${y}`}
          className="absolute right-0 h-px w-1/2"
          style={{ top: `${y}%`, background: FLAT.vermillon }}
        />
      ))}
    </div>
  );
}

function NodeName({ index, name }: Readonly<{ index: number; name: string }>) {
  return (
    <Label tone="accent" numeric>
      {String(index).padStart(2, "0")} · {name}
    </Label>
  );
}

function Corridor({ at }: Readonly<{ at: string }>) {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-y-0 w-0 border-l border-dashed border-border"
      style={{ left: at }}
    />
  );
}

function TipCard({ lead, cells }: Readonly<{ lead: string; cells: readonly PipelineFlowCell[] }>) {
  return (
    <div className={cn("group", CARD, "px-4")}>
      <p className={CARD_LEAD}>{lead}</p>
      <Tip cells={cells} />
    </div>
  );
}

function UnfoldCard({
  lead,
  cells,
}: Readonly<{ lead: string; cells: readonly PipelineFlowCell[] }>) {
  const split = cells.length > 1;
  return (
    <div className={cn("group", CARD, "grid h-24", split && "grid-cols-2")}>
      {cells.map((cell, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center px-4",
            split && i === 0 && "border-r border-dashed border-border",
          )}
        >
          <div className="w-full">
            <p aria-hidden={i > 0 || undefined} className={cn(CARD_LEAD, i > 0 && "invisible")}>
              {lead}
            </p>
            <div className={UNFOLD}>
              <div className="overflow-hidden">
                <p
                  className={cn(
                    "pt-2 text-xs leading-snug",
                    i > 0 && "text-muted-foreground",
                    UNFOLD_TEXT,
                  )}
                >
                  {cell.reveal}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StepRail({ step }: Readonly<{ step: PipelineFlowStep }>) {
  const cellCount = step.headings.length;

  const rail = (
    <div
      className="relative grid h-full"
      style={{ gridTemplateRows: `repeat(${step.cards.length}, minmax(0,1fr))` }}
    >
      {step.cards.map((card) => (
        <div key={card.key} className="flex items-center">
          {step.hover === "tip" ? (
            <TipCard lead={card.lead} cells={card.cells} />
          ) : (
            <UnfoldCard lead={card.lead} cells={card.cells} />
          )}
        </div>
      ))}
    </div>
  );

  if (cellCount < 2) return rail;

  return (
    <div className="relative">
      {Array.from({ length: cellCount + 1 }, (_, i) => (
        <Corridor key={i} at={`${(i / cellCount) * 100}%`} />
      ))}
      {rail}
    </div>
  );
}

export function PipelineFlow({
  steps,
  className,
}: Readonly<{ steps: readonly PipelineFlowStep[]; className?: string }>) {
  const starts = startIndices(steps);
  const columns = columnTemplate(steps);

  return (
    <div className={className}>
      {/* Desktop — full timeline */}
      <div className="hidden md:block">
        <div className="grid" style={{ gridTemplateColumns: columns }}>
          {steps.map((step, i) => (
            <Fragment key={step.key}>
              {i > 0 ? <span /> : null}
              {step.headings.length === 2 ? (
                <div className="grid grid-cols-2">
                  <NodeName index={starts[i]} name={step.headings[0]} />
                  <NodeName index={starts[i] + 1} name={step.headings[1]} />
                </div>
              ) : (
                <NodeName index={starts[i]} name={step.headings[0]} />
              )}
            </Fragment>
          ))}
        </div>

        <div className="mt-4 grid min-h-[38rem]" style={{ gridTemplateColumns: columns }}>
          {steps.map((step, i) => (
            <Fragment key={step.key}>
              {i > 0 ? <Comb from={steps[i - 1].cards.length} to={step.cards.length} /> : null}
              <StepRail step={step} />
            </Fragment>
          ))}
        </div>
      </div>

      {/* Mobile — unfolded, everything readable up front. The dot and the
          label live in their own flex row with `items-center`, which centers
          them on each other by construction regardless of the label's exact
          line-height — no hand-tuned offset to keep in sync if the type
          scale changes. The rail sits in a second row below, in a column of
          the same width as the dot's, so it lines up under it; each segment
          belongs to the step above it and stops there, rather than one
          border spanning the whole list from its top edge regardless of
          where the first dot is. */}
      <ol className="md:hidden">
        {steps.map((step, i) => (
          <li key={step.key}>
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0"
                style={{ background: FLAT.vermillon }}
              />
              <NodeName index={starts[i]} name={step.headings.join(" & ")} />
            </div>
            <div className={cn("flex gap-4", i < steps.length - 1 && "pb-10")}>
              <div className="flex w-2.5 shrink-0 justify-center">
                {i < steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="w-px flex-1"
                    style={{ background: FLAT.vermillon }}
                  />
                ) : null}
              </div>
              <ul className="min-w-0 flex-1 space-y-2 pt-3">
                {step.cards.map((card) => (
                  <li key={card.key} className="border border-border px-4 py-3">
                    <p className="font-bold tracking-tight">{card.lead}</p>
                    {card.cells.map((cell, ci) => (
                      <div key={ci}>
                        <p
                          className={cn(
                            "mt-1 text-sm leading-snug",
                            (step.hover === "tip" || ci > 0) && "text-muted-foreground",
                          )}
                        >
                          {cell.reveal}
                        </p>
                        {cell.example ? (
                          <p className="mt-2 border-t border-border pt-2 text-right text-sm leading-snug text-muted-foreground italic">
                            « {cell.example} »
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
