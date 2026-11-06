<script setup lang="ts">
import { DEFAULT_PAYOFFS, scoreRound, type Move } from '@trust-lab/game-core'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PayoffMatrix from '@/components/PayoffMatrix.vue'

const { t } = useI18n()
const MOVES: Move[] = ['C', 'D']
const you = ref<Move>('C')
const them = ref<Move>('D')

const outcome = computed(() => {
  const [a, b] = scoreRound(you.value, them.value, DEFAULT_PAYOFFS)
  return t(`common.outcome.${you.value}${them.value}`, { you: a, them: b })
})

function select(a: Move, b: Move) {
  you.value = a
  them.value = b
}
</script>

<template>
  <article class="space-y-5">
    <h1>{{ t('rules.title') }}</h1>
    <p class="lead">{{ t('rules.intro') }}</p>

    <div class="card">
      <p class="mb-4">{{ t('rules.tryIt') }}</p>
      <div class="mb-4 flex flex-wrap gap-6">
        <div class="flex flex-col gap-1.5">
          <span class="text-sm text-muted">{{ t('rules.matrix.you') }}</span>
          <div class="segmented" role="group" :aria-label="t('rules.matrix.you')">
            <button
              v-for="m in MOVES"
              :key="m"
              type="button"
              :class="`move-${m}`"
              :aria-pressed="you === m"
              @click="you = m"
            >
              {{ t(`common.moves.${m}`) }}
            </button>
          </div>
        </div>
        <div class="flex flex-col gap-1.5">
          <span class="text-sm text-muted">{{ t('rules.matrix.them') }}</span>
          <div class="segmented" role="group" :aria-label="t('rules.matrix.them')">
            <button
              v-for="m in MOVES"
              :key="m"
              type="button"
              :class="`move-${m}`"
              :aria-pressed="them === m"
              @click="them = m"
            >
              {{ t(`common.moves.${m}`) }}
            </button>
          </div>
        </div>
      </div>

      <p class="min-h-[1.6em] font-semibold" aria-live="polite" data-testid="outcome">{{ outcome }}</p>

      <PayoffMatrix :payoffs="DEFAULT_PAYOFFS" :selected="{ you, them }" @select="select" />
    </div>

    <div class="callout">
      <h2>{{ t('rules.trap.title') }}</h2>
      <p class="mb-3">{{ t('rules.trap.body', { ...DEFAULT_PAYOFFS }) }}</p>
      <p class="font-semibold">{{ t('rules.trap.question') }}</p>
    </div>
  </article>
</template>
