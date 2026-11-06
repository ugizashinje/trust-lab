# Trust Lab

An interactive, multilingual guide to why strangers cooperate — play a trading
game, run tournaments between strategies and watch populations evolve.

Languages: English · Français · Српски (Ћирилица / Latinica)

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
```

## Scripts

| Command                              | What it does                                   |
| ------------------------------------ | ---------------------------------------------- |
| `npm run dev`                        | Web dev server                                 |
| `npm run build`                      | Production build → `apps/web/dist`             |
| `npm test`                           | Unit tests (engine + translation rules)        |
| `npm run typecheck`                  | Type-check all workspaces                      |
| `npm run test:e2e -w @trust-lab/web` | Playwright, all locales, desktop + mobile      |
| `npm run db:up` / `npm run db:migrate` | Local Postgres via Docker + migrations       |
| `npm run dev:api`                    | API on :3001 (copy `apps/api/.env.example`)    |

First Playwright run: `npx playwright install chromium` (in `apps/web`).

## Structure

```
apps/web             Vue 3 · Vite · Tailwind v4 · vue-i18n   (deployed to Vercel)
apps/api             Fastify · pg                             (optional, not deployed yet)
packages/game-core   Shared game engine
db/migrations        SQL migrations
```

## Deploying to Vercel

Import the repository in Vercel and keep the **Root Directory** as the repo root.
`vercel.json` already sets the install/build commands and output directory.

See `CLAUDE.md` for conventions (styling, translation rules, adding a language).

## Credits

Built on game-theory research, especially Robert Axelrod's computer tournaments,
and inspired by Nicky Case's "The Evolution of Trust".
