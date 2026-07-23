# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Project Overview

Personal portfolio website built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind
CSS 4. French language throughout (`lang="fr"`). Monospace programming aesthetic using JetBrains
Mono font.

## Commands

- `pnpm run dev` — Start development server
- `pnpm run build` — Production build (TypeScript errors are ignored via `next.config.mjs`)
- `pnpm run typecheck` — `tsc --noEmit`; the only thing that catches TS errors, since the build
  ignores them
- `pnpm run lint` — ESLint (flat config in `eslint.config.mjs`; `src/components/ui/**` is ignored as
  vendored shadcn output)
- `pnpm run format` / `pnpm run format:check` — Prettier over the whole repo
- `pnpm run start` — Start production server

Package manager is **pnpm**. The `ci` workflow runs typecheck, lint, format:check and build as four
parallel matrix jobs, plus a `sonar` job that analyses the project against SonarQube Cloud with a
blocking quality gate. It runs on every PR and on pushes to `main` — Sonar needs the main-branch
analysis as its new-code baseline. Husky hooks run `lint-staged` on commit, `typecheck` and `lint`
on push.

## Architecture

### Routing

Next.js App Router with two routes:

- `/` — Single-page homepage composed of section components (Hero, About, Skills, Projects,
  Experience, Contact)
- `/projects/[slug]` — Dynamic project detail pages, statically generated via
  `generateStaticParams()` from `src/data/projects.ts`

Navigation on the homepage uses anchor-based scrolling (`#about`, `#skills`, `#projects`,
`#experience`, `#contact`).

### Data Flow

Project data is defined as a static array in `src/data/projects.ts` using the `Project` type from
`src/types/project.ts`. Both the projects grid on the homepage and the dynamic `[slug]` pages read
from this single data source. To add a new project, add an entry to this array — no database or API
involved.

### Component Library

UI primitives come from **shadcn/ui** (new-york style) built on Radix UI, located in
`src/components/ui/`. Added via `npx shadcn@latest add <component>`. Config in `components.json`.

Custom section components live directly in `src/components/` (e.g., `hero-section.tsx`,
`navbar.tsx`).

### Theming

- The site is **light-only**. There is no theme switching, no `next-themes`, and no `.dark` class on
  the tree. The `@custom-variant dark` line in `globals.css` is deliberately kept so the `dark:`
  utilities inside the vendored `src/components/ui` stay inert — dropping it would let them fall
  back to Tailwind's `prefers-color-scheme` variant and reintroduce dark styling.
- CSS variables in `src/app/globals.css` using **OKLch color space**. Primary color is green (hue
  ~145).
- Both `--font-sans` and `--font-mono` map to JetBrains Mono — the entire site uses monospace.
- Custom CSS animations: `animate-blink` (terminal cursor), `scanlines` (retro effect).

### Path Aliases

`@/*` maps to `./src/*` (configured in `tsconfig.json`).

## Conventions

- Never commit to `main` — branch (`<type>/<description>`) and open a PR. See `CONTRIBUTING.md`.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):
  `feat`, `fix`, `docs`, `refactor`, `chore`, `test`, `build`, `ci`, `perf`, `revert`. There is no
  `hotfix:` type — an urgent fix lives on a `hotfix/` branch but is committed as `fix:`.
- Client components use `"use client"` directive; default is server components
- Tailwind utility classes inline, merged with `cn()` from `src/lib/utils.ts`
- Icons from `lucide-react`

## Releases

Versions are managed by [release-please](https://github.com/googleapis/release-please) (`node`
release type, config in `release-please-config.json`). Never edit `version` in `package.json` or
`CHANGELOG.md` by hand — merging to `main` opens a release PR that does it, and merging that PR tags
the release.
