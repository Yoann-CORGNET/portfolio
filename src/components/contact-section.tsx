import { Mail, Github, Linkedin, ArrowUpRight } from "lucide-react";

const contactLinks = [
  {
    name: "Email",
    value: "ycorgnet@et.esiea.fr",
    href: "mailto:ycorgnet@et.esiea.fr",
    icon: Mail,
  },
  {
    name: "LinkedIn",
    value: "linkedin.com/in/yoann-corgnet",
    href: "https://linkedin.com/in/yoann-corgnet",
    icon: Linkedin,
  },
  {
    name: "GitHub",
    value: "github.com/yoann-corgnet",
    href: "https://github.com/yoann-corgnet",
    icon: Github,
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-12">
          <span className="text-primary text-xl">{"#"}</span>
          <h2 className="text-2xl md:text-3xl font-bold">Contact</h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="max-w-3xl mx-auto rounded-lg bg-card border border-border overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-chart-4/60" />
              <div className="w-3 h-3 rounded-full bg-primary/60" />
            </div>
            <span className="text-sm text-muted-foreground ml-2">contact.sh</span>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4 text-sm">
                <span className="text-primary">$</span>
                <span className="text-muted-foreground">
                  echo &quot;Discutons de votre projet&quot;
                </span>
              </div>
              <p className="text-foreground leading-relaxed">
                Je recherche activement un stage de 4 mois (avril - août 2026) en tant que
                développeur Backend / Fullstack. N&apos;hésitez pas à me contacter pour discuter
                d&apos;opportunités ou de projets intéressants.
              </p>
            </div>

            <div className="space-y-3">
              {contactLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
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
      </div>
    </section>
  );
}
