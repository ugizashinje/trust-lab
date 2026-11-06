<script setup lang="ts">
import { DEFAULT_PAYOFFS } from '@trust-lab/game-core'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ScenarioSim, { type Scenario } from '@/components/ScenarioSim.vue'
import type { SimConfig } from '@/composables/useEvolution'

const { t } = useI18n()

const crowd = { alwaysCooperate: 15, alwaysDefect: 5, titForTat: 5 }

/** Kept outside `computed` so switching language does not reset a running simulation. */
const CONFIGS = {
  doves: { population: crowd, rounds: 10, replace: 5, noise: 0, payoffs: DEFAULT_PAYOFFS },
  oneShot: { population: crowd, rounds: 1, replace: 5, noise: 0, payoffs: DEFAULT_PAYOFFS },
  everyone: {
    population: {
      alwaysCooperate: 3,
      alwaysDefect: 3,
      titForTat: 3,
      grimTrigger: 3,
      pavlov: 3,
      titForTwoTats: 3,
      prober: 3,
    },
    rounds: 10,
    replace: 4,
    noise: 0,
    payoffs: DEFAULT_PAYOFFS,
  },
} satisfies Record<string, SimConfig>

const scenarios = computed<Scenario[]>(() => [
  {
    id: 'doves',
    title: t('evolution.scenarios.doves.title'),
    desc: t('evolution.scenarios.doves.desc'),
    config: CONFIGS.doves,
  },
  {
    id: 'oneShot',
    title: t('evolution.scenarios.oneShot.title'),
    desc: t('evolution.scenarios.oneShot.desc'),
    config: CONFIGS.oneShot,
  },
  {
    id: 'everyone',
    title: t('evolution.scenarios.everyone.title'),
    desc: t('evolution.scenarios.everyone.desc'),
    config: CONFIGS.everyone,
  },
])
</script>

<template>
  <article class="space-y-5">
    <h1>{{ t('evolution.title') }}</h1>
    <p class="lead">{{ t('evolution.intro') }}</p>
    <ScenarioSim :scenarios="scenarios" />
  </article>
</template>
