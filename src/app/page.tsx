import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { ContactSection } from "@/app/_components/sections/contact.section";
import { DemarcheSection } from "@/app/_components/sections/demarche.section";
import { HeroSection } from "@/app/_components/sections/hero.section";
import { WorkGrid } from "@/app/_components/sections/work-grid";
import { Navbar, type NavLink } from "@/components/shared/navbar";

const NAV_LINKS: NavLink[] = [
  { name: "Ma philosophie", href: "#demarche" },
  { name: "Mon travail", href: "#travail" },
  {
    name: "Contact",
    href: "#contact",
    variant: "primary",
    icon: <Mail aria-hidden="true" className="h-3.5 w-3.5" />,
  },
];

export const metadata: Metadata = {
  // Pas de `title` ici : la racine reprend le `default` du layout, « Yoann
  // Corgnet » sans suffixe — c'est la seule page où le nom seul est le bon
  // onglet.
  description:
    "Transformer des idées en logiciels fiables. Comprendre le problème, concevoir pour évoluer, créer un environnement où construire est fluide.",
};

export default function Home() {
  return (
    <>
      <Navbar links={NAV_LINKS} />
      <main className="min-h-screen bg-background">
        <HeroSection />
        <DemarcheSection />
        <WorkGrid />
        <ContactSection />
      </main>
    </>
  );
}
