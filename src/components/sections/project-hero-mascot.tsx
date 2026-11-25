"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { MascotStage } from "@/components/shared/mascot-stage";
import { MOTION } from "@/lib/design/tokens";

/**
 * Prompt qui entre dans le header d'un projet par la droite, puis prend la
 * pose et l'expression propres au projet.
 *
 * Deux placements, et deux supports. Sur grand écran, il se tient en entier
 * dans la partie droite du header, par-dessus la section (`layer`), en 3D :
 * il marche jusqu'à sa place, se tourne vers le lecteur et prend sa pose. En dessous, le titre prend toute la largeur :
 * il passe dans le flux, sous l'accroche (`inline`), et n'est plus qu'une
 * image fixe de la même scène, qui glisse en place. three.js, sa compilation et sa mémoire
 * graphique coûtent trop sur un téléphone pour un personnage de 250 px.
 *
 * L'entrée attend que le support soit affiché, sinon on verrait glisser une
 * boîte vide. Sans mouvement demandé, il est là d'emblée, déjà dans sa pose.
 */

const ARRIVAL_MS = MOTION.find((m) => m.name === "arrival")?.ms ?? 900;
const SLIDE = `${ARRIVAL_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;

/** Le point de rupture `lg` de Tailwind, où le header laisse de la place à droite. */
const WIDE = "(min-width: 1024px)";
const REDUCE = "(prefers-reduced-motion: reduce)";

/**
 * Les mises en scène possibles, une par projet. Chacune a son image fixe pour
 * le mobile, rendue à l'avance depuis le même modèle (fond transparent, dans
 * `public/mascotte/`) : une scène absente de cette table n'a pas d'image, et
 * ne peut donc pas être choisie. Une pose, un visage ou le cadrage `front`
 * retouchés obligent à refaire l'image.
 */
const SCENES = {
  "coucou-heureux": { pose: "coucou", face: "heureux", width: 402, height: 486 },
  "victoire-clin": { pose: "victoire", face: "clin", width: 415, height: 492 },
  "victoire-surpris": { pose: "victoire", face: "surpris", width: 415, height: 492 },
  "reflechit-perplexe": { pose: "reflechit", face: "perplexe", width: 382, height: 499 },
} as const;

export type MascotScene = keyof typeof SCENES;

/** Plafond d'attente du moment calme : passé ce délai, la scène se monte quand même. */
const IDLE_TIMEOUT_MS = 2000;

/** Une media query lue sans effet ; côté serveur, elle ne correspond à rien. */
function useMedia(query: string): boolean | null {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => null,
  );
}

/**
 * Vrai une fois la page chargée et le navigateur au calme. Le chargement de
 * three.js et la compilation des shaders sortent ainsi du chemin critique :
 * ils ne disputent plus le fil principal à l'hydratation ni aux premières
 * interactions. Safari n'a pas `requestIdleCallback` ; il attend un délai court.
 */
function useIdle(): boolean {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    let cancelIdle = () => {};
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        const id = window.requestIdleCallback(() => setIdle(true), { timeout: IDLE_TIMEOUT_MS });
        cancelIdle = () => window.cancelIdleCallback(id);
      } else {
        const id = setTimeout(() => setIdle(true), 200);
        cancelIdle = () => clearTimeout(id);
      }
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      cancelIdle();
    };
  }, []);
  return idle;
}

/** Le glissement d'entrée de l'image fixe. */
function Entrance({
  shown,
  reduce,
  className,
  children,
}: Readonly<{
  shown: boolean;
  reduce: boolean;
  className: string;
  children: React.ReactNode;
}>) {
  return (
    <div
      className={className}
      style={{
        transform: shown || reduce ? "translateX(0)" : "translateX(130%)",
        transition: reduce ? undefined : `transform ${SLIDE}`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * La marche d'entrée : la scène part à 130 % de sa largeur, hors du header,
 * et rejoint sa place en 2,6 s. La cadence est réglée dans `mascot-stage.tsx`.
 */
const WALK_IN = { distance: 1.3, ms: 2600 } as const;

/** Grand écran : la scène 3D, montée au calme, qui marche puis prend sa pose. */
function Volume({ scene }: Readonly<{ scene: MascotScene }>) {
  const { pose: target, face } = SCENES[scene];
  const reduce = useMedia(REDUCE) ?? false;
  const idle = useIdle();
  const [arrived, setArrived] = useState(false);
  const posed = arrived || reduce;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      <div className="absolute bottom-0 right-[8%] h-[88%] aspect-[3/4]">
        {idle && (
          <MascotStage
            framing="front"
            pose={posed ? target : "repos"}
            face={posed ? face : undefined}
            interactive={false}
            walkIn={reduce ? undefined : WALK_IN}
            onArrived={() => setArrived(true)}
            label="Prompt"
            className="h-full w-full"
          />
        )}
      </div>
    </div>
  );
}

/** Mobile : l'image fixe de la scène, déjà dans sa pose. */
function Still({ scene }: Readonly<{ scene: MascotScene }>) {
  const { width, height } = SCENES[scene];
  const reduce = useMedia(REDUCE) ?? false;
  const [loaded, setLoaded] = useState(false);

  return (
    <div aria-hidden="true" className="h-full overflow-hidden">
      <Entrance shown={loaded} reduce={reduce} className="flex h-full justify-end">
        <Image
          src={`/mascotte/prompt-${scene}.webp`}
          width={width}
          height={height}
          alt=""
          onLoad={() => setLoaded(true)}
          className="h-full w-auto"
        />
      </Entrance>
    </div>
  );
}

/**
 * Ne monte que le placement qui correspond à la largeur d'écran. La place du
 * placement `inline` est réservée dès le rendu serveur, pour que le header ne
 * grandisse pas d'un coup à l'hydratation.
 */
export function ProjectHeroMascot({
  scene,
  placement,
}: Readonly<{ scene: MascotScene; placement: "layer" | "inline" }>) {
  const wide = useMedia(WIDE);
  if (placement === "layer") return wide ? <Volume scene={scene} /> : null;
  return <div className="mt-10 h-64 lg:hidden">{wide === false && <Still scene={scene} />}</div>;
}
