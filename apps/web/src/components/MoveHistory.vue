<script setup lang="ts">
import type { Move } from '@trust-lab/game-core'
import { useI18n } from 'vue-i18n'

defineProps<{ rows: { label: string; moves: readonly Move[] }[] }>()
const { t } = useI18n()
const SYMBOL: Record<Move, string> = { C: '✓', D: '✕' }
</script>

<template>
  <div class="grid gap-1.5 overflow-x-auto">
    <div v-for="row in rows" :key="row.label" class="flex items-center gap-2">
      <span class="w-18 flex-none text-sm text-muted">{{ row.label }}</span>
      <ol class="flex gap-1">
        <li
          v-for="(m, i) in row.moves"
          :key="i"
          class="grid size-6.5 place-items-center rounded-md text-sm font-bold text-white"
          :class="m === 'C' ? 'bg-share' : 'bg-keep'"
          :title="t(`common.moves.${m}`)"
        >
          <span aria-hidden="true">{{ SYMBOL[m] }}</span>
          <span class="sr-only">{{ t(`common.moves.${m}`) }}</span>
        </li>
      </ol>
    </div>
  </div>
</template>
