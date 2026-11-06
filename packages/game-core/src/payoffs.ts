import type { Move, Payoffs } from './types'

/** Axelrod's classic tournament values. */
export const DEFAULT_PAYOFFS: Readonly<Payoffs> = Object.freeze({
  temptation: 5,
  reward: 3,
  punishment: 1,
  sucker: 0,
})

/** Points for [a, b] given both moves. */
export function scoreRound(a: Move, b: Move, p: Payoffs = DEFAULT_PAYOFFS): [number, number] {
  if (a === 'C' && b === 'C') return [p.reward, p.reward]
  if (a === 'C' && b === 'D') return [p.sucker, p.temptation]
  if (a === 'D' && b === 'C') return [p.temptation, p.sucker]
  return [p.punishment, p.punishment]
}

/** True when the payoffs actually form a prisoner's dilemma. */
export function isDilemma(p: Payoffs): boolean {
  return p.temptation > p.reward && p.reward > p.punishment && p.punishment > p.sucker
}
