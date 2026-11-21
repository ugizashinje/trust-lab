import { STRATEGY_IDS, type StrategyId } from '@trust-lab/game-core'
import dog from '@/components/characters/dog.svg'
import dove from '@/components/characters/dove.svg'
import elephant from '@/components/characters/elephant.svg'
import fox from '@/components/characters/fox.svg'
import monkey from '@/components/characters/monkey.svg'
import shark from '@/components/characters/shark.svg'
import tortoise from '@/components/characters/turtle.svg'

/**
 * Visual identity of each strategy. Names and descriptions live in i18n.
 * `avatar` is the character's round SVG emblem, shown on a disc of `color`.
 */
export const STRATEGY_META: Record<StrategyId, { color: string; avatar: string }> = {
  alwaysCooperate: { color: '#5cb87a', avatar: dove },
  alwaysDefect: { color: '#e0604f', avatar: shark },
  titForTat: { color: '#8ec5f0', avatar: monkey },
  grimTrigger: { color: '#8a63d2', avatar: elephant },
  pavlov: { color: '#7c8798', avatar: dog },
  titForTwoTats: { color: '#2aa198', avatar: tortoise },
  prober: { color: '#d8579a', avatar: fox },
}

export { STRATEGY_IDS }
