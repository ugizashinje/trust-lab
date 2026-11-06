<script setup lang="ts">
import { scoreRound, type Move, type Payoffs } from '@trust-lab/game-core'
import { useI18n } from 'vue-i18n'

defineProps<{
  payoffs: Payoffs
  selected?: { you: Move; them: Move } | null
}>()

const emit = defineEmits<{ select: [you: Move, them: Move] }>()
const { t } = useI18n()
const MOVES: Move[] = ['C', 'D']
const moveColor = (m: Move) => (m === 'C' ? 'text-share' : 'text-keep')
</script>

<template>
  <table class="mt-2 border-separate border-spacing-1.5">
    <caption class="caption-bottom pt-1 text-left text-sm text-muted">
      {{ t('rules.matrix.caption') }}
    </caption>
    <thead>
      <tr>
        <th scope="col" class="px-2.5 py-1.5 text-left text-xs font-normal text-muted">
          <span class="block">{{ t('rules.matrix.you') }} ↓</span>
          <span class="block">{{ t('rules.matrix.them') }} →</span>
        </th>
        <th v-for="them in MOVES" :key="them" scope="col" class="px-2.5 py-1.5" :class="moveColor(them)">
          {{ t(`common.moves.${them}`) }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="you in MOVES" :key="you">
        <th scope="row" class="px-2.5 py-1.5" :class="moveColor(you)">{{ t(`common.moves.${you}`) }}</th>
        <td v-for="them in MOVES" :key="them">
          <button
            type="button"
            class="w-full min-w-26 cursor-pointer rounded-xl border-2 p-3 text-xl transition"
            :class="
              selected?.you === you && selected?.them === them
                ? 'border-ink bg-white shadow-card'
                : 'border-line bg-[#fbfaf7] hover:border-line-strong'
            "
            :aria-pressed="selected?.you === you && selected?.them === them"
            @click="emit('select', you, them)"
          >
            <span class="font-bold">{{ scoreRound(you, them, payoffs)[0] }}</span>
            <span class="mx-1.5 text-line">/</span>
            <span class="text-muted">{{ scoreRound(you, them, payoffs)[1] }}</span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
