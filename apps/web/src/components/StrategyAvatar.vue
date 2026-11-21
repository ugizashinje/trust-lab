<script setup lang="ts">
import type { StrategyId } from '@trust-lab/game-core'
import { STRATEGY_META } from '@/strategyMeta'

/**
 * Round animal emblem on a band of the strategy's colour. Decorative: the animal's
 * name is always shown (or given as sr-only text) next to it. Size it from
 * the outside with `size-*` classes.
 */
defineProps<{ id: StrategyId }>()
</script>

<template>
  <span
    class="block flex-none overflow-hidden rounded-full"
    :style="{ background: STRATEGY_META[id].color }"
    aria-hidden="true"
  >
    <img :src="STRATEGY_META[id].avatar" alt="" draggable="false" class="size-full object-contain select-none" />
  </span>
</template>
