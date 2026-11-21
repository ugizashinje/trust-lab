<script setup lang="ts">
import type { StrategyId } from '@trust-lab/game-core'
import { useI18n } from 'vue-i18n'
import StrategyAvatar from '@/components/StrategyAvatar.vue'

defineProps<{
  id: StrategyId
  /** Hide the technical name and use a smaller icon. */
  compact?: boolean
  /** Show the one-line description underneath. */
  describe?: boolean
}>()

const { t } = useI18n()
</script>

<template>
  <span class="inline-flex items-center gap-2.5 text-left">
    <StrategyAvatar :id="id" :class="compact ? 'size-7' : 'size-9'" />
    <span class="flex flex-col leading-tight">
      <strong>{{ t(`strategies.${id}.name`) }}</strong>
      <small v-if="!compact" class="text-muted">{{ t(`strategies.${id}.tech`) }}</small>
      <span v-if="describe" class="mt-1 text-ink-soft">{{ t(`strategies.${id}.desc`) }}</span>
    </span>
  </span>
</template>
