import { CommandWord } from "@/components/system/terminal";

/** What a login shell prints before the first prompt. */
export const MOTD = (
  <div>
    <div>Théière OS v1.0 (RFC 2324)</div>
    <div style={{ opacity: 0.7 }}>0 café servi. 418 refus consécutifs.</div>
    <div className="mt-1">
      Tapez <CommandWord>help</CommandWord> pour la liste des commandes, ou{" "}
      <CommandWord>coffee</CommandWord> pour insister.
    </div>
  </div>
);
