# Contributing

This is the personal portfolio site. These are the conventions for changing it.

## Git workflow

Never commit or push to `main`. Every change lands through a pull request.

1. Branch off the latest `main`:
   ```
   git checkout main && git pull
   git checkout -b <type>/<short-description>
   ```
2. Commit your work on the branch.
3. Push and open a PR:
   ```
   git push -u origin <type>/<short-description>
   gh pr create --fill
   ```
4. Merge once reviewed, then delete the branch.

### Branch names

Follow [Conventional Branch](https://conventional-branch.github.io/): `<type>/<description>`,
kebab-case. Types:

- `feature/` new section, page, or component
- `bugfix/` correcting something broken
- `hotfix/` urgent production fix
- `chore/` housekeeping, config, tooling, docs

Example: `feature/blog-section`.

### Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):
`<type>[optional scope]: <description>`. The description is a short imperative subject, lowercase,
no trailing period. Types: `feat`, `fix`, `docs`, `refactor`, `chore`, `test`, `build`, `ci`,
`perf`, `revert`. An optional body explains _why_, not _what_.

```
feat(projects): add filter by tech stack
```

There is no `hotfix:` commit type. An urgent fix goes on a `hotfix/` **branch** but is committed as
`fix:` — release-please only recognizes the types above, and anything else produces no version bump
and no changelog entry.

## Project layout

- Page routes: `src/app/` (App Router)
- Section components: `src/components/` (e.g. `hero-section.tsx`)
- shadcn/ui primitives: `src/components/ui/` — added via `npx shadcn@latest add <component>`
- Project data: `src/data/projects.ts`, typed by `src/types/project.ts`

Use kebab-case for file names. Adding a project means adding an entry to the `projects` array — the
homepage grid and the `/projects/[slug]` pages both read from it.

## Design system registry

The house design system in `src/components/system/` (plus its tokens in `src/lib/design/`) is
published as a shadcn registry so it can be installed into other projects with
`shadcn add @yoann/system`. `registry.json` is the source of truth; the served JSON under
`public/r/` is generated from it.

Two rules, and the tooling enforces both so you do not have to remember them:

- **`public/r/` is a build output, never edited or committed.** `pnpm run build` runs
  `registry:build` (`shadcn build`) first, so the published registry is regenerated on every deploy
  from the current source. That is why `.gitignore` excludes it: there is no committed copy to drift
  from the source.
- **A component exported from the barrel and meant to be distributed must have a `registry.json`
  entry.** `pnpm run registry:check` verifies that every file the barrel (`index.ts`) reaches,
  transitively through the shipped files, is shipped by some item — and that every path an item
  lists exists. This is the check that a green build cannot do: the site never installs the
  registry, so only a consumer would notice a missing item. It runs on `pre-push` and in CI.

`registry:check` catches the _omission_ class. It does not catch everything: a name collision that
makes the CLI rewrite an import wrong only shows up when you actually install into a fresh project.
When you touch how items are split or named, do that smoke test by hand.

## Formatting

Everything is formatted by Prettier (`semi`, double quotes, `trailingComma: all`, `printWidth: 100`,
see `.prettierrc.json`) — the same config as the other NerionSoft projects. Markdown prose is
rewrapped at 100 characters on top of that.

## Git hooks

[husky](https://typicode.github.io/husky/) installs itself through the `prepare` script, so a plain
`pnpm install` after cloning wires both hooks up.

- `pre-commit` runs `lint-staged` on staged files only: `eslint --fix` then `prettier --write` on
  TS/JS, `prettier --write` on JSON/CSS/YAML/Markdown. Unfixable lint errors block the commit.
- `pre-push` runs `pnpm run typecheck`, `pnpm run lint`, then `pnpm run registry:check` on the whole
  project and blocks the push if any fails. lint-staged only sees staged files, so this is what
  catches a change that breaks a file you did not touch. All three are deterministic and offline, so
  they front-run CI rather than making you wait for a round-trip. The slower guards (the full build,
  Sonar) stay CI-only.

To format everything by hand: `pnpm run format`. To check without writing: `pnpm run format:check`.

## Checks

The `ci` workflow runs five checks in parallel, plus the `sonar` job below. Run them locally first:

```
pnpm run typecheck      # tsc --noEmit
pnpm run lint           # eslint
pnpm run format:check   # prettier
pnpm run registry:check # barrel ↔ registry.json completeness
pnpm run build          # shadcn build, then next build
```

`typecheck` matters here: `next.config.mjs` tells the build to ignore TypeScript errors, so `build`
alone will not catch them.

ESLint ignores `src/components/ui/**` — those are shadcn/ui primitives regenerated by the CLI, not
hand-maintained code.

## SonarQube Cloud

The `ci` workflow's `sonar` job analyses the project on every PR and on every push to `main` — the
main-branch analysis is what tells Sonar which code is "new" on a PR, which is why `ci` runs on
`main` at all. The quality gate is **blocking**: a red gate fails the job.

The split of responsibility is deliberate. ESLint enforces framework correctness (React hooks,
Next.js rules) at commit time and blocks on errors; Sonar tracks maintainability on new code. To
keep it to one dashboard, `pnpm run lint:report` writes `eslint-report.json` and Sonar imports it
via `sonar.eslint.reportPaths`, so ESLint findings show up as Sonar issues instead of living in a
second report.

`sonar-project.properties` excludes `src/components/ui/**` for the same reason ESLint does — a
shadcn regeneration should not move the maintainability rating.

Analysis needs a `SONAR_TOKEN` repository secret, and the `sonar.projectKey` / `sonar.organization`
values must match the project in SonarQube Cloud.

## Before opening a PR

Keep the docs in sync. Any change that touches structure, routing, data flow, or the conventions
themselves must land with the matching updates to `README.md`, `CLAUDE.md`, and `CONTRIBUTING.md` in
the **same** PR. Documentation has to reflect the change before it is merged, not in a follow-up.

## Releases & versioning

Do not bump version numbers by hand. [release-please](https://github.com/googleapis/release-please)
does it from the Conventional Commits on `main`. This is why commit types matter: `fix:` drives a
patch bump, `feat:` a minor bump, and a `!` or `BREAKING CHANGE:` footer a major bump. Other types
(`chore`, `docs`, `ci`, …) don't trigger a release on their own.

The flow:

1. Land your change through a normal PR with well-typed commits.
2. On merge to `main`, the `release-please` workflow opens (or updates) a **release PR** that bumps
   `version` in `package.json` and refreshes `CHANGELOG.md`.
3. When you want to cut the release, merge that release PR. It tags `vX.Y.Z` and creates the GitHub
   release. Nothing releases on its own — the release PR is the gate.

Versioning starts fresh at `0.1.0` (`bootstrap-sha` in `release-please-config.json` points at the
last commit before release-please was set up), so the changelog only covers commits landed after
that point.

If a new file ever needs to carry the version string, add an `extra-files` entry for it in
`release-please-config.json`.

## Writing style

Keep prose plain and direct. Avoid the flattened, uniform register that AI text drifts toward,
including reflexive em-dashes.
