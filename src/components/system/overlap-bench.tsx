"use client";

import { useEffect, useRef, useState } from "react";
import { FLAT } from "@/lib/design/tokens";
import { Label } from "./primitives";
import { OverlapCascade, OverlapTriangle } from "./overlap";

/**
 * Le banc de réglage des figures de recouvrement.
 *
 * Chrome de `/design-system`, comme `Swatch` : il tient un état, il vit donc
 * dans son propre fichier client et rien hors de la page du système ne devrait
 * l'importer.
 *
 * Pourquoi ces deux composants ont droit à un banc quand les autres se
 * contentent de variantes côte à côte : leurs paramètres ne sont pas des choix
 * discrets mais un espace continu, borné par deux inégalités qui tirent en sens
 * inverse. Trois vignettes ne montrent pas où sont les bords de cet espace ;
 * un curseur qu'on pousse jusqu'à faire disparaître l'intersection, oui.
 *
 * Le rendu suit la surface du stage : le banc ne pose aucun fond, il hérite de
 * celui du `Preview` que `Variant` place autour de lui, et bascule donc crème /
 * encre avec le reste de la page.
 */

/* ------------------------------------------------------------------ */
/* Curseur                                                            */
/* ------------------------------------------------------------------ */

function Slider({
  name,
  value,
  min,
  max,
  suffix = "",
  onChange,
}: Readonly<{
  name: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  onChange: (v: number) => void;
}>) {
  return (
    <div className="border-t border-current/20 pt-3">
      <div className="flex items-baseline justify-between gap-4">
        <Label tone="inherit">{name}</Label>
        <Label tone="inherit" numeric>
          {value}
          {suffix}
        </Label>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={name}
        className="mt-2 w-full"
        style={{ accentColor: FLAT.vermillon }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Réglages                                                           */
/* ------------------------------------------------------------------ */

type CascadeState = { shift: number; dotSize: number; dotWeight: number };
type TriangleState = {
  side: number;
  radius: number;
  orientation: number;
  skew: number;
  dotSize: number;
  dotWeight: number;
};

/** Les défauts sont ceux des composants : le banc s'ouvre sur leur état nu. */
const CASCADE: CascadeState = { shift: 20, dotSize: 11, dotWeight: 30 };
const TRIANGLE: TriangleState = {
  side: 60,
  radius: 25,
  orientation: 120,
  skew: 45,
  dotSize: 12,
  dotWeight: 20,
};

const NAMES = ["besoin", "usage", "moyens"] as const;

/**
 * Le JSX qui produit exactement ce que le banc affiche.
 *
 * Trois règles, et chacune existe pour que le texte soit collable tel quel :
 *
 *  — seules les valeurs qui s'écartent du défaut sont écrites. Recopier un
 *    appel qui répète les défauts, c'est figer dans du code des valeurs qui
 *    devraient suivre le composant s'il évolue ;
 *  — `labels` y figure, parce que la figure du banc est nommée : un extrait qui
 *    ne reproduit pas ce qu'on voit est un piège ;
 *  — au-delà d'une propriété, l'appel passe sur plusieurs lignes, dans la forme
 *    qu'un formateur laisserait en place.
 */
function snippet(name: string, state: Record<string, number>, defaults: Record<string, number>) {
  const props = Object.entries(state)
    .filter(([key, value]) => value !== defaults[key])
    .map(([key, value]) => `${key}={${value}}`);

  const namesList = NAMES.map((n) => `"${n}"`).join(", ");
  props.push(`labels={[${namesList}]}`);

  if (props.length === 1) return `<${name} ${props[0]} />`;
  return [`<${name}`, ...props.map((p) => `  ${p}`), "/>"].join("\n");
}

/** Le temps que la confirmation tient avant que le bouton redevienne muet. */
const CONFIRM_MS = 1400;

/**
 * L'extrait, et le bouton qui le copie.
 *
 * Même conduite que `Swatch` devant un presse-papiers refusé : c'est une
 * décision du navigateur, à lui de l'expliquer — le bouton ne confirme
 * simplement pas.
 */
function Snippet({ code }: Readonly<{ code: string }>) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => clearTimeout(timer.current ?? undefined), []);

  const copy = () => {
    void navigator.clipboard.writeText(code).then(
      () => {
        clearTimeout(timer.current ?? undefined);
        setCopied(true);
        timer.current = setTimeout(() => setCopied(false), CONFIRM_MS);
      },
      () => {
        /* Presse-papiers refusé : c'est au navigateur de l'expliquer, pas à
           nous. Le bouton ne confirme simplement pas. */
      },
    );
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copier l'appel du composant"
      className="group block w-full cursor-pointer border-t border-current/20 p-6 text-left outline-offset-2 focus-visible:outline-2"
      style={{ outlineColor: FLAT.vermillon }}
    >
      <span className="flex items-baseline justify-between gap-4">
        <Label tone="inherit">appel</Label>
        <Label
          tone="inherit"
          className="transition-opacity duration-300"
          style={copied ? { color: FLAT.vermillon } : { opacity: 0.5 }}
        >
          {copied ? "copié" : "copier"}
        </Label>
      </span>
      <code className="mt-3 block overflow-x-auto whitespace-pre text-sm leading-relaxed">
        {code}
      </code>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Banc                                                               */
/* ------------------------------------------------------------------ */

/**
 * Le stage n'est pas posé ici : `Variant` enveloppe déjà chaque aperçu dans un
 * `Preview`. Le banc ne rend donc que son contenu.
 *
 * La cellule de la figure centre sur ses deux axes. Sans quoi la figure se cale
 * en haut d'une rangée dont la hauteur est dictée par la colonne de contrôles —
 * six curseurs pour le triangle, trois pour la cascade — et elle paraît
 * décentrée alors que la faute est à la rangée, pas à la figure.
 *
 * L'extrait passe en bandeau pleine largeur plutôt qu'au pied des contrôles :
 * un appel sur plusieurs lignes ne tient pas dans une colonne de seize rems.
 */
function Bench({
  figure,
  code,
  controls,
}: Readonly<{ figure: React.ReactNode; code: string; controls: React.ReactNode }>) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-[22rem]">{figure}</div>
        </div>
        <div className="border-t border-current/20 p-6 md:border-l md:border-t-0">{controls}</div>
      </div>
      <Snippet code={code} />
    </div>
  );
}

export function OverlapCascadeBench() {
  const [s, setS] = useState<CascadeState>(CASCADE);
  const set = (k: keyof CascadeState) => (v: number) => setS((prev) => ({ ...prev, [k]: v }));

  return (
    <Bench
      figure={<OverlapCascade {...s} labels={NAMES} />}
      code={snippet("OverlapCascade", s, CASCADE)}
      controls={
        <div className="space-y-4">
          <Slider
            name="shift"
            value={s.shift}
            min={2}
            max={28}
            suffix=" %"
            onChange={set("shift")}
          />
          <Slider
            name="dotSize"
            value={s.dotSize}
            min={4}
            max={24}
            suffix=" px"
            onChange={set("dotSize")}
          />
          <Slider
            name="dotWeight"
            value={s.dotWeight}
            min={0}
            max={100}
            onChange={set("dotWeight")}
          />
          {/* La borne est dans la formule, pas dans une note : au-delà de 25 la
              zone commune vaut zéro et la figure n'a plus de sujet. */}
          <p className="border-t border-current/20 pt-3 text-sm leading-relaxed opacity-70">
            zone commune : {Math.max(0, 100 - 4 * s.shift)} % — nulle dès shift 25.
          </p>
        </div>
      }
    />
  );
}

export function OverlapTriangleBench() {
  const [s, setS] = useState<TriangleState>(TRIANGLE);
  const set = (k: keyof TriangleState) => (v: number) => setS((prev) => ({ ...prev, [k]: v }));

  const reach = (Math.SQRT2 / 2) * s.side - s.radius;
  const spill = s.radius + (Math.SQRT2 / 2) * s.side - 50;

  return (
    <Bench
      figure={<OverlapTriangle {...s} labels={NAMES} />}
      code={snippet("OverlapTriangle", s, TRIANGLE)}
      controls={
        <div className="space-y-4">
          <Slider name="side" value={s.side} min={20} max={70} suffix=" %" onChange={set("side")} />
          <Slider
            name="radius"
            value={s.radius}
            min={0}
            max={40}
            suffix=" %"
            onChange={set("radius")}
          />
          <Slider
            name="orientation"
            value={s.orientation}
            min={0}
            max={360}
            suffix="°"
            onChange={set("orientation")}
          />
          <Slider name="skew" value={s.skew} min={-45} max={45} suffix="°" onChange={set("skew")} />
          <Slider
            name="dotSize"
            value={s.dotSize}
            min={4}
            max={24}
            suffix=" px"
            onChange={set("dotSize")}
          />
          <Slider
            name="dotWeight"
            value={s.dotWeight}
            min={0}
            max={100}
            onChange={set("dotWeight")}
          />
          {/* Les deux inégalités qui bornent la figure, et elles tirent en sens
              inverse : agrandir les carrés grossit l'intersection mais fait
              déborder du cadre. */}
          <div className="space-y-1 border-t border-current/20 pt-3 text-sm leading-relaxed opacity-70">
            <p>portée des pointes : {reach.toFixed(1)} — nulle, plus d&apos;intersection.</p>
            <p>débord du cadre : {spill.toFixed(1)} — positive, la figure sort.</p>
          </div>
        </div>
      }
    />
  );
}
