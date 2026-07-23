import { Project } from "@/types/project";
import { Button } from "./ui/button";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      key={project.name}
      className="group rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden"
    >
      {/* Project header */}
      <div className="flex items-center justify-between px-6 py-4 bg-secondary/30 border-b border-border">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-foreground font-semibold">{project.name}</span>
          <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
            {project.highlight}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            asChild
          >
            <a href={project.github} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            asChild
          >
            <a href={project.demo} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">Demo</span>
            </a>
          </Button>
        </div>
      </div>

      {/* Project content */}
      <div className="p-6">
        <div className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
          <span className="text-primary">⏱</span>
          {project.period}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span className="text-primary">{">"}</span>
              Problème
            </div>
            <p className="text-foreground text-sm">{project.problem.small}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span className="text-primary">{">"}</span>
              Solution
            </div>
            <p className="text-foreground text-sm">{project.solution.small}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span className="text-primary">{">"}</span>
              Impact
            </div>
            <p className="text-foreground text-sm">{project.impact}</p>
          </div>
        </div>

        {/* Tech stack */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-muted-foreground text-sm">Stack:</span>
          {project.stack.map((tech) => (
            <span
              key={tech.name}
              className="px-2 py-1 text-xs rounded bg-primary/10 text-primary border border-primary/20"
            >
              {tech.name}
            </span>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
          asChild
        >
          <Link href={`/projects/${project.slug}`}>Voir les détails {"->"}</Link>
        </Button>
      </div>
    </div>
  );
}
