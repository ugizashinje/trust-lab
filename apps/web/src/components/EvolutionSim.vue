<script setup lang="ts">
import { STRATEGY_IDS, countPopulation, isDilemma, type StrategyId } from '@trust-lab/game-core'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { cloneConfig, useEvolution, type SimConfig } from '@/composables/useEvolution'
import PopulationChart from './PopulationChart.vue'
import PopulationRing from './PopulationRing.vue'
import StrategyBadge from './StrategyBadge.vue'

const props = defineProps<{
  config: SimConfig
  /** Show the full settings panel (sandbox). */
  editable?: boolean
}>()

const { t } = useI18n()
const cfg = ref<SimConfig>(cloneConfig(props.config))
watch(
  () => props.config,
  (c) => (cfg.value = cloneConfig(c)),
)

const { agents, history, generation, running, settled, step, toggle, reset } = useEvolution(cfg)

const current = computed(() => countPopulation(agents.value))
const startTotal = computed(() =>
  Object.values(cfg.value.population).reduce((a, b) => a + (b ?? 0), 0),
)
/** Legend shows everyone who started, so extinct strategies are visible as 0. */
const legend = computed(() => STRATEGY_IDS.filter((id) => (cfg.value.population[id] ?? 0) > 0))
const survivor = computed(() => {
  const first = agents.value[0]
  return settled.value && first ? t(`strategies.${first.strategy}.name`) : ''
})
const dilemma = computed(() => isDilemma(cfg.value.payoffs))
const tooSmall = computed(() => agents.value.length < 2)

const MAX_PER_STRATEGY = 15
const PAYOFF_KEYS = ['temptation', 'reward', 'punishment', 'sucker'] as const

function setCount(id: StrategyId, e: Event) {
  cfg.value.population[id] = Number((e.target as HTMLInputElement).value)
}

const noisePct = computed({
  get: () => Math.round(cfg.value.noise * 100),
  set: (v: number) => (cfg.value.noise = v / 100),
})
</script>

<template>
  <section class="card">
    <div class="grid items-center gap-6 md:grid-cols-[minmax(240px,320px)_1fr]">
      <PopulationRing :agents="agents" />

      <div>
        <p class="mb-3 flex flex-wrap items-center gap-3">
          <strong data-testid="generation">{{ t('sim.status.generation', { n: generation }) }}</strong>
          <span
            v-if="survivor"
            class="rounded-full bg-accent-soft px-3 py-0.5 text-sm font-semibold text-accent"
            data-testid="settled"
          >
            {{ t('sim.status.settled', { name: survivor }) }}
          </span>
        </p>

        <ul class="mb-4 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-x-4 gap-y-1.5">
          <li
            v-for="id in legend"
            :key="id"
            class="flex items-center justify-between gap-2 transition-opacity"
            :class="{ 'opacity-35': !current[id] }"
          >
            <StrategyBadge :id="id" compact />
            <span class="font-bold tabular-nums">{{ current[id] ?? 0 }}</span>
          </li>
        </ul>

        <PopulationChart :history="history" :title="t('sim.chart.title')" />
      </div>
    </div>

    <div class="mt-4 flex flex-wrap items-center gap-2">
      <button type="button" class="btn btn-primary" :disabled="settled || tooSmall" @click="toggle">
        {{ running ? t('sim.controls.pause') : t('sim.controls.play') }}
      </button>
      <button type="button" class="btn" :disabled="running || settled || tooSmall" @click="step">
        {{ t('sim.controls.step') }}
      </button>
      <button type="button" class="btn btn-ghost" @click="reset">
        {{ t('sim.controls.reset') }}
      </button>
      <span v-if="tooSmall" class="text-sm text-warn">{{ t('sim.status.tooSmall') }}</span>
    </div>

    <div
      v-if="editable"
      class="mt-6 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 border-t border-line pt-4"
    >
      <fieldset class="rounded-xl border border-line px-4 py-3">
        <legend class="px-1 font-semibold">
          {{ t('sim.settings.population') }} · {{ t('sim.status.total', { n: startTotal }) }}
        </legend>
        <label
          v-for="id in STRATEGY_IDS"
          :key="id"
          class="mb-1 grid grid-cols-[8.5rem_1fr_2rem] items-center gap-2"
        >
          <StrategyBadge :id="id" compact />
          <input
            type="range"
            min="0"
            :max="MAX_PER_STRATEGY"
            :value="cfg.population[id] ?? 0"
            :aria-label="t(`strategies.${id}.name`)"
            @input="setCount(id, $event)"
          />
          <output class="text-right tabular-nums">{{ cfg.population[id] ?? 0 }}</output>
        </label>
      </fieldset>

      <fieldset class="rounded-xl border border-line px-4 py-3">
        <legend class="px-1 font-semibold">{{ t('sim.settings.title') }}</legend>
        <label class="mb-3 flex flex-col gap-1">
          <span>{{ t('sim.settings.rounds', { n: cfg.rounds }) }}</span>
          <input v-model.number="cfg.rounds" type="range" min="1" max="30" />
        </label>
        <label class="mb-3 flex flex-col gap-1">
          <span>{{ t('sim.settings.noise', { n: noisePct }) }}</span>
          <input v-model.number="noisePct" type="range" min="0" max="50" />
        </label>
        <label class="mb-3 flex flex-col gap-1">
          <span>{{ t('sim.settings.replace', { n: cfg.replace }) }}</span>
          <input v-model.number="cfg.replace" type="range" min="1" max="10" />
        </label>
      </fieldset>

      <fieldset class="rounded-xl border border-line px-4 py-3">
        <legend class="px-1 font-semibold">{{ t('sim.payoffs.title') }}</legend>
        <label
          v-for="key in PAYOFF_KEYS"
          :key="key"
          class="mb-3 flex items-center justify-between gap-4"
        >
          <span>{{ t(`sim.payoffs.${key}`) }}</span>
          <input
            v-model.number="cfg.payoffs[key]"
            type="number"
            min="-5"
            max="10"
            step="1"
            class="w-18 rounded-lg border border-line px-2 py-1"
          />
        </label>
        <p v-if="!dilemma" class="text-sm text-warn">{{ t('sim.status.notDilemma') }}</p>
      </fieldset>
    </div>
  </section>
</template>
