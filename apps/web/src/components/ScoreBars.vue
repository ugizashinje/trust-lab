<script setup lang="ts">
import type { StrategyId } from '@trust-lab/game-core'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { STRATEGY_META } from '@/strategyMeta'
import StrategyBadge from './StrategyBadge.vue'

const props = defineProps<{ items: { id: StrategyId; score: number }[] }>()
const { t } = useI18n()
const max = computed(() => Math.max(1, ...props.items.map((i) => i.score)))
</script>

<template>
  <ol class="grid gap-2">
    <li
      v-for="(item, rank) in items"
      :key="item.id"
      class="grid grid-cols-[1.5rem_9.5rem_1fr_5rem] items-center gap-2.5"
    >
      <span class="text-right font-semibold text-muted">{{ rank + 1 }}</span>
      <StrategyBadge :id="item.id" compact />
      <span class="h-3.5 overflow-hidden rounded-full bg-[#f1ece4]">
        <span
          class="block h-full rounded-full transition-[width] duration-500"
          :style="{
            width: `${(Math.max(0, item.score) / max) * 100}%`,
            background: STRATEGY_META[item.id].color,
          }"
        />
      </span>
      <span class="text-right text-sm tabular-nums">{{ t('common.labels.points', item.score) }}</span>
    </li>
  </ol>
</template>
