"use client"

import { useState, useEffect } from "react"
import { ThemeToggle } from "./theme-toggle"
import Link from "next/link"
import Image from "next/image";

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
      <div className="max-w-6xl mx-auto px-16 py-4 flex items-center justify-between">
        <Link href='/' className="font-bold text-xl hover:text-primary transition-colors">
          <Image
              src="/logo.svg"
              alt="Portfolio Logo"
              width={120}
              height={40}
              priority
              className="h-10 w-auto"
            />
        </Link>
        
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
