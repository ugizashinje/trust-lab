/**
 * Minimal forward-only migration runner.
 * Applies db/migrations/*.sql in filename order, once each, inside a transaction.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { pool } from './pool'

const dir = fileURLToPath(new URL('../../../../db/migrations/', import.meta.url))

async function migrate() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )`)
    const { rows } = await client.query<{ name: string }>('SELECT name FROM schema_migrations')
    const applied = new Set(rows.map((r) => r.name))

    const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()
    for (const file of files) {
      if (applied.has(file)) continue
      console.log(`applying ${file}`)
      await client.query('BEGIN')
      try {
        await client.query(readFileSync(`${dir}${file}`, 'utf8'))
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file])
        await client.query('COMMIT')
      } catch (err) {
        await client.query('ROLLBACK')
        throw err
      }
    }
    console.log('migrations up to date')
  } finally {
    client.release()
    await pool.end()
  }
}

migrate().catch((err) => {
  console.error(err)
  process.exit(1)
})
