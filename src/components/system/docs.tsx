/**
 * The chrome the system documents itself in.
 *
 * These are not part of the library — nothing outside `/design-system` should
 * import them. They exist so that every component is presented the same way:
 * name, purpose, variants side by side, then the props that produced them. The
 * uniformity is the point. A page where each component is introduced in its own
 * bespoke way is a gallery, not a system.
 */

import type { ComponentSpec } from "@/lib/design/registry";
import { cn } from "@/lib/utils";
import { Label, Rule } from "./primitives";
import { Preview } from "./controls";

/* `Swatch` is chrome like everything else here, but it holds state, so it lives
   in its own client file and is re-exported to keep one import for the page. */
export { Swatch } from "./swatch";

/** A top-level division of the page. */
export function Section({
  id,
  index,
  title,
  note,
  children,
}: Readonly<{
  id: string;
  index: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}>) {
  return (
    <section id={id} className="scroll-mt-16 border-t border-border px-6 py-20 md:px-12">
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <Label numeric tone="accent">
          {index}
        </Label>
        <h2 className="text-3xl leading-tight tracking-tight">{title}</h2>
      </div>
      {note ? <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{note}</p> : null}
      <div className="mt-12">{children}</div>
    </section>
  );
}

/**
 * One component's entry: identity, purpose, previews, props.
 *
 * `spec` comes from the registry rather than from props typed at the call site,
 * so an entry cannot drift from the list the inventory is counted off.
 */
export function Spec({
  spec,
  children,
}: Readonly<{ spec: ComponentSpec; children: React.ReactNode }>) {
  return (
    <article
      id={spec.id}
      className="scroll-mt-16 border-t border-border py-12 first:border-t-0 first:pt-0"
    >
      <div className="grid gap-8 md:grid-cols-12">
        <header className="md:col-span-4">
          <div className="flex flex-wrap items-baseline gap-3">
            <h3 className="text-xl tracking-tight">{spec.name}</h3>
            <Label className="opacity-60">{spec.client ? "client" : "serveur"}</Label>
          </div>
          <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">{spec.purpose}</p>
          <p className="mt-4 font-mono text-[10px] text-muted-foreground opacity-60">
            system/{spec.file}
          </p>
        </header>
        <div className="md:col-span-8">{children}</div>
      </div>
      {spec.props.length > 0 ? (
        <div className="mt-10 md:ml-[33.333%] md:pl-8">
          <PropsTable spec={spec} />
        </div>
      ) : null}
    </article>
  );
}

/**
 * A labelled preview cell.
 *
 * The caption sits *outside* the preview surface, so it never has to be styled
 * for both cream and ink — and so it can never be mistaken for part of the
 * component being shown.
 */
export function Variant({
  name,
  children,
  className,
  padded,
}: Readonly<{
  name: string;
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}>) {
  return (
    <div>
      <Label className="opacity-60">{name}</Label>
      <Preview className={cn("mt-2", className)} padded={padded}>
        {children}
      </Preview>
    </div>
  );
}

/** Lays variants out side by side so they are compared, not scrolled between. */
export function Variants({
  children,
  columns = 2,
}: Readonly<{
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
}>) {
  const cols = { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3" }[columns];
  return <div className={cn("grid grid-cols-1 gap-6", cols)}>{children}</div>;
}

/** The props a component accepts, and the default it falls back to. */
export function PropsTable({ spec }: Readonly<{ spec: ComponentSpec }>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-left">
        <thead>
          <tr className="border-b border-border">
            {["prop", "type", "défaut", "rôle"].map((head) => (
              <th key={head} className="py-2 pr-6 font-normal">
                <Label>{head}</Label>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {spec.props.map((prop) => (
            <tr key={prop.name} className="border-b border-border align-top">
              <td className="py-3 pr-6 font-mono text-xs">{prop.name}</td>
              <td className="py-3 pr-6 font-mono text-xs text-muted-foreground">{prop.type}</td>
              <td className="py-3 pr-6 font-mono text-xs text-muted-foreground">
                {prop.fallback ?? "—"}
              </td>
              <td className="max-w-sm py-3 text-xs leading-relaxed text-muted-foreground">
                {prop.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A figure about the system itself. */
export function Inventory({ value, label }: Readonly<{ value: number | string; label: string }>) {
  return (
    <div className="flex flex-col gap-3 bg-background p-6">
      <Label>{label}</Label>
      <span className="text-4xl font-bold tabular-nums leading-none tracking-tighter">{value}</span>
    </div>
  );
}

/** A one-line law of the system, numbered. */
export function Principle({
  index,
  title,
  children,
}: Readonly<{
  index: string;
  title: string;
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Label numeric tone="accent">
        {index}
      </Label>
      <p className="mt-3 text-xl leading-tight tracking-tight">{title}</p>
      <Rule className="my-4 opacity-40" />
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}
