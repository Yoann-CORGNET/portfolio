"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"

export interface NavLink {
  name: string;
  href: string;
}

interface NavbarProps {
  links: NavLink[];
}

export function Navbar({ links }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-end gap-4">
          {/* Desktop navigation */}
          {links.length > 0 && (
            <div className="hidden md:flex items-center gap-8">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <span className="text-primary">{"#"}</span>
                  {link.name}
                </a>
              ))}
            </div>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
