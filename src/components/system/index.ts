/**
 * The library's single import surface.
 *
 * Everything that consumes the system imports from `@/components/system` and never
 * reaches into a file directly. That is what lets a component move between
 * files — primitive to control, say, once it grows state — without touching a
 * single call site.
 */

export { Label, Rule, Tag, Action, FlatBlock, Tooltip, Watermark, Bracketed } from "./primitives";
export type { LabelTone, ActionVariant, ActionSize, ActionState } from "./primitives";

export { Logo } from "./logo";

export { Frame, Etude } from "./layout";

export { Stat, StatGrid, StatCell, Meter } from "./stats";
export type { StatSize } from "./stats";

export { Reveal, Marquee } from "./motion";

export { HoverIndex, Segmented, Preview, SurfaceProvider, SurfaceSwitch } from "./controls";
export type { Surface } from "./controls";

export { OverlapCascade, OverlapTriangle } from "./overlap";
export type { OverlapLabels } from "./overlap";

export { PipelineFlow } from "./pipeline-flow";
export type {
  PipelineFlowHoverStyle,
  PipelineFlowCell,
  PipelineFlowCard,
  PipelineFlowStep,
} from "./pipeline-flow";

export { FlowField } from "./flow-field";
export type { FlowFieldProps, FlowFieldFade } from "./flow-field";
