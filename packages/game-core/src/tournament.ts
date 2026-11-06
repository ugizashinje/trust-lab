import { playMatch } from './match'
import type { Agent, MatchOptions } from './types'

export interface TournamentResult {
  /** Total score per agent id. */
  scores: Map<number, number>
}

/** Round robin: every agent plays every other agent exactly once. */
export function runTournament(agents: readonly Agent[], opts: MatchOptions): TournamentResult {
  const scores = new Map<number, number>(agents.map((a) => [a.id, 0]))
  for (let i = 0; i < agents.length; i++) {
    for (let j = i + 1; j < agents.length; j++) {
      const a = agents[i]!
      const b = agents[j]!
      const r = playMatch(a.strategy, b.strategy, opts)
      scores.set(a.id, scores.get(a.id)! + r.scoreA)
      scores.set(b.id, scores.get(b.id)! + r.scoreB)
    }
  }
  return { scores }
}
