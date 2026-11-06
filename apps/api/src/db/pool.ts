import pg from 'pg'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Copy apps/api/.env.example to apps/api/.env.')
}

export const pool = new pg.Pool({ connectionString, max: 10 })
