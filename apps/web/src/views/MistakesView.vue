<script setup lang="ts">
import { DEFAULT_PAYOFFS } from '@trust-lab/game-core'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ScenarioSim, { type Scenario } from '@/components/ScenarioSim.vue'
import type { SimConfig } from '@/composables/useEvolution'

const { t } = useI18n()

const population = { titForTat: 6, grimTrigger: 6, pavlov: 6, titForTwoTats: 6, alwaysDefect: 1 }

/** Kept outside `computed` so switching language does not reset a running simulation. */
const CONFIGS = {
  clean: { population, rounds: 20, replace: 4, noise: 0, payoffs: DEFAULT_PAYOFFS },
  noisy: { population, rounds: 20, replace: 4, noise: 0.1, payoffs: DEFAULT_PAYOFFS },
} satisfies Record<string, SimConfig>

const scenarios = computed<Scenario[]>(() => [
  {
    id: 'clean',
    title: t('mistakes.scenarios.clean.title'),
    desc: t('mistakes.scenarios.clean.desc'),
    config: CONFIGS.clean,
  },
  {
    id: 'noisy',
    title: t('mistakes.scenarios.noisy.title'),
    desc: t('mistakes.scenarios.noisy.desc'),
    config: CONFIGS.noisy,
  },
])
</script>

<template>
  <article class="space-y-5">
    <h1>{{ t('mistakes.title') }}</h1>
    <p class="lead">{{ t('mistakes.intro') }}</p>
    <ScenarioSim :scenarios="scenarios" />
    <p class="callout">{{ t('mistakes.lesson') }}</p>
  </article>
</template>
