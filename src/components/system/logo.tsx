import { LOGO_PATHS, LOGO_SCHEMES, type LogoScheme } from "@/lib/design/brand";
import { FLAT } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

/**
 * The mark, coloured from the palette.
 *
 * Nothing about the drawing lives here — the paths and the schemes are data in
 * `lib/design/brand.ts`, next to the tokens they are written in terms of. This
 * only turns a scheme into fills, which is why recolouring the brand never
 * means opening an SVG.
 */
export function Logo({
  scheme = "duo",
  label,
  className,
}: Readonly<{
  scheme?: LogoScheme;
  /** Set when the mark stands alone. Omitted, it is hidden from screen readers. */
  label?: string;
  className?: string;
}>) {
  const { tones } = LOGO_SCHEMES[scheme];

  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("block h-10 w-10", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {LOGO_PATHS.map((path, i) => (
        <path key={path.id} d={path.d} fill={FLAT[tones[i]]} />
      ))}
    </svg>
  );
}
