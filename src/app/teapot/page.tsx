import type { Metadata } from "next";
import { Label, Watermark } from "@/components/system";
import { TeapotMark } from "./_components/teapot-mark";
import { TeapotTerminal } from "./_components/teapot-terminal";

export const metadata: Metadata = {
  title: "Erreur 418 (Je suis une théière)",
  description: "Ceci est une théière. Elle ne prépare pas de café. RFC 2324.",
};

export default function TeapotPage() {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-background px-6 py-24">
      <Watermark opacity={0.05} className="text-foreground">
        418
      </Watermark>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-16 md:grid-cols-[0.9fr_1.2fr]">
        <div className="text-center md:text-left">
          <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-bold leading-[0.9] tracking-tighter">
            <span className="block">Je suis</span>
            <span className="block">une théière</span>
          </h1>

          <TeapotMark className="mx-auto mt-8 h-auto w-full max-w-sm md:mx-0 md:max-w-none" />
        </div>

        <div className="flex flex-col items-center md:items-start">
          <TeapotTerminal />
          <Label tone="accent" className="mt-4">
            powered by the Hyper Text Coffee Pot Control Protocol
          </Label>
        </div>
      </div>
    </main>
  );
}
