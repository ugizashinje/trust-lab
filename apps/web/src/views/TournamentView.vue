<script setup lang="ts">
import { STRATEGY_IDS, createPopulation, runTournament, type StrategyId } from '@trust-lab/game-core'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ScoreBars from '@/components/ScoreBars.vue'
import StrategyBadge from '@/components/StrategyBadge.vue'

const { t } = useI18n()
const selected = ref<StrategyId[]>([...STRATEGY_IDS])
const rounds = ref(10)
const results = ref<{ id: StrategyId; score: number }[]>([])

function run() {
  if (selected.value.length < 2) {
    results.value = []
    return
  }
  const agents = createPopulation(Object.fromEntries(selected.value.map((id) => [id, 1])))
  const { scores } = runTournament(agents, { rounds: rounds.value })
  results.value = agents
    .map((a) => ({ id: a.strategy, score: scores.get(a.id) ?? 0 }))
    .sort((a, b) => b.score - a.score)
}

watch([selected, rounds], run, { deep: true, immediate: true })
</script>

<template>
  <article class="space-y-5">
    <h1>{{ t('tournament.title') }}</h1>
    <p class="lead">{{ t('tournament.intro') }}</p>

    <div class="card">
      <fieldset class="mb-4 flex flex-wrap gap-2">
        <legend class="mb-2 font-semibold">{{ t('tournament.participants') }}</legend>
        <label
          v-for="id in STRATEGY_IDS"
          :key="id"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-[#fbfaf7] py-1 pr-3 pl-2 has-checked:border-line-strong has-checked:bg-white"
        >
          <input v-model="selected" type="checkbox" :value="id" class="peer accent-accent" />
          <span class="peer-not-checked:opacity-45">
            <StrategyBadge :id="id" compact />
          </span>
        </label>
      </fieldset>

      <label class="flex flex-col gap-1">
        <span>{{ t('tournament.rounds', { n: rounds }) }}</span>
        <input v-model.number="rounds" type="range" min="1" max="30" />
      </label>
    </div>

    <section class="card">
      <header class="mb-4 flex items-center justify-between gap-4">
        <h2 class="m-0">{{ t('tournament.results') }}</h2>
        <button type="button" class="btn" :disabled="selected.length < 2" @click="run">
          {{ t('tournament.rerun') }}
        </button>
      </header>
      <ScoreBars v-if="results.length" :items="results" data-testid="leaderboard" />
      <p v-else class="text-sm text-warn">{{ t('tournament.empty') }}</p>
    </section>

    <p class="callout">{{ t('tournament.insight') }}</p>
  </article>
</template>
