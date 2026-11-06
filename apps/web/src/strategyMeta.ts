import { STRATEGY_IDS, type StrategyId } from '@trust-lab/game-core'

/** Visual identity of each strategy. Names and descriptions live in i18n. */
export const STRATEGY_META: Record<StrategyId, { color: string; icon: string }> = {
  alwaysCooperate: { color: '#5cb87a', icon: '🕊️' },
  alwaysDefect: { color: '#e0604f', icon: '🦊' },
  titForTat: { color: '#4a7fd6', icon: '🪞' },
  grimTrigger: { color: '#8a63d2', icon: '🐘' },
  pavlov: { color: '#e8a33d', icon: '🔔' },
  titForTwoTats: { color: '#2aa198', icon: '🐢' },
  prober: { color: '#d8579a', icon: '🔍' },
  random: { color: '#8b95a5', icon: '🎲' },
}

export { STRATEGY_IDS }
