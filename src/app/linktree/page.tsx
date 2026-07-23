import Link from "next/link";
import Image from "next/image";
import { Home, Linkedin, Github, Mail, FileDown, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  {
    name: "Portfolio",
    value: "yoann-corgnet.dev",
    href: "/",
    icon: Home,
    external: false,
    download: false,
  },
  {
    name: "LinkedIn",
    value: "linkedin.com/in/yoann-corgnet",
    href: "https://linkedin.com/in/yoann-corgnet",
    icon: Linkedin,
    external: true,
    download: false,
  },
  {
    name: "GitHub",
    value: "github.com/yoann-corgnet",
    href: "https://github.com/yoann-corgnet",
    icon: Github,
    external: true,
    download: false,
  },
  {
    name: "Email",
    value: "ycorgnet@et.esiea.fr",
    href: "mailto:ycorgnet@et.esiea.fr",
    icon: Mail,
    external: true,
    download: false,
  },
  {
    name: "CV",
    value: "Télécharger mon CV",
    href: "/Yoann-CORGNET_CV.pdf",
    icon: FileDown,
    external: false,
    download: true,
  },
];

export default function LinktreePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center px-6 py-12">
      {/* Grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center gap-8">
        {/* Theme toggle */}
        <div className="self-end">
          <ThemeToggle />
        </div>

        {/* Header */}
        <div className="flex flex-col items-center gap-4">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={120}
              height={40}
              priority
              className="h-10 w-auto"
            />
          </Link>
          <h1 className="text-2xl font-bold">
            <span className="text-primary">{">"}</span> Yoann CORGNET
          </h1>
        </div>

        {/* Terminal card */}
        <div className="w-full rounded-lg bg-card border border-border overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-chart-4/60" />
              <div className="w-3 h-3 rounded-full bg-primary/60" />
            </div>
            <span className="text-sm text-muted-foreground ml-2">links.sh</span>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6 text-sm">
              <span className="text-primary">$</span>
              <span className="text-muted-foreground">cat ~/links</span>
            </div>

            <div className="space-y-3">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  download={link.download || undefined}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <link.icon className="h-5 w-5 text-primary" />
                    <div>
                      <span className="text-foreground font-medium">{link.name}</span>
                      <p className="text-sm text-muted-foreground">{link.value}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground">
          <span className="text-primary">{">"}</span> Fait avec Next.js & Tailwind CSS
        </p>
      </div>
    </div>
  );
}
