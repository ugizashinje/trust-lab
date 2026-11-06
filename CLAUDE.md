# Trust Lab

An interactive, multilingual explainer about cooperation and trust, built on the
iterated prisoner's dilemma. Original characters, text and look — inspired by the
genre, not a copy of any existing game.

## Monorepo

npm workspaces. Node ≥ 20.19 (developed on Node 22+).

```
apps/web/            Vue 3 + Vite + TypeScript + Tailwind v4 → Vercel (static)
apps/api/            Node + Fastify + pg (not deployed yet; web works without it)
packages/game-core/  Pure TS game engine (strategies, matches, tournaments, evolution)
db/migrations/       Plain SQL, forward-only, applied by apps/api/src/db/migrate.ts
```

`game-core` is framework-free and imported as TS source (no build step). Keep all
game rules there; Vue components only render and drive it.

## Commands (run from repo root)

```bash
npm run dev            # web dev server (regenerates sr-Latn first)
npm run build          # production build of apps/web → apps/web/dist
npm test               # unit tests: game-core + web (i18n rules)
npm run typecheck      # vue-tsc + tsc across all workspaces
npm run test:e2e -w @trust-lab/web   # Playwright, every locale, desktop + mobile
npm run db:up && npm run db:migrate  # local Postgres
npm run dev:api        # API on :3001 (needs apps/api/.env)
```

Before finishing a change: `npm test && npm run typecheck && npm run build`.
For UI changes also run the e2e suite or check in the browser via Playwright MCP.

## Styling — Tailwind CSS v4 (preferred)

- **Use Tailwind utility classes in templates.** Do not add `<style>` blocks or new
  global CSS unless there is no reasonable utility equivalent.
- Design tokens live in `apps/web/src/assets/main.css` under `@theme`
  (`paper`, `ink`, `ink-soft`, `muted`, `line`, `accent`, `share`, `keep`, `warn`, …).
  Use them (`bg-accent`, `text-muted`, `border-line`) instead of raw hex values.
  Add a new token rather than repeating an arbitrary value.
- Shared building blocks in `@layer components`: `btn`, `btn-primary`, `btn-ghost`,
  `btn-lg`, `btn-share`, `btn-keep`, `card`, `callout`, `kicker`, `lead`, `segmented`.
  Keep this list short; prefer extracting a Vue component over adding a CSS class.
- Tailwind v4 syntax: important is a suffix (`px-2!`), config is CSS-first (no
  `tailwind.config.js`), plugin is `@tailwindcss/vite`.
- Fonts: system stacks with Cyrillic coverage; do not add webfonts without asking.
- Respect `prefers-reduced-motion` (already handled globally).

## Internationalization

Locales: `en` (source of truth), `fr`, `sr-Cyrl` (default Serbian), `sr-Latn`.

- One JSON file per language in `apps/web/src/i18n/locales/`.
- **`sr-Latn.json` is generated** from `sr-Cyrl.json` by `scripts/gen-sr-latn.mjs`
  (runs automatically before dev/build). Never edit it by hand. Write Serbian in
  Cyrillic only; Latin is allowed only for proper names/titles listed in
  `LATIN_ALLOWED` in `locales.test.ts`.
- Key structure rules (enforced by `src/i18n/locales.test.ts`):
  - Top-level keys are namespaces that will later become separate files:
    `common, strategies, sim, home, rules, play, tournament, evolution, mistakes, sandbox, end`.
  - Below that, organize semantically. **Max 4 levels** including the namespace.
  - Leaves are always strings (no arrays/numbers).
  - Keys are English identifiers (`play.match.prompt`), never English sentences.
  - Same keys and same `{placeholders}` in every locale.
- Plurals: `"one | other"` for en/fr, `"one | few | other"` for Serbian; call
  `t(key, count)`. Rules come from `Intl.PluralRules` (`src/i18n/plural.ts`).
- vue-i18n reserves `{ } @ $ |` in messages; don't use them as literal text.
- Use typographic apostrophes/quotes (’ “ ” « » „ “) in copy.
- French: non-breaking space (U+00A0) before `? ! : ; %` and inside `« »` (enforced by test).
- Serbian uses the formal/plural "ви" form (gender-neutral); French uses "vous".
- Every `t('…')` key in source must exist in en.json (`src/i18n/usage.test.ts`).
- Adding a language: copy en.json → `<code>.json`, register in `src/i18n/index.ts`
  (`messages`, `LANGUAGES`, `pluralRules`), add to `LOCALES` in tests and e2e fixtures.

## Conventions

- Vue: `<script setup lang="ts">`, Composition API, props via `defineProps<…>()`.
- Strategy ids (`titForTat`, …) are shared between engine, i18n keys
  (`strategies.<id>.*`) and `src/strategyMeta.ts` (color + icon).
- Add `data-testid` only where role/text selectors are not practical.
- Accessibility: real buttons for actions, `aria-pressed`/`aria-selected` for
  toggles, `sr-only` text for icon-only content.
- The frontend must keep working with no backend (`VITE_API_URL` empty).

## Deployment

Vercel uses `vercel.json` at the repo root: installs at root, runs `npm run build`,
serves `apps/web/dist` with an SPA fallback rewrite.
