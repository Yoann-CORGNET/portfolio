import type { ReactNode } from "react";
import { ProjectSectionTitle } from "@/app/projets/_components/project-section-title";
import { cn } from "@/lib/utils";

/**
 * The two-column `grid-cols-12` header shared by Kheiroton-IA's sections:
 * a title in a 5-wide column, a lead paragraph in the remaining 7. Typography
 * is caller-supplied so this stays reusable beyond that page's type scale.
 */
export function SplitHeader({
  titleLines,
  titleClassName,
  lead,
  leadClassName,
  className,
}: Readonly<{
  titleLines: readonly string[];
  titleClassName: string;
  lead: ReactNode;
  leadClassName: string;
  className?: string;
}>) {
  return (
    <div className={cn("grid gap-8 md:grid-cols-12 md:gap-16", className)}>
      <ProjectSectionTitle lines={titleLines} className={cn(titleClassName, "md:col-span-5")} />
      <div className="md:col-span-7">
        <p className={leadClassName}>{lead}</p>
      </div>
    </div>
  );
}
