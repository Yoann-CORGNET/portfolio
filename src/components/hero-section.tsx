"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown, Mail } from "lucide-react"
import { useScrollTo } from "@/hooks/use-scroll-to"

export function HeroSection() {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const scrollTo = useScrollTo();
  const fullText = "Étudiant ingénieur en Software Engineering";

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)
    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
          <span className="text-primary">{">"}</span> <span className="text-foreground">Yoann CORGNET</span>
          <span className={`text-primary ${showCursor ? "opacity-100" : "opacity-0"}`}>_</span>
        </h1>

        <h2 className="text-xl md:text-2xl text-foreground mb-4">{displayedText}</h2>

        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Développeur Backend / Fullstack
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            onClick={() => scrollTo("projects")}
          >
            <ArrowDown className="h-4 w-4" />
            Voir mes projets
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2 bg-transparent"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            <Mail className="h-4 w-4" />
            Me contacter
          </Button>
        </div>
      </div>
    </section>
  )
}
