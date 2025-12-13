import { projects } from "@/data/projects"
import { ProjectCard } from "./project-card"

export function ProjectsSection() {

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-12">
          <span className="text-primary text-xl">{"#"}</span>
          <h2 className="text-2xl md:text-3xl font-bold">Projets</h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project}></ProjectCard>
          ))}
        </div>
      </div>
    </section>
  )
}
