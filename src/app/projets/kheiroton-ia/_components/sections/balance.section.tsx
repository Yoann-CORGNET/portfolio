import { SplitHeader } from "@/components/sections/split-header";
import { BrandoliniScale } from "@/app/projets/kheiroton-ia/_components/brandolini-scale";
import { COLUMN_TITLE, SUBHEAD } from "../typography";

const ASYMETRIE_LEAD =
  "La veille a vite confirmé un déséquilibre qui ne doit rien à l'IA : mentir a toujours été bon marché, et corriger ne l'a jamais été.";

export function BalanceSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SplitHeader
          titleLines={["La balance", "est truquée"]}
          titleClassName={COLUMN_TITLE}
          lead={ASYMETRIE_LEAD}
          leadClassName={SUBHEAD}
        />

        <BrandoliniScale className="mt-16" />
      </div>
    </section>
  );
}
