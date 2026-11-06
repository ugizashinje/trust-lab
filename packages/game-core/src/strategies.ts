import type { Move, Strategy, StrategyId } from './types'

const last = (moves: readonly Move[]): Move | undefined => moves[moves.length - 1]

export const STRATEGIES: Readonly<Record<StrategyId, Strategy>> = {
  /** Always shares. */
  alwaysCooperate: { id: 'alwaysCooperate', decide: () => 'C' },

  /** Never shares. */
  alwaysDefect: { id: 'alwaysDefect', decide: () => 'D' },

  /** Opens with sharing, then repeats whatever the opponent did last. */
  titForTat: {
    id: 'titForTat',
    decide: ({ theirs }) => last(theirs) ?? 'C',
  },

  /** Shares until betrayed once, then never shares again. */
  grimTrigger: {
    id: 'grimTrigger',
    decide: ({ theirs }) => (theirs.includes('D') ? 'D' : 'C'),
  },

  /**
   * Win-stay, lose-shift: shares when both made the same choice last round,
   * keeps when the choices differed.
   */
  pavlov: {
    id: 'pavlov',
    decide: ({ mine, theirs }) => {
      const m = last(mine)
      const t = last(theirs)
      if (!m || !t) return 'C'
      return m === t ? 'C' : 'D'
    },
  },

  /** Forgiving: only retaliates after two betrayals in a row. */
  titForTwoTats: {
    id: 'titForTwoTats',
    decide: ({ theirs }) => {
      const n = theirs.length
      return n >= 2 && theirs[n - 1] === 'D' && theirs[n - 2] === 'D' ? 'D' : 'C'
    },
  },

  /**
   * Probes with Keep, Share, Share. If the opponent hit back during the probe,
   * it behaves like Tit for Tat; if not, it exploits them forever.
   */
  prober: {
    id: 'prober',
    decide: ({ round, theirs }) => {
      const opening: Move[] = ['D', 'C', 'C']
      if (round < opening.length) return opening[round]!
      const retaliated = theirs[1] === 'D' || theirs[2] === 'D'
      return retaliated ? (last(theirs) ?? 'C') : 'D'
    },
  },

  /** Flips a coin. */
  random: {
    id: 'random',
    decide: ({ rng }) => (rng() < 0.5 ? 'C' : 'D'),
  },
}

export const STRATEGY_IDS = Object.keys(STRATEGIES) as StrategyId[]

export function getStrategy(id: StrategyId): Strategy {
  return STRATEGIES[id]
}
