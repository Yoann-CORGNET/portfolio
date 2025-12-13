const experiences = [
  {
    year: "2026",
    role: "Stage de 4 mois recherché",
    company: "Développeur Backend / Fullstack",
    description: "Recherche active d'une opportunité pour approfondir mes compétences en développement backend",
    highlight: "Avril - Août 2026",
  },
  {
    year: "2025 - 2027",
    role: "Diplôme d'Ingénieur",
    company: "ESIEA - Majeure Software Engineering",
    description: "Formation en génie logiciel avec spécialisation en développement backend et architecture",
    highlight: "Obtention prévue en 2027",
  },
  {
    year: "Juil. 2023",
    role: "Stage Ouvrier - Pôle IT",
    company: "Sumitomo Electric Wiring Systems Europe",
    description:
      "Rédaction d'un cahier des charges pour un logiciel de gestion des notes de frais : analyse des besoins, étude des contraintes légales et conception fonctionnelle",
    highlight: "1 mois",
  },
]

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24 px-6 bg-card/50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-12">
          <span className="text-primary text-xl">{"#"}</span>
          <h2 className="text-2xl md:text-3xl font-bold">Parcours</h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row gap-4 md:gap-8 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1.5 md:-translate-x-1.5 mt-1.5 z-10 ring-4 ring-background" />

                {/* Content */}
                <div className={`flex-1 ml-10 md:ml-0 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                  <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-primary text-sm font-mono">{exp.year}</span>
                      <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">{exp.highlight}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{exp.role}</h3>
                    <p className="text-muted-foreground text-sm mb-2">@ {exp.company}</p>
                    <p className="text-foreground/80 text-sm">{exp.description}</p>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
