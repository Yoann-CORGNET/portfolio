import { ThemeToggle } from "./theme-toggle"

export function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-primary">{">"}</span>
          <span>© {new Date().getFullYear()} • Construit avec passion</span>
        </div>

        <nav className="flex items-center gap-6 text-sm">
          <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
            À propos
          </a>
          <a href="#projects" className="text-muted-foreground hover:text-primary transition-colors">
            Projets
          </a>
          <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
            Contact
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </footer>
  )
}
