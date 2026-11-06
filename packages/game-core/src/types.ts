/** A single choice in one round: cooperate (share) or defect (keep). */
export type Move = 'C' | 'D'

/**
 * Classic prisoner's dilemma payoffs.
 * The dilemma exists while temptation > reward > punishment > sucker.
 */
export interface Payoffs {
  /** I defect, they cooperate. */
  temptation: number
  /** We both cooperate. */
  reward: number
  /** We both defect. */
  punishment: number
  /** I cooperate, they defect. */
  sucker: number
}

export type StrategyId =
  | 'alwaysCooperate'
  | 'alwaysDefect'
  | 'titForTat'
  | 'grimTrigger'
  | 'pavlov'
  | 'titForTwoTats'
  | 'prober'

export interface DecisionContext {
  /** 0-based index of the round being decided. */
  round: number
  /** My moves so far (what actually happened, after noise). */
  mine: readonly Move[]
  /** Opponent's moves so far (what actually happened, after noise). */
  theirs: readonly Move[]
  rng: () => number
}

export interface Strategy {
  id: StrategyId
  decide(ctx: DecisionContext): Move
}

export interface MatchOptions {
  rounds: number
  payoffs?: Payoffs
  /** Probability (0..1) that an intended move is flipped by mistake. */
  noise?: number
  rng?: () => number
}

export interface MatchResult {
  movesA: Move[]
  movesB: Move[]
  scoreA: number
  scoreB: number
}

export interface Agent {
  /** Stable unique id, useful as a Vue :key. */
  id: number
  strategy: StrategyId
}
