import type { Metadata } from "next";
import Link from "next/link";
import { Action, Logo } from "@/components/system";
import { ContactForm } from "@/app/_components/contact-form";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact — Yoann CORGNET",
  description: "Écrire à Yoann Corgnet.",
};

function Corners() {
  const corner = "absolute h-3 w-3 border-current/25";
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-3">
      <span className={cn(corner, "left-0 top-0 border-l border-t")} />
      <span className={cn(corner, "right-0 top-0 border-r border-t")} />
      <span className={cn(corner, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(corner, "bottom-0 right-0 border-b border-r")} />
    </span>
  );
}

export default function ContactPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-10 px-6 py-16">
      <Link href="/" className="flex flex-col items-center gap-4">
        <Logo label="Yoann CORGNET" className="h-10 w-10" />
        <span className="text-xl tracking-tight">
          <span className="text-primary">{">"}</span> Yoann CORGNET
        </span>
      </Link>

      {/* `bg-background`, not a `FlatBlock` tone: the page's own paper colour
          sits 0.025 lightness from `cream`, too close to read as a tone of
          its own — a border is what separates it from the page instead. */}
      <div className="-mx-6 w-[calc(100%+3rem)] border border-border bg-background sm:mx-0 sm:w-full">
        <div className="relative p-7 md:p-10">
          <ContactForm skin="paper" shape="boxed" />
          <Corners />
        </div>
      </div>

      <Action href="/" variant="ghost" size="sm">
        Retour au portfolio
      </Action>
    </div>
  );
}
