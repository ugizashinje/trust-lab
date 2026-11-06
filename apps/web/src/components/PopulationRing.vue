<script setup lang="ts">
import { STRATEGY_IDS, type Agent } from '@trust-lab/game-core'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { STRATEGY_META } from '@/strategyMeta'

const props = defineProps<{ agents: readonly Agent[] }>()
const { t } = useI18n()

const R = 130

/** Agents grouped by strategy so clusters are easy to read, then placed on a circle. */
const placed = computed(() => {
  const order = (a: Agent) => STRATEGY_IDS.indexOf(a.strategy)
  const sorted = [...props.agents].sort((a, b) => order(a) - order(b) || a.id - b.id)
  const n = Math.max(sorted.length, 1)
  return sorted.map((agent, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2
    return { agent, x: Math.cos(angle) * R, y: Math.sin(angle) * R }
  })
})

const dotR = computed(() => {
  const n = Math.max(props.agents.length, 1)
  return Math.max(5, Math.min(16, ((Math.PI * R) / n) * 0.8))
})
</script>

<template>
  <svg
    class="h-auto w-full overflow-visible"
    viewBox="-160 -160 320 320"
    role="img"
    :aria-label="t('sim.status.total', { n: agents.length })"
  >
    <circle class="fill-none stroke-line [stroke-dasharray:3_5]" :r="R" />
    <text
      class="fill-[#d8d0c3] font-display text-[42px] font-bold"
      text-anchor="middle"
      dominant-baseline="central"
    >
      {{ agents.length }}
    </text>
    <!--
      TransitionGroup only fades dots in/out on the outer <g>. Position lives on
      the inner <g>: if the outer one had a transform transition, TransitionGroup's
      FLIP "move" logic would take over and wipe the inline transform.
    -->
    <TransitionGroup tag="g" name="dot">
      <g v-for="p in placed" :key="p.agent.id">
        <g
          data-testid="ring-dot"
          class="transition-transform duration-600 ease-[cubic-bezier(0.3,0.7,0.3,1)]"
          :style="{ transform: `translate(${p.x}px, ${p.y}px)` }"
        >
          <circle :r="dotR" :fill="STRATEGY_META[p.agent.strategy].color" class="stroke-white stroke-2" />
          <text v-if="dotR >= 10" text-anchor="middle" dominant-baseline="central" :font-size="dotR * 1.05">
            {{ STRATEGY_META[p.agent.strategy].icon }}
          </text>
          <title>{{ t(`strategies.${p.agent.strategy}.name`) }}</title>
        </g>
      </g>
    </TransitionGroup>
  </svg>
</template>
