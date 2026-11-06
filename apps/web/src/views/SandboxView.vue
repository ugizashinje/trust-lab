<script setup lang="ts">
import { DEFAULT_PAYOFFS } from '@trust-lab/game-core'
import { useI18n } from 'vue-i18n'
import EvolutionSim from '@/components/EvolutionSim.vue'
import type { SimConfig } from '@/composables/useEvolution'

const { t } = useI18n()

const config: SimConfig = {
  population: {
    alwaysCooperate: 4,
    alwaysDefect: 4,
    titForTat: 4,
    grimTrigger: 3,
    pavlov: 3,
    titForTwoTats: 3,
    prober: 2,
    random: 2,
  },
  rounds: 10,
  noise: 0.05,
  replace: 5,
  payoffs: { ...DEFAULT_PAYOFFS },
}
</script>

<template>
  <article class="space-y-5">
    <h1>{{ t('sandbox.title') }}</h1>
    <p class="lead">{{ t('sandbox.intro') }}</p>
    <EvolutionSim :config="config" editable />
  </article>
</template>
