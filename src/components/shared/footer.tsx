"use client";

import Link from "next/link";
import { Label } from "@/components/system";

export function Footer() {
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
          className="ml-auto cursor-pointer transition-opacity duration-300 hover:opacity-70"
        >
          <Label>↑ haut de page</Label>
        </button>
      </div>
    </footer>
  );
}
