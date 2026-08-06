/**
 * La conclusion.
 *
 * Elle ne récapitule aucun acte par son nom et ne liste aucun outil : les deux
 * figures ont été coupées à la passe éditoriale, et rien dans la mise en page
 * ne doit les réintroduire. Un seul bloc de texte, et rien après lui — le filet
 * qui le suivait fermait sur une signature qui n'est plus là.
 *
 * C'est aussi la seconde et dernière occurrence de la construction « n'est pas
 * X, c'est Y » — la première étant la leçon de l'Acte I. Assez loin en arrière
 * pour qu'elle résonne comme un écho.
 */

import { Reveal } from "@/components/system";
import { CLOSING } from "../content";

export function ClosingSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          <p className="max-w-4xl text-[clamp(1.5rem,4vw,2.75rem)] leading-[1.05] font-bold tracking-tighter">
            {CLOSING}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
