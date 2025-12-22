import { Server, Shield, Zap, Database, Container, GitBranch, Code2, Globe } from "lucide-react"

const technologies = [
  { name: "Java", icon: Code2 },
  { name: "Python", icon: Server },
  { name: "JavaScript", icon: Code2 },
  { name: "Next.js", icon: Globe },
  { name: "Vue.js", icon: Globe },
  { name: "PostgreSQL", icon: Database },
  { name: "Docker", icon: Container },
  { name: "GitHub Actions", icon: GitBranch },
]

const values = [
  {
    icon: Zap,
    title: "Performance",
    description: "Optimisation constante pour des temps de réponse minimaux",
  },
  {
    icon: Shield,
    title: "Qualité du code",
    description: "Code propre, maintenable et bien testé",
  },
  {
    icon: Server,
    title: "Architecture",
    description: "Architecture backend robuste et scalable",
  },
]

export function AboutSection() {
  return (
    <section id="about" className="py-24">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-12">
          <span className="text-primary text-xl">{"#"}</span>
          <h2 className="text-2xl md:text-3xl font-bold">À propos</h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Bio */}
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-2 mb-4 text-muted-foreground text-sm">
                <span className="text-primary">$</span>
                <span>cat about.md</span>
              </div>
              <p className="text-foreground leading-relaxed">
                Étudiant ingénieur en Software Engineering à l&apos;ESIEA, je me spécialise dans le{" "}
                <span className="text-primary">développement backend et fullstack</span>. Mon expertise couvre la
                création d&apos;APIs RESTful avec Java Spring et Django, le développement d&apos;applications web avec
                Next.js et Vue.js, ainsi que la mise en place de pipelines CI/CD.
              </p>
            </div>

            {/* Technologies */}
            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-2 mb-4 text-muted-foreground text-sm">
                <span className="text-primary">$</span>
                <span>ls ./technologies</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {technologies.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-center gap-2 px-3 py-2 rounded bg-secondary text-secondary-foreground text-sm"
                  >
                    <tech.icon className="h-4 w-4 text-primary" />
                    <span>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="space-y-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
