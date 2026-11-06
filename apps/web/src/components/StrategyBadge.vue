<script setup lang="ts">
import type { StrategyId } from '@trust-lab/game-core'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { STRATEGY_META } from '@/strategyMeta'

const props = defineProps<{
  id: StrategyId
  /** Hide the technical name and use a smaller icon. */
  compact?: boolean
  /** Show the one-line description underneath. */
  describe?: boolean
}>()

const { t } = useI18n()
const meta = computed(() => STRATEGY_META[props.id])
</script>

<template>
  <span class="inline-flex items-center gap-2.5 text-left">
    <span
      class="grid flex-none place-items-center rounded-full"
      :class="compact ? 'size-7 text-[0.95rem]' : 'size-9 text-lg'"
      :style="{ background: meta.color }"
      aria-hidden="true"
    >
      {{ meta.icon }}
    </span>
    <span class="flex flex-col leading-tight">
      <strong>{{ t(`strategies.${id}.name`) }}</strong>
      <small v-if="!compact" class="text-muted">{{ t(`strategies.${id}.tech`) }}</small>
      <span v-if="describe" class="mt-1 text-ink-soft">{{ t(`strategies.${id}.desc`) }}</span>
    </span>
  </span>
</template>
