<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SimConfig } from '@/composables/useEvolution'
import EvolutionSim from './EvolutionSim.vue'

export interface Scenario {
  id: string
  title: string
  desc: string
  config: SimConfig
}

const props = defineProps<{ scenarios: Scenario[] }>()
const activeId = ref(props.scenarios[0]?.id)
const active = computed(
  () => props.scenarios.find((s) => s.id === activeId.value) ?? props.scenarios[0],
)
</script>

<template>
  <div>
    <div class="mb-3 flex flex-wrap gap-2" role="tablist">
      <button
        v-for="s in scenarios"
        :key="s.id"
        type="button"
        role="tab"
        class="cursor-pointer rounded-full border border-line bg-white px-4 py-2 aria-selected:border-ink aria-selected:bg-ink aria-selected:text-white"
        :aria-selected="s.id === activeId"
        @click="activeId = s.id"
      >
        {{ s.title }}
      </button>
    </div>
    <template v-if="active">
      <p class="mb-4 text-ink-soft">{{ active.desc }}</p>
      <EvolutionSim :key="active.id" :config="active.config" />
    </template>
  </div>
</template>
