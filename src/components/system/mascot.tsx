import {
  HEAD,
  MASCOT_EMOJIS,
  MASCOT_FACES,
  MASCOT_HEAD_SCHEMES,
  SCREEN,
  SHAPE_TONES,
  type MascotEmojiId,
  type MascotFaceId,
  type MascotHeadSchemeId,
  type Shape,
} from "@/lib/design/mascot-shapes";
import { FLAT, type FlatToken } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

/**
 * Prompt, la mascotte, à plat.
 *
 * Comme pour la marque, rien du dessin ne vit ici : les tracés et les schémas
 * sont des données dans `lib/design/mascot-shapes.ts`. Ce fichier ne fait que
 * les peindre. Le volume (poses, rotation) est un autre support et reste en
 * dehors de la bibliothèque.
 */

type A11y = { role?: "img"; "aria-label"?: string; "aria-hidden"?: true };

/** Un SVG seul porte son nom ; posé à côté d'un texte qui le dit déjà, il se tait. */
function a11y(label?: string): A11y {
  return label ? { role: "img", "aria-label": label } : { "aria-hidden": true };
}

const flat = (token: FlatToken) => FLAT[token];

/**
 * Les traits d'un visage. `force` repeint tout dans un seul ton, pour les
 * schémas monochromes.
 */
function Shapes({
  shapes,
  force,
  dx = 0,
  dy = 0,
}: Readonly<{ shapes: readonly Shape[]; force?: FlatToken | null; dx?: number; dy?: number }>) {
  // Un trait n'a pas de nom ; sa géométrie, unique dans un visage, lui sert de clé.
  return shapes.map((shape) => {
    const fill = flat(force ?? SHAPE_TONES[shape.tone]);
    if (shape.kind === "poly") {
      const points = shape.points.map(([x, y]) => `${(x + dx).toFixed(2)},${(y + dy).toFixed(2)}`);
      const d = points.join(" ");
      return <polygon key={d} points={d} fill={fill} />;
    }
    const cx = shape.x + dx;
    const cy = shape.y + dy;
    return (
      <rect
        key={`${shape.x},${shape.y},${shape.w},${shape.h},${shape.rot}`}
        x={cx - shape.w / 2}
        y={cy - shape.h / 2}
        width={shape.w}
        height={shape.h}
        fill={fill}
        transform={
          shape.rot ? `rotate(${((shape.rot * 180) / Math.PI).toFixed(2)} ${cx} ${cy})` : undefined
        }
      />
    );
  });
}

/**
 * Le chargement tourne par crans de 45°, jamais en continu : un mouvement
 * lisse dirait « animation », les crans disent « processus ». Coupé quand le
 * système demande moins de mouvement. La couronne étant symétrique, sa
 * boîte englobante tourne autour du centre de l'écran, où qu'il soit.
 */
const SPIN =
  "origin-center [transform-box:fill-box] animate-[mascot-load_0.88s_steps(8)_infinite] motion-reduce:animate-none";

/* ------------------------------------------------------------------ */
/* Visage-écran                                                       */
/* ------------------------------------------------------------------ */

/** L'écran et son expression, sans la tête autour. */
export function MascotScreen({
  face = "heureux",
  label,
  className,
}: Readonly<{
  face?: MascotFaceId;
  /** À poser quand l'écran est seul. Omis, le SVG est masqué aux lecteurs d'écran. */
  label?: string;
  className?: string;
}>) {
  const spec = MASCOT_FACES[face];
  const { w, h } = SCREEN;
  return (
    <svg
      viewBox={`${-w / 2} ${-h / 2} ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("block h-auto w-full", className)}
      {...a11y(label)}
    >
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={flat(spec.screen)} />
      <g transform="scale(1,-1)">
        <g className={"spin" in spec ? SPIN : undefined}>
          <Shapes shapes={spec.shapes} />
        </g>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Emoji                                                              */
/* ------------------------------------------------------------------ */

/** Le visage en un caractère : une tuile carrée, lisible jusqu'à 20 px. */
export function MascotEmoji({
  emoji,
  label,
  className,
}: Readonly<{
  emoji: MascotEmojiId;
  /** À poser quand l'emoji remplace un mot. Omis, le SVG est masqué aux lecteurs d'écran. */
  label?: string;
  className?: string;
}>) {
  const spec = MASCOT_EMOJIS[emoji];
  return (
    <svg
      viewBox="-50 -50 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("block h-8 w-8 shrink-0", className)}
      {...a11y(label)}
    >
      <rect
        x={-44}
        y={-44}
        width={88}
        height={88}
        fill={flat("dim" in spec ? "charcoal" : "ink")}
      />
      <g transform="scale(1,-1)">
        <g className={"spin" in spec ? SPIN : undefined}>
          <Shapes shapes={spec.shapes} />
        </g>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Symbole                                                            */
/* ------------------------------------------------------------------ */

const PAD = 14;
const EAR = { inner: 150, outer: 180, bar: 194, half: 7 } as const;
/* Mêmes cotes que le modèle 3D : un cube de 30 à moitié enfoncé dans la tête,
   dont seule la moitié haute dépasse. */
const ANTENNA = {
  base: [54, 240, 84, 255],
  mast: [64, 255, 74, 325],
  tip: [56, 325, 82, 351],
} as const;

function Box({
  box: [x0, y0, x1, y1],
  fill,
}: Readonly<{ box: readonly [number, number, number, number]; fill: string }>) {
  return <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={fill} />;
}

/**
 * La tête de face, à plat. Plus de volume, plus d'ombre : ce qui reste quand
 * tout le reste disparaît. Elle ne descend pas sous 64 px ; en dessous,
 * c'est l'emoji qui prend le relais.
 */
export function MascotHead({
  face = "heureux",
  scheme = "couleur",
  antenna = true,
  label,
  className,
}: Readonly<{
  face?: MascotFaceId;
  scheme?: MascotHeadSchemeId;
  antenna?: boolean;
  /** À poser quand la tête est seule. Omis, le SVG est masqué aux lecteurs d'écran. */
  label?: string;
  className?: string;
}>) {
  const s = MASCOT_HEAD_SCHEMES[scheme];
  const spec = MASCOT_FACES[face];
  const { w, h, screenY, earSpread } = HEAD;
  const mid = h / 2;
  const top = antenna ? ANTENNA.tip[3] : h;
  const outer = EAR.bar + PAD;
  const metal = flat(s.metal);
  const screenFill = s.screen ? flat(s.screen) : "none";

  return (
    <svg
      viewBox={`${-outer} ${-(top + PAD)} ${outer * 2} ${top + PAD * 2}`}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("block h-auto w-40", className)}
      {...a11y(label)}
    >
      <g transform="scale(1,-1)">
        {antenna && (
          <>
            <Box box={ANTENNA.base} fill={metal} />
            <Box box={ANTENNA.mast} fill={metal} />
            <Box box={ANTENNA.tip} fill={flat(s.tip)} />
          </>
        )}
        {[-1, 1].map((k) => (
          <g key={k} fill={metal}>
            {[-1, 1].map((v) => (
              <rect
                key={v}
                x={k < 0 ? -EAR.outer : EAR.inner}
                y={mid + v * earSpread - EAR.half}
                width={EAR.outer - EAR.inner}
                height={EAR.half * 2}
              />
            ))}
            <rect
              x={k < 0 ? -EAR.bar : EAR.outer}
              y={mid - earSpread - EAR.half}
              width={EAR.bar - EAR.outer}
              height={earSpread * 2 + EAR.half * 2}
            />
          </g>
        ))}
        <rect
          x={-w / 2}
          y={0}
          width={w}
          height={h}
          fill={s.head ? flat(s.head) : "none"}
          stroke={s.outline ? flat(s.outline) : undefined}
          strokeWidth={s.outline ? s.stroke : undefined}
        />
        {s.rule && (
          <rect
            x={-w / 2 + s.stroke / 2}
            y={s.stroke / 2}
            width={w - s.stroke}
            height={10 - s.stroke / 2}
            fill={flat(s.rule)}
          />
        )}
        <rect
          x={-SCREEN.w / 2}
          y={screenY - 78}
          width={SCREEN.w}
          height={156}
          fill={screenFill}
          stroke={s.screen || !s.outline ? undefined : flat(s.outline)}
          strokeWidth={s.screen || !s.outline ? undefined : s.stroke}
        />
        <g className={"spin" in spec ? SPIN : undefined}>
          <Shapes shapes={spec.shapes} force={s.face} dy={screenY} />
        </g>
      </g>
    </svg>
  );
}
