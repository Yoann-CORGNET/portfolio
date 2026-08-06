import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FileDown, Github, Home, Linkedin, MessageSquare } from "lucide-react";
import { FlatBlock, Label, Logo } from "@/components/system";
import type { FlatToken } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Liens — Yoann CORGNET",
  description: "Tous les liens de Yoann Corgnet.",
};

type LinkItem = {
  name: string;
  value: string;
  href: string;
  icon: typeof Home;
  tone: FlatToken;
  external?: boolean;
  download?: boolean;
};

const LINKS: readonly LinkItem[] = [
  {
    name: "Portfolio",
    value: "yoann-corgnet.dev",
    href: "/",
    icon: Home,
    tone: "rust",
  },
  {
    name: "LinkedIn",
    value: "linkedin.com/in/yoann-corgnet",
    href: "https://linkedin.com/in/yoann-corgnet",
    icon: Linkedin,
    tone: "petrol",
    external: true,
  },
  {
    name: "GitHub",
    value: "github.com/yoann-corgnet",
    href: "https://github.com/yoann-corgnet",
    icon: Github,
    tone: "charcoal",
    external: true,
  },
  {
    name: "Contact",
    value: "Écrire un message",
    href: "/contact",
    icon: MessageSquare,
    tone: "moss",
  },
  {
    name: "CV",
    value: "Télécharger mon CV",
    href: "/Yoann-CORGNET_CV.pdf",
    icon: FileDown,
    tone: "amber",
    download: true,
  },
];

function LinkRow({ link }: Readonly<{ link: LinkItem }>) {
  return (
    <a
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noopener noreferrer" : undefined}
      download={link.download || undefined}
      className="group block"
    >
      <FlatBlock
        tone={link.tone}
        className={cn(
          "transition-transform duration-300 ease-out group-hover:scale-[1.015]",
          "motion-reduce:transition-none motion-reduce:group-hover:scale-100",
        )}
      >
        <div className="flex items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4">
            <link.icon aria-hidden="true" className="h-4 w-4 shrink-0" />
            <div>
              <p className="font-medium tracking-tight">{link.name}</p>
              <Label tone="inherit" className="opacity-70">
                {link.value}
              </Label>
            </div>
          </div>
          <ArrowUpRight
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-300",
              "group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
            )}
          />
        </div>
      </FlatBlock>
    </a>
  );
}

export default function LinktreePage() {
  return (
    <div className="flex h-dvh flex-col">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-10 px-6">
        <Link href="/" className="flex flex-col items-center gap-4">
          <Logo label="Yoann CORGNET" className="h-10 w-10" />
          <span className="text-xl tracking-tight">Yoann CORGNET</span>
        </Link>

        <div className="flex w-full flex-col gap-3">
          {LINKS.map((link) => (
            <LinkRow key={link.name} link={link} />
          ))}
        </div>
      </div>

      <footer className="px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-baseline gap-x-8 gap-y-2">
          <Label>© Yoann Corgnet</Label>
          <Link href="/design-system" className="transition-opacity duration-300 hover:opacity-70">
            <Label>design system</Label>
          </Link>
        </div>
      </footer>
    </div>
  );
}
