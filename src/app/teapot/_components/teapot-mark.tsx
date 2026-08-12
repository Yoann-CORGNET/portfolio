import { FLAT } from "@/lib/design/tokens";

/**
 * The system draws in flat blocks and hairlines, never curves, so the
 * teapot is built the same way: straight-edged polygons, no rounded belly.
 * Steam is the one thing allowed to drift, via `.animate-steam` in
 * `globals.css`, staggered per stroke so the wisp reads as continuous.
 */
export function TeapotMark({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      viewBox="0 0 200 110"
      className={className}
      role="img"
      aria-label="Théière en aplats géométriques, avec de la vapeur qui s'échappe du bec"
    >
      <line
        x1="118"
        y1="30"
        x2="118"
        y2="18"
        stroke={FLAT.ink}
        strokeWidth="3"
        strokeLinecap="square"
        className="animate-steam"
        style={{ animationDelay: "0s" }}
      />
      <line
        x1="126"
        y1="30"
        x2="130"
        y2="14"
        stroke={FLAT.ink}
        strokeWidth="3"
        strokeLinecap="square"
        className="animate-steam"
        style={{ animationDelay: "0.6s" }}
      />
      <line
        x1="110"
        y1="30"
        x2="106"
        y2="16"
        stroke={FLAT.ink}
        strokeWidth="3"
        strokeLinecap="square"
        className="animate-steam"
        style={{ animationDelay: "1.2s" }}
      />

      {/* Lid */}
      <rect x="80" y="34" width="36" height="8" fill={FLAT.rust} />
      <rect x="94" y="26" width="8" height="8" fill={FLAT.rust} />

      {/* Body */}
      <polygon points="60,42 136,42 146,96 50,96" fill={FLAT.vermillon} />

      {/* Spout */}
      <polygon points="136,54 168,44 168,54 144,68" fill={FLAT.vermillon} />

      {/* Handle */}
      <polygon points="50,54 40,54 34,88 44,96 50,88 42,86 46,58" fill={FLAT.vermillon} />

      {/* Base */}
      <rect x="46" y="96" width="104" height="8" fill={FLAT.charcoal} />
    </svg>
  );
}
