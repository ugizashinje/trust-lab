import { createRng, shuffle } from './random'
import { runTournament } from './tournament'
import type { Agent, MatchOptions, StrategyId } from './types'

export type Population = Partial<Record<StrategyId, number>>

export interface EvolutionOptions extends MatchOptions {
  /** How many of the lowest scorers are replaced each generation. */
  replace: number
}

export interface GenerationResult {
  /** Agents with their scores from this generation's tournament, best first. */
  ranked: { agent: Agent; score: number }[]
  /** The population for the next generation. */
  next: Agent[]
}

let nextId = 1
const newAgent = (strategy: StrategyId): Agent => ({ id: nextId++, strategy })

/** Build agents from counts, e.g. `{ titForTat: 5, alwaysDefect: 3 }`. */
export function createPopulation(counts: Population): Agent[] {
  const agents: Agent[] = []
  for (const [strategy, n] of Object.entries(counts) as [StrategyId, number][]) {
    for (let i = 0; i < n; i++) agents.push(newAgent(strategy))
  }
  return agents
}

export function countPopulation(agents: readonly Agent[]): Population {
  const counts: Population = {}
  for (const a of agents) counts[a.strategy] = (counts[a.strategy] ?? 0) + 1
  return counts
}

/**
 * One generation: everyone plays everyone, the `replace` worst are removed and
 * the `replace` best each get one copy. Ties are broken randomly so that list
 * order never biases the outcome.
 */
export function runGeneration(agents: readonly Agent[], opts: EvolutionOptions): GenerationResult {
  const rng = opts.rng ?? createRng()
  const { scores } = runTournament(agents, { ...opts, rng })
  const ranked = shuffle(agents, rng)
    .map((agent) => ({ agent, score: scores.get(agent.id) ?? 0 }))
    .sort((x, y) => y.score - x.score)

  const k = Math.max(0, Math.min(opts.replace, Math.floor(agents.length / 2)))
  const survivors = ranked.slice(0, ranked.length - k).map((r) => r.agent)
  const offspring = ranked.slice(0, k).map((r) => newAgent(r.agent.strategy))

  return { ranked, next: [...survivors, ...offspring] }
}

/** True when only a single strategy remains. */
export function isSettled(agents: readonly Agent[]): boolean {
  return new Set(agents.map((a) => a.strategy)).size <= 1
}
