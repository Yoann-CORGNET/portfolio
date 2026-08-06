# Code quality principles

This is the canonical list of code-quality rules for this repo. If a rule is mentioned anywhere else
(`CLAUDE.md`, `CONTRIBUTING.md`), it's a pointer back here, not a second definition — update the
rule in this file, not there.

Generic frontend good practices, and where each one is actually enforced in this repo versus left to
convention. "Enforced" means a tool blocks the commit/push/CI on violation; "convention" means it
relies on the rule being followed by hand.

Sources these draw from:
[Airbnb JavaScript/React Style Guide](https://github.com/airbnb/javascript),
[W3C Design Tokens spec](https://design-tokens.github.io/community-group/format/),
[WCAG 2.2](https://www.w3.org/TR/WCAG22/),
[Conventional Commits](https://www.conventionalcommits.org/).

## Separation of concerns

Presentation, logic, and data live in different places — a component doesn't fetch data and own
business rules in the same block it renders markup.

- **Enforced by structure**: distinct component layers that must not mix — `src/components/system/`
  (the house design system, imported only through its barrel `@/components/system`),
  `src/components/shared/` (cross-route chrome), `src/components/sections/` (section shells used by
  more than one project page), and page-local section components colocated under each route's
  `_components/`. Putting business logic or data-fetching in `system/` violates this split, as does
  promoting a one-page section into `sections/`.
- **Convention**: within a component, pulling logic out to a hook vs. inlining it is not linted;
  reviewed by eye.

## No hardcoded design values

Colors, spacing, radii, durations come from the token layer (`src/lib/design/tokens.ts` / CSS
variables in `globals.css`), never as inline hex/px/ms literals.

- **Enforced**: nothing lints this today — an inline `#ff5500` or `16px` would pass ESLint and
  Prettier silently.
- **Convention**: specific rules riding on top of the token layer — `--radius` is always `0` (the
  system separates with a hairline or nothing, never a curve, with local opt-in exceptions), every
  neutral colour is warm and every text-carrying grey is cold, and both `--font-sans` and
  `--font-mono` map to JetBrains Mono (the whole site is monospace) — are not machine-checked. A
  Tailwind ESLint plugin (e.g. `eslint-plugin-tailwindcss`) or a Stylelint pass could close this gap
  if violations start appearing.

## Single source of truth

Data isn't duplicated or re-derived in more than one place.

- **Enforced by structure**: `src/lib/design/registry.ts` is the one source both `/design-system`
  and its inventory figures render from.
- **Gap**: `/projets/<slug>` pages are bespoke per project (no shared data source), and a project's
  identity is repeated in three hand-maintained places — its route folder, the homepage work grid
  (`src/app/_components/sections/work-grid.tsx`), and the `CHAIN` in
  `src/app/projets/_components/project-transition.tsx`. Nothing reconciles them, and the failure is
  silent in the worst direction: a page absent from the last two still builds and is still publicly
  reachable, just linked from nowhere.
- **Known, accepted exception**: the OKLCh colour values are duplicated between
  `src/app/globals.css` (CSS variables) and `src/lib/design/tokens.ts` (the same values for use in
  TS/JS, e.g. the flow-field canvas). Changing one without the other is a bug, not a style choice —
  there's no tooling that keeps them in sync, so treat this pair as one unit whenever either
  changes.

## Explicit public boundaries (barrels)

A directory's contents are accessed through one entry point, not by reaching into its files, so
internals can move without breaking callers.

- **Convention**: `src/components/system` must always be imported via its barrel,
  `@/components/system` — never by reaching into a file inside it (`@/components/system/primitives`
  etc.) — so a component can move between files without touching call sites. Not currently linted
  (an `eslint-plugin-import` `no-restricted-imports` rule scoped to that path would enforce it).

## Consistent naming, checked by tooling

A naming convention is only reliable if something other than memory checks it.

- **Enforced**: `pnpm run registry:check` (`scripts/check-registry.mjs`) verifies every file the
  system barrel reaches has a matching `registry.json` entry — catches an added component that was
  never published.
- **Convention**: filename patterns (e.g. `*.section.tsx` for page sections) are not currently
  linted; a rename that breaks the pattern would pass CI silently.

## No dead or drifted vendored code

Generated/vendored code doesn't get hand-edited and silently diverge from its source of truth.

- **Nothing to enforce today**: there is no vendored code in `src/`. The site was scaffolded on
  shadcn/ui, but only `Button` was ever imported by a page, and it is now the system's `Action` — so
  `src/components/ui/`, its Radix dependencies, `components.json` and the ESLint/Sonar exclusions
  that existed to keep it quiet were all removed together. Every file under `src/` is
  hand-maintained and every gate applies to all of it, with no per-path exemptions.
- **If vendored code returns**: reintroduce the exclusions in the same change that vendors it —
  `eslint.config.mjs` and `sonar-project.properties` — so a regeneration can't move the
  maintainability rating. An exclusion for a path that no longer exists is itself the drift this
  section is about.

## Type safety

- **Enforced**: `tsconfig.json` has `"strict": true`. `pnpm run typecheck` runs on pre-push
  (`.husky/pre-push`) and as its own CI matrix job for fast, isolated feedback, and `next build`
  itself also type-checks and fails on errors — so a type error can't reach production even if it
  slips past pre-push/CI (e.g. a direct push, since `main` currently has no branch protection
  requiring CI to pass before merge). `next.config.mjs` previously set
  `typescript.ignoreBuildErrors: true` (a leftover from the original scaffold) which made the build
  silently swallow type errors — the only thing catching them was the separate `typecheck` step.
  Removed: with no branch protection on `main`, that config was the single point of failure between
  a type error and a live deploy. Ignoring type errors at build time is a reasonable tradeoff only
  when something else reliably blocks the merge/deploy path first (e.g. required CI checks) — verify
  that before reintroducing it.

## Linting and formatting

- **Enforced**: ESLint (`eslint-config-next` core-web-vitals + typescript, `eslint.config.mjs`) and
  Prettier both run in CI as separate jobs (`typecheck`, `lint`, `format:check`), and via
  `lint-staged` on commit (`.husky/pre-commit`, fixing what's auto-fixable). A second full-project
  `lint` + `typecheck` pass runs again on push as a backstop for files that weren't staged in the
  commit that introduced the break.

## Static analysis / code smells

- **Enforced**: SonarQube Cloud runs in CI (`sonar` job) with a blocking quality gate on every PR
  and on `main`. Covers duplication, complexity, security hotspots, and general smells beyond what
  ESLint checks.

## Accessibility

- **Enforced (partial)**: `eslint-config-next/core-web-vitals` bundles `eslint-plugin-jsx-a11y`, so
  common issues (missing `alt`, invalid ARIA, non-interactive elements with handlers) fail lint.
- **Convention**: color-contrast, keyboard-nav completeness, and focus order are not linted — need
  manual/browser testing.

## Commit and release hygiene

- **Enforced**: [Conventional Commits](https://www.conventionalcommits.org/) format feeds
  `release-please`, which opens the version-bump PR — an off-convention commit type doesn't break
  the release, but does produce a wrong/missing changelog entry.
- **Convention**: branching off `main` per change (`CONTRIBUTING.md`) is not enforced by a
  branch-protection check documented here — verify in GitHub repo settings if this needs to be a
  hard gate.

## Gaps worth closing next

Ordered by how much drift they currently allow before anything notices:

1. No lint rule preventing inline hex/px values outside the token layer.
2. No `no-restricted-imports` rule enforcing barrel-only imports into `system/`.
3. No filename-convention lint (e.g. section components must end in `.section.tsx`).
4. Accessibility contrast/keyboard checks are manual only.
5. Nothing checks that a `/projets/<slug>` route appears in both `work-grid.tsx` and the
   `project-transition.tsx` `CHAIN`. A page missing from either is built, deployed and crawlable but
   unlinked — the one gap here whose failure is invisible rather than merely inconvenient. A
   `registry:check`-style script reading the route folders and asserting both lists match would
   close it.
6. `main` has no GitHub branch protection requiring CI checks to pass before merge — CI is advisory,
   not a gate, until this is turned on.
