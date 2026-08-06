"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Action, Logo, type ActionVariant } from "@/components/system";
import { cn } from "@/lib/utils";

export interface NavLink {
  name: string;
  href: string;
  variant?: ActionVariant;
  external?: boolean;
  /**
   * Un élément déjà rendu (`<Mail .../>`), pas un type de composant : la
   * navbar peut être appelée depuis un composant serveur, qui ne peut pas
   * passer une référence de fonction à un composant client — seul un élément
   * React franchit la frontière.
   */
  icon?: ReactNode;
}

interface NavbarProps {
  links: NavLink[];
}

/**
 * La hauteur de la barre.
 *
 * Elle n'est déclarée nulle part : elle tombe du logo (`h-10`, soit 2,5rem, le
 * plus haut des deux contenus) et du rembourrage vertical du conteneur
 * (`py-4`, deux fois 1rem). La barre étant `fixed`, elle est hors flux et ne
 * réserve aucune place — une page qui ne veut pas commencer dessous doit donc
 * réserver cette hauteur elle-même.
 *
 * L'accueil ne s'en sert pas : son hero est dessiné pour que la barre flotte
 * au-dessus, et il ménage sa propre marge haute. Ce sont les pages projet qui
 * en ont besoin, leur premier bloc étant un aplat qui part du bord.
 */
export const NAVBAR_HEIGHT = "4.5rem";

export function Navbar({ links }: Readonly<NavbarProps>) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled && "border-b border-border bg-background/80 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Yoann Corgnet" className="flex items-center">
          <Logo className="h-10 w-10 shrink-0" />
          <span
            aria-hidden="true"
            className={cn(
              "overflow-hidden whitespace-nowrap text-sm font-bold tracking-tight transition-all duration-300",
              isScrolled ? "ml-3 max-w-[12rem] opacity-100" : "ml-0 max-w-0 opacity-0",
            )}
          >
            Yoann Corgnet
          </span>
        </Link>

        {links.length > 0 && (
          <nav className="hidden items-center gap-2 md:flex">
            {links.map((link) => (
              <Action
                key={link.name}
                href={link.href}
                external={link.external}
                variant={link.variant ?? "ghost"}
                size="sm"
              >
                {link.icon ? (
                  <span className="inline-flex items-center gap-1.5">
                    {link.icon}
                    {link.name}
                  </span>
                ) : (
                  link.name
                )}
              </Action>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
