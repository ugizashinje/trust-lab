<script setup lang="ts">
import { DEFAULT_PAYOFFS, scoreRound, type Move, type RoundOutcome } from '@trust-lab/game-core'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DealTable from '@/components/DealTable.vue'
import PayoffMatrix from '@/components/PayoffMatrix.vue'

const { t } = useI18n()
/** Highlighted matrix cell: the last round played at the table, or a cell the visitor clicked. */
const selected = ref<{ you: Move; them: Move } | null>(null)

const outcome = computed(() => {
  const s = selected.value
  if (!s) return ''
  const [a, b] = scoreRound(s.you, s.them, DEFAULT_PAYOFFS)
  return t(`common.outcome.${s.you}${s.them}`, { you: a, them: b })
})

function onPlayed(o: RoundOutcome) {
  selected.value = { you: o.human, them: o.bot }
}

function select(you: Move, them: Move) {
  selected.value = { you, them }
}
</script>

<template>
  <article class="space-y-5">
    <h1>{{ t('rules.title') }}</h1>
    <p class="lead">{{ t('rules.intro') }}</p>

    <div class="card">
      <p class="mb-4">{{ t('rules.tryIt') }}</p>
      <DealTable @played="onPlayed" @reset="selected = null" />

      <p class="mt-4 min-h-[1.6em] text-center font-semibold" aria-live="polite" data-testid="outcome">
        {{ outcome }}
      </p>

      <hr class="my-4 border-line" />
      <PayoffMatrix :payoffs="DEFAULT_PAYOFFS" :selected="selected" @select="select" />
    </div>

    <div class="callout">
      <h2>{{ t('rules.trap.title') }}</h2>
      <p class="mb-3">{{ t('rules.trap.body', { ...DEFAULT_PAYOFFS }) }}</p>
      <p class="font-semibold">{{ t('rules.trap.question') }}</p>
    </div>
  </article>
</template>
