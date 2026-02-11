# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4. French language throughout (`lang="fr"`). Monospace programming aesthetic using JetBrains Mono font.

## Commands

- `pnpm run dev` — Start development server
- `pnpm run build` — Production build (TypeScript errors are ignored via `next.config.mjs`)
- `pnpm run lint` — ESLint
- `pnpm run start` — Start production server

Package manager is **pnpm**.

## Architecture

### Routing

Next.js App Router with two routes:
- `/` — Single-page homepage composed of section components (Hero, About, Skills, Projects, Experience, Contact)
- `/projects/[slug]` — Dynamic project detail pages, statically generated via `generateStaticParams()` from `src/data/projects.ts`

Navigation on the homepage uses anchor-based scrolling (`#about`, `#skills`, `#projects`, `#experience`, `#contact`).

### Data Flow

Project data is defined as a static array in `src/data/projects.ts` using the `Project` type from `src/types/project.ts`. Both the projects grid on the homepage and the dynamic `[slug]` pages read from this single data source. To add a new project, add an entry to this array — no database or API involved.

### Component Library

UI primitives come from **shadcn/ui** (new-york style) built on Radix UI, located in `src/components/ui/`. Added via `npx shadcn@latest add <component>`. Config in `components.json`.

Custom section components live directly in `src/components/` (e.g., `hero-section.tsx`, `navbar.tsx`).

### Theming

- Dark/light mode via `next-themes` with `ThemeProvider` in root layout. Default theme is dark.
- CSS variables in `src/app/globals.css` using **OKLch color space**. Primary color is green (hue ~145).
- Both `--font-sans` and `--font-mono` map to JetBrains Mono — the entire site uses monospace.
- Custom CSS animations: `animate-blink` (terminal cursor), `scanlines` (retro effect).

### Path Aliases

`@/*` maps to `./src/*` (configured in `tsconfig.json`).

## Conventions

- Commit messages use prefixes: `feat:`, `fix:`, `hotfix:`
- Client components use `"use client"` directive; default is server components
- Tailwind utility classes inline, merged with `cn()` from `src/lib/utils.ts`
- Icons from `lucide-react`
