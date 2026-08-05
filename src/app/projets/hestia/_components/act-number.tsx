import { cn } from "@/lib/utils";

/**
 * Le rang de l'acte, en clair et dans le flux.
 *
 * Le corps, l'interlignage et la graisse viennent de l'appelant, parce qu'ils
 * se règlent contre le titre d'à côté et non dans l'absolu — voir `ACT_MARK`
 * dans `act.section.tsx`, où le rapport est posé une fois.
 *
 * Tabulaire alors que le chiffre ne change jamais en place : c'est le réglage
 * par défaut du système pour tout chiffre, et à ce corps un « 0 » plus étroit
 * qu'un « 1 » se verrait immédiatement.
 */
export function ActNumber({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <p className={cn("tracking-tighter tabular-nums", className)}>{children}</p>;
}
