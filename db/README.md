# Database

PostgreSQL 17. Local instance via Docker on host port 5433 (override with `DB_PORT`), from the repo root:

```bash
npm run db:up        # start postgres (docker-compose.yml)
npm run db:migrate   # apply db/migrations/*.sql
npm run db:down      # stop
```

## Migrations

- Plain SQL files in `migrations/`, applied in filename order by `apps/api/src/db/migrate.ts`.
- Forward-only: never edit an applied migration. Add a new file: `002_<what>.sql`.
- Applied migrations are tracked in the `schema_migrations` table.

## Tables

| Table          | Purpose                                                  |
| -------------- | -------------------------------------------------------- |
| `play_results` | Anonymous results of the "Your turn" chapter (no PII).   |
