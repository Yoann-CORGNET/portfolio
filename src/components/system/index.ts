/**
 * The library's single import surface.
 *
 * Everything that consumes the system imports from `@/components/system` and never
 * reaches into a file directly. That is what lets a component move between
 * files — primitive to control, say, once it grows state — without touching a
 * single call site.
 */

export { Label, Rule, Tag, Action, FlatBlock, Bracketed } from "./primitives";
export type { LabelTone, ActionVariant, ActionSize, ActionState } from "./primitives";

export { Logo } from "./logo";

export { Frame, Etude } from "./layout";

export { Stat, StatGrid, StatCell, Meter } from "./stats";
export type { StatSize } from "./stats";

export { Reveal, StaggerHeading, Marquee } from "./motion";

export { HoverIndex, Segmented, Preview, SurfaceProvider, SurfaceSwitch } from "./controls";
export type { Surface } from "./controls";

export { FlowField } from "./flow-field";
export type { FlowFieldProps, FlowFieldFade } from "./flow-field";
