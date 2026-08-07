import { Action, Label, Rule } from "@/components/system";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <Label tone="accent">Erreur</Label>
      <h1 className="mt-6 text-[clamp(4rem,20vw,10rem)] font-bold leading-[0.82] tracking-tighter">
        404
      </h1>
      <Rule className="my-8 max-w-xs" />
      <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
        Cette page n&apos;existe pas, ou plus.
      </p>
      <Action href="/" size="lg" className="mt-10">
        Retour à l&apos;accueil
      </Action>
    </main>
  );
}
