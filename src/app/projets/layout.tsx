"use client";

import { usePathname } from "next/navigation";
import { Github, ArrowUpRight } from "lucide-react";
import { NAVBAR_HEIGHT, Navbar, type NavLink } from "@/components/shared/navbar";
import { ProjectTransition } from "@/app/projets/_components/project-transition";

const EXTERNAL_LINK: Record<string, NavLink | undefined> = {
  applainow: {
    name: "GitHub",
    href: "https://github.com/Google-Developer-Group-ESIEA/applai-now",
    variant: "primary",
    external: true,
    icon: <Github aria-hidden="true" className="h-3.5 w-3.5" />,
  },
  hestia: {
    name: "Découvrir",
    href: "https://nerionsoft.com/moteur-de-reservation",
    variant: "primary",
    external: true,
    icon: <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />,
  },
  "kheiroton-ia": {
    name: "GitHub",
    href: "https://github.com/Yoann-CORGNET/Kheiroton-IA",
    variant: "primary",
    external: true,
    icon: <Github aria-hidden="true" className="h-3.5 w-3.5" />,
  },
  stockelec: undefined,
  undrive: {
    name: "GitHub",
    href: "https://github.com/CapProjet-Undrive/undrive",
    variant: "primary",
    external: true,
    icon: <Github aria-hidden="true" className="h-3.5 w-3.5" />,
  },
};

export default function ProjetsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const slug = pathname.split("/").findLast(Boolean) ?? "";

  const links: NavLink[] = [
    EXTERNAL_LINK[slug] ?? { name: "Contact", href: "/#contact", variant: "primary" },
  ];

  return (
    <>
      <Navbar links={links} />
      {/* La barre est `fixed`, donc hors flux : sans cette réserve, le premier
          aplat de chaque page projet démarrerait au bord haut et passerait
          sous elle. La marge est posée ici plutôt que dans chaque hero pour
          que les cinq pages ne puissent pas en donner cinq valeurs. */}
      <div style={{ paddingTop: NAVBAR_HEIGHT }}>{children}</div>
      <ProjectTransition current={slug} />
    </>
  );
}
