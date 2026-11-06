import cors from '@fastify/cors'
import Fastify from 'fastify'
import { pool } from './db/pool'
import { playResultRoutes } from './routes/playResults'

const app = Fastify({ logger: true })

await app.register(cors, {
  origin: (process.env.CORS_ORIGIN ?? 'http://localhost:5173').split(',').map((s) => s.trim()),
})

app.get('/health', async () => {
  await pool.query('SELECT 1')
  return { ok: true }
})

await app.register(playResultRoutes)

const port = Number(process.env.PORT ?? 3001)
await app.listen({ port, host: '0.0.0.0' })
