import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Github, ExternalLink, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { projects } from "@/data/projects"
import { Project } from "@/types/project"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate static params at build time
export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function Post({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((project) => project.slug === slug)

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navbar links={ [] } />
      <main className="min-h-screen bg-background">
        <section className="pt-24 pb-16">
          <div className="max-w-5xl mx-auto">
            {/* Back button */}
            <Button variant="ghost" className="mb-8 text-muted-foreground hover:text-primary" asChild>
              <Link href="/#projects">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux projets
              </Link>
            </Button>

            {/* Project header */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-xs rounded bg-primary/10 text-primary border border-primary/20">
                  {project.status}
                </span>
                <span className="text-muted-foreground text-sm">{project.period}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.name}</h1>
              <p className="text-xl text-muted-foreground mb-6">{project.tagline}</p>
              <p className="text-muted-foreground mb-6">{project.context}</p>

              <div className="flex gap-4">
                <Button className="bg-primary hover:bg-primary/90" asChild>
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    Voir le code
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
                  asChild
                >
                  <a href={project.demo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Démo en ligne
                  </a>
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-12 rounded-lg border border-border p-6 bg-card">
              <p className="text-foreground leading-relaxed">{project.description}</p>
            </div>

            {/* Problem & Solution */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="rounded-lg border border-border p-6 bg-card">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-primary">{">"}</span>
                  {project.problem.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{project.problem.content}</p>
              </div>
              <div className="rounded-lg border border-border p-6 bg-card">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-primary">{">"}</span>
                  {project.solution.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{project.solution.content}</p>
              </div>
            </div>

            {/* Features */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-primary">{"#"}</span>
                Fonctionnalités principales
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {project.features.map((feature) => (
                  <div
                    key={feature.name}
                    className="rounded-lg border border-border p-4 bg-card hover:border-primary/50 transition-colors"
                  >
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {feature.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Details */}
            <div className="mb-12 rounded-lg border border-border p-6 bg-card">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">{"#"}</span>
                {project.technicalDetails.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{project.technicalDetails.content}</p>
              <div className="grid md:grid-cols-2 gap-3">
                {project.technicalDetails.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-1">{">"}</span>
                    <span className="text-foreground">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stack */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-primary">{"#"}</span>
                Stack technique
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.stack.map((tech) => (
                  <div key={tech.name} className="rounded-lg border border-border px-4 py-2 bg-card">
                    <div className="text-xs text-muted-foreground mb-1">{tech.category}</div>
                    <div className="font-semibold text-primary">{tech.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="rounded-lg border border-primary/50 p-6 bg-primary/5">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">{"#"}</span>
                Réalisations clés
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {project.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
