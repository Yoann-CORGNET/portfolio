import { Tooltip } from "@/components/system";
import { ACCENT } from "./accent";

/**
 * Un terme, son appel de note, et ce qu'il veut dire.
 *
 * Le brief juge la glose inutile pour l'audience visée. Elle est là quand même,
 * mais hors du texte : l'appel de note laisse la phrase intacte pour qui sait
 * déjà, et la bulle répond à qui ne sait pas. Une parenthèse dans la phrase
 * aurait fait payer la définition à tout le monde.
 *
 * L'ancre est un `abbr`, l'élément prévu pour un sigle — le seul cas qui reste
 * sur la page. Elle ne porte pas de `title` : le sien ouvrirait une seconde
 * bulle, native celle-là, par-dessus la nôtre.
 *
 * Deux choses la rendent utilisable autrement qu'à la souris :
 *
 *  — elle est focusable et porte `aria-describedby`, donc la définition est
 *    annoncée par un lecteur d'écran et la bulle s'ouvre au clavier. C'est
 *    aussi pour ça que `group` et `tabIndex` sont sur le *même* élément —
 *    `group-focus-visible` observe le groupe, pas ses descendants ;
 *  — au doigt, où il n'y a ni survol ni focus, le `<sup>` reste visible et
 *    signale qu'une note existe même si elle ne s'ouvre pas.
 */
export function Gloss({
  id,
  term,
  marker,
  children,
}: Readonly<{
  id: string;
  term: string;
  /** L'appel de note, en exposant. */
  marker: string;
  children: React.ReactNode;
}>) {
  return (
    <abbr
      tabIndex={0}
      aria-describedby={id}
      className="group relative inline-block cursor-help font-normal not-italic no-underline"
    >
      {term}
      <sup className="ml-px text-[0.65em] font-bold" style={ACCENT}>
        {marker}
      </sup>
      <Tooltip id={id}>{children}</Tooltip>
    </abbr>
  );
}
