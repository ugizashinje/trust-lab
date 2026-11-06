<script setup lang="ts">
import { STRATEGY_IDS, type Population } from '@trust-lab/game-core'
import { computed } from 'vue'
import { STRATEGY_META } from '@/strategyMeta'

const props = defineProps<{ history: readonly Population[]; title: string }>()

const W = 600
const H = 160

/** Stacked area: each strategy's share of the population per generation. */
const areas = computed(() => {
  const first = props.history[0]
  if (!first) return []
  const h = props.history.length === 1 ? [first, first] : props.history
  const n = h.length
  const xs = h.map((_, i) => (i / (n - 1)) * W)
  const totals = h.map((p) => Object.values(p).reduce((a, b) => a + (b ?? 0), 0) || 1)
  const below = new Array<number>(n).fill(0)

  const out: { id: (typeof STRATEGY_IDS)[number]; points: string }[] = []
  for (const id of STRATEGY_IDS) {
    const vals = h.map((p) => p[id] ?? 0)
    if (vals.every((v) => v === 0)) continue
    const y = (value: number, i: number) => H - (value / totals[i]!) * H
    const top = vals.map((v, i) => `${xs[i]},${y(below[i]! + v, i)}`)
    const bottom = vals.map((_, i) => `${xs[i]},${y(below[i]!, i)}`).reverse()
    vals.forEach((v, i) => (below[i]! += v))
    out.push({ id, points: [...top, ...bottom].join(' ') })
  }
  return out
})
</script>

<template>
  <figure>
    <figcaption class="mb-1 text-sm text-muted">{{ title }}</figcaption>
    <svg
      class="block h-35 w-full rounded-lg bg-sand"
      :viewBox="`0 0 ${W} ${H}`"
      preserveAspectRatio="none"
      role="img"
      :aria-label="title"
    >
      <polygon v-for="a in areas" :key="a.id" :points="a.points" :fill="STRATEGY_META[a.id].color" />
    </svg>
  </figure>
</template>
