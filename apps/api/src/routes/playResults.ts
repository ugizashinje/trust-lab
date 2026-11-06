import { STRATEGY_IDS } from '@trust-lab/game-core'
import type { FastifyInstance } from 'fastify'
import { pool } from '../db/pool'

/** Mirrors PlayResultPayload in apps/web/src/services/api.ts. */
interface PlayResultBody {
  locale: string
  totalScore: number
  matches: { opponent: string; moves: string; score: number; opponentScore: number }[]
}

const bodySchema = {
  type: 'object',
  required: ['locale', 'totalScore', 'matches'],
  additionalProperties: false,
  properties: {
    locale: { type: 'string', maxLength: 16 },
    totalScore: { type: 'integer', minimum: -1000, maximum: 1000 },
    matches: {
      type: 'array',
      maxItems: 10,
      items: {
        type: 'object',
        required: ['opponent', 'moves', 'score', 'opponentScore'],
        additionalProperties: false,
        properties: {
          opponent: { type: 'string', enum: STRATEGY_IDS },
          moves: { type: 'string', pattern: '^[CD]{1,50}$' },
          score: { type: 'integer' },
          opponentScore: { type: 'integer' },
        },
      },
    },
  },
} as const

export async function playResultRoutes(app: FastifyInstance) {
  app.post<{ Body: PlayResultBody }>(
    '/api/play-results',
    { schema: { body: bodySchema } },
    async (req, reply) => {
      const { locale, totalScore, matches } = req.body
      await pool.query(
        'INSERT INTO play_results (locale, total_score, matches) VALUES ($1, $2, $3)',
        [locale, totalScore, JSON.stringify(matches)],
      )
      return reply.code(201).send({ ok: true })
    },
  )

  /** Aggregate stats, e.g. for a future "how did others play?" screen. */
  app.get('/api/stats', async () => {
    const { rows } = await pool.query<{ games: string; avg_score: string | null }>(
      'SELECT count(*) AS games, avg(total_score) AS avg_score FROM play_results',
    )
    const row = rows[0]
    return {
      games: Number(row?.games ?? 0),
      averageScore: row?.avg_score ? Number(row.avg_score) : null,
    }
  })
}
