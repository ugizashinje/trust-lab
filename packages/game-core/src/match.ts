import { DEFAULT_PAYOFFS, scoreRound } from './payoffs'
import { getStrategy } from './strategies'
import type { MatchOptions, MatchResult, Move, StrategyId } from './types'

export function applyNoise(move: Move, noise: number, rng: () => number): Move {
  if (noise > 0 && rng() < noise) return move === 'C' ? 'D' : 'C'
  return move
}

/** Plays a full repeated match between two strategies. */
export function playMatch(a: StrategyId, b: StrategyId, opts: MatchOptions): MatchResult {
  const { rounds, payoffs = DEFAULT_PAYOFFS, noise = 0, rng = Math.random } = opts
  const sa = getStrategy(a)
  const sb = getStrategy(b)
  const movesA: Move[] = []
  const movesB: Move[] = []
  let scoreA = 0
  let scoreB = 0

  for (let round = 0; round < rounds; round++) {
    const ma = applyNoise(sa.decide({ round, mine: movesA, theirs: movesB, rng }), noise, rng)
    const mb = applyNoise(sb.decide({ round, mine: movesB, theirs: movesA, rng }), noise, rng)
    const [pa, pb] = scoreRound(ma, mb, payoffs)
    movesA.push(ma)
    movesB.push(mb)
    scoreA += pa
    scoreB += pb
  }

  return { movesA, movesB, scoreA, scoreB }
}

export interface RoundOutcome {
  human: Move
  bot: Move
  humanPoints: number
  botPoints: number
}

/**
 * Stateful match for interactive play: the human supplies a move and the bot
 * answers based on the history so far.
 */
export class InteractiveMatch {
  readonly human: Move[] = []
  readonly bot: Move[] = []
  humanScore = 0
  botScore = 0

  constructor(
    readonly opponent: StrategyId,
    private readonly opts: Omit<MatchOptions, 'rounds'> = {},
  ) {}

  play(humanMove: Move): RoundOutcome {
    const rng = this.opts.rng ?? Math.random
    const botIntent = getStrategy(this.opponent).decide({
      round: this.human.length,
      mine: this.bot,
      theirs: this.human,
      rng,
    })
    const bot = applyNoise(botIntent, this.opts.noise ?? 0, rng)
    const [humanPoints, botPoints] = scoreRound(humanMove, bot, this.opts.payoffs ?? DEFAULT_PAYOFFS)
    this.human.push(humanMove)
    this.bot.push(bot)
    this.humanScore += humanPoints
    this.botScore += botPoints
    return { human: humanMove, bot, humanPoints, botPoints }
  }
}
