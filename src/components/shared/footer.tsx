"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Label, MascotEmoji } from "@/components/system";

// These pages render their own footer inline, sized so the page and the
// footer together fill exactly one screen with nothing to scroll to — the
// point of a code meant to be read from a phone at arm's length, and of a
// link list meant to be skimmed in one glance.
const NO_FOOTER_ROUTES = new Set(["/qrcode", "/qrcode/cv", "/linktree"]);

export function Footer() {
  const pathname = usePathname();
  if (NO_FOOTER_ROUTES.has(pathname)) return null;

  return (
    <footer className="px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline gap-x-8 gap-y-2">
        <Label>© Yoann Corgnet</Label>
        <Link href="/design-system" className="transition-opacity duration-300 hover:opacity-70">
          <Label>design system</Label>
        </Link>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="ml-auto flex cursor-pointer items-center gap-3 self-center transition-opacity duration-300 hover:opacity-70"
        >
          {/* Le clin d'œil caché : présent partout, il ne prend jamais la parole. */}
          <MascotEmoji emoji="clin" className="h-6 w-6" />
          <Label>↑ haut de page</Label>
        </button>
      </div>
    </footer>
  );
}
