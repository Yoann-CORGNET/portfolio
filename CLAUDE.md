# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Project Overview

Personal portfolio website built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind
CSS 4. French language throughout (`lang="fr"`). Monospace programming aesthetic using JetBrains
Mono font.

## Commands

- `pnpm run dev` — Start development server
- `pnpm run build` — Production build. Runs `registry:build` (`shadcn build`) first, then
  `next build`, which type-checks and fails on TS errors
- `pnpm run typecheck` — `tsc --noEmit`; runs on pre-push and in CI for fast, isolated feedback
  before a build is even attempted
- `pnpm run lint` — ESLint (flat config in `eslint.config.mjs`)
- `pnpm run format` / `pnpm run format:check` — Prettier over the whole repo
- `pnpm run registry:check` — verifies the shadcn registry is complete (see Design system registry)
- `pnpm run start` — Start production server

Package manager is **pnpm**. The `ci` workflow runs typecheck, lint, format:check, registry:check
and build as five parallel matrix jobs, plus a `sonar` job that analyses the project against
SonarQube Cloud with a blocking quality gate. It runs on every PR and on pushes to `main` — Sonar
needs the main-branch analysis as its new-code baseline. Husky hooks run `lint-staged` on commit,
and `typecheck` + `lint` + `registry:check` on push.

## Architecture

### Routing

Next.js App Router:

- `/` — Single-page homepage composed of section components (Hero, Démarche, work grid, Contact), in
  `src/app/_components/sections/`
- `/projets/<slug>` — One static route per project (`stockelec`, `undrive`, `hestia`,
  `kheiroton-ia`), each its own folder under `src/app/projets/` with its own `page.tsx` and
  `_components/sections/`. There is no dynamic `[slug]` route — each project page is bespoke, not
  templated from shared data. The four are a deliberate reading order, not a set: `work-grid.tsx`
  lists them and `_components/project-transition.tsx` chains each one to the next.
- `/design-system` — The house design system: foundations, then every component with its variants
  and props. Generated from `src/lib/design/registry.ts`.
- `/design-system/layouts` — Thirteen compositions built with that library.

Navigation on the homepage uses anchor-based scrolling (`#demarche`, `#travail`, `#contact`).

### Data Flow

Each `/projets/<slug>` page owns its own content inline in its section components — there is no
shared project data source. The homepage work grid (`src/app/_components/sections/work-grid.tsx`)
duplicates the summary (name, line, year, href) for each project as a local array; keep it in sync
by hand when a project page's headline details change. Adding a project means three hand-edits, not
one: the route folder, the `work-grid.tsx` entry, and the `CHAIN` in
`src/app/projets/_components/project-transition.tsx` — a page missing from the last two is built and
publicly reachable but linked from nowhere.

### Component Library

Three distinct layers — do not mix them up (the rule and its rationale are in
`docs/code-quality.md`, "Separation of concerns"):

- `src/components/system/` — **the house design system**, and what new work should be built from.
  Grouped by concern: `primitives.tsx`, `stats.tsx`, `motion.tsx`, `controls.tsx`, `overlap.tsx`,
  `pipeline-flow.tsx`, `flow-field.tsx`, `layout.tsx`, `logo.tsx`. `docs.tsx`, `specimens.tsx`,
  `swatch.tsx` and `overlap-bench.tsx` are the chrome of `/design-system` only and are deliberately
  outside the barrel.
- `src/components/shared/` — cross-route chrome (`navbar.tsx`, `footer.tsx`).
- `src/components/sections/` — section shells shared by more than one project page
  (`project-hero.tsx`, `split-header.tsx`). A section used by exactly one page does **not** go here.

Page-specific sections are colocated per route instead, under each route's own
`_components/sections/` (e.g. `src/app/_components/sections/`,
`src/app/projets/hestia/_components/sections/`).

There is no `src/components/ui/`. The site was scaffolded on vendored shadcn/ui, but of the 57
vendored files only `Button` was ever imported by the site — the rest imported nothing but each
other, and no provider (`Toaster`, `TooltipProvider`) was ever mounted. `Button` is now the system's
`Action`, so the whole directory, its Radix dependencies, `components.json` and the ESLint/Sonar
exclusions that existed to keep it quiet are gone. Reaching for `npx shadcn@latest add` again means
re-adopting that layer deliberately, not restoring something that was load-bearing.

Design tokens and the generative texture live in `src/lib/design/`: `tokens.ts` (flat colours in
OKLCh, type scale, motion durations, dot screen), `palette.ts` (texture ramps + OKLCh→sRGB),
`brand.ts` (logo paths and colour schemes), `streamlines.ts`, `noise.ts`, and `registry.ts` (the
library described as data — the `/design-system` page and its inventory figures are both generated
from it, so a component added to the library but not to `registry.ts` simply is not in the system).

### Design system registry (distribution)

Distinct from `src/lib/design/registry.ts` (docs metadata), the root **`registry.json`** is a shadcn
registry that publishes the system for install into other projects (`shadcn add @yoann/system`). Two
invariants, both enforced so they are not left to memory:

- `public/r/` is a **build output**, gitignored, regenerated by `registry:build` (which `build` runs
  first). Never hand-edit or commit it; that is what makes source-vs-published drift impossible.
- Every file the barrel reaches must be shipped by a `registry.json` item. `pnpm run registry:check`
  (`scripts/check-registry.mjs`, run on pre-push and in CI) verifies this — it is what a green build
  cannot, since the site never installs the registry. It catches omissions, not CLI import-rewrite
  bugs; those need a real install into a fresh project. When adding a distributable component,
  update `registry.json` too, and prefer a filename that does not collide with an item name or
  another shipped basename (a collision makes the CLI rewrite imports wrong).

### Theming

The specific values below are architecture facts (what the tokens currently are); the _rules_ around
them (no hardcoded values, keep `globals.css`/`tokens.ts` in sync) are in `docs/code-quality.md`.

- The site is **light-only**. There is no theme switching, no `next-themes`, and no `.dark` class on
  the tree. The `@custom-variant dark` line in `globals.css` is deliberately kept as a guard: it
  binds `dark:` to a class that is never applied, so any `dark:` utility that gets authored or
  vendored in is inert. Dropping it would let those utilities fall back to Tailwind's
  `prefers-color-scheme` variant and reintroduce dark styling. The cream/ink toggle on
  `/design-system` switches a _preview surface_ for the component demos, not a theme.
- CSS variables in `src/app/globals.css` using **OKLch color space**. Warm paper, cold ink, one warm
  accent: every neutral is warm (h ≈ 85) and every grey that carries text is cold (h ≈ 250).
  `--primary` is vermillon (h ≈ 33). These values are duplicated in `src/lib/design/tokens.ts` —
  change one, change the other.
- `--radius` is **0**. The system separates with a 1px hairline or with nothing; the two places that
  do curve opt in locally. Separation is also never a shadow — with one deliberate exception: the
  `Action` component (`src/components/system/primitives.tsx`) is a mechanical key whose resting
  state casts a **hard-edged** offset block (`box-shadow` with zero blur), collapsed on press. It is
  the only thing in the system that casts anything, documented in place, and earns it by being the
  thing you press.
- Three type roles, applied by HTML tag rather than by hand-added classes, in `@layer base` of
  `globals.css`: `<h1>` gets the mono display treatment (uppercase, tight leading/tracking — the
  main-title look is the tag's default, not something a page opts into); `<h2>`–`<h4>` default to
  `--font-heading` (Archivo); `<p>` not carrying `tabular-nums` defaults to `--font-text` (IBM Plex
  Sans). Everything else (nav, chips, labels, digits, buttons) stays on the site-wide mono default
  (`--font-sans`/`--font-mono`, both JetBrains Mono, set via `font-mono` on `<body>`). An element
  whose sizing is hand-tuned to JetBrains Mono's fixed glyph advance (search for `chasse` in
  comments) opts back into `font-mono` explicitly rather than the reverse — keep that convention
  when adding new metric-tuned type rather than fighting the cascade with more classes.
- Custom CSS animations: `animate-blink` (terminal cursor), `marquee` (ticker), `scanlines` (retro
  effect).
- `src/app/globals.css` is the only stylesheet.

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
