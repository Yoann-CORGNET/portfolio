const skillCategories = [
  {
    title: "Programmation",
    command: "languages --list",
    skills: ["Java", "Python", "C", "JavaScript", "POO & Structures de données", "HTML / CSS"],
  },
  {
    title: "Développement Web",
    command: "web-dev --list",
    skills: ["Next.js", "Vue.js / Quasar", "Java Spring", "Django", "API RESTful", "Tailwind CSS"],
  },
  {
    title: "DevOps & Outils",
    command: "devops --list",
    skills: ["Git / GitHub", "GitHub Actions", "Docker", "Google Cloud", "Pipeline CI/CD", "PostgreSQL / MySQL"],
  },
  {
    title: "Gestion & Langues",
    command: "soft-skills --list",
    skills: [
      "Jira & Microsoft 365",
      "Méthode Agile",
      "Français (natif)",
      "Anglais (B2 - TOEIC 835)",
      "Travail d'équipe",
      "Communication",
    ],
  },
]

export function SkillsSection() {
  return (
    <section id="skills" className="py-24 px-6 bg-card/50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-12">
          <span className="text-primary text-xl">{"#"}</span>
          <h2 className="text-2xl md:text-3xl font-bold">Compétences</h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((category) => (
            <div key={category.title} className="rounded-lg bg-card border border-border overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-chart-4/60" />
                  <div className="w-3 h-3 rounded-full bg-primary/60" />
                </div>
                <span className="text-sm text-muted-foreground ml-2">{category.title}</span>
              </div>

              {/* Terminal content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <span className="text-primary">$</span>
                  <span className="text-muted-foreground">{category.command}</span>
                </div>
                <ul className="space-y-2">
                  {category.skills.map((skill) => (
                    <li key={skill} className="flex items-center gap-2 text-sm">
                      <span className="text-primary">→</span>
                      <span className="text-foreground">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
