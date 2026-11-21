<script setup lang="ts">
import { InteractiveMatch, type Move, type RoundOutcome } from '@trust-lab/game-core'
import { computed, ref, shallowRef, triggerRef } from 'vue'
import { useI18n } from 'vue-i18n'
import MoveHistory from '@/components/MoveHistory.vue'
import StrategyAvatar from '@/components/StrategyAvatar.vue'

/**
 * A tiny practice match: the visitor plays the Monkey, the Fox plays its
 * real strategy. Every click is one full round, and both animals react:
 * both share → coin shower + cheer; one keeps → coins slide to the keeper,
 * who gloats while the sharer sulks; both keep → red-eyed glare with lasers.
 */
const emit = defineEmits<{ played: [outcome: RoundOutcome]; reset: [] }>()
const { t } = useI18n()

const MOVES: Move[] = ['C', 'D']
const SYMBOL: Record<Move, string> = { C: '✓', D: '✕' }

const match = shallowRef(new InteractiveMatch('prober'))
const last = ref<RoundOutcome | null>(null)
/** Bumped every round so cards and reactions re-run their animations. */
const revealKey = ref(0)

function choose(move: Move) {
  const outcome = match.value.play(move)
  triggerRef(match)
  last.value = outcome
  revealKey.value++
  emit('played', outcome)
}

function restart() {
  match.value = new InteractiveMatch('prober')
  last.value = null
  emit('reset')
}

type Kind = 'cheer' | 'betray' | 'glare' | null
const kind = computed<Kind>(() => {
  const o = last.value
  if (!o) return null
  if (o.human === o.bot) return o.human === 'C' ? 'cheer' : 'glare'
  return 'betray'
})

/** Reaction classes for one animal, given its own move this round. */
function reaction(mine: Move | undefined): { body: string; badge?: string } {
  switch (kind.value) {
    case 'cheer':
      return { body: 'animate-cheer' }
    case 'glare':
      return { body: 'animate-glare' }
    case 'betray':
      return mine === 'C' ? { body: 'animate-sulk' } : { body: 'animate-gloat', badge: '💰' }
    default:
      return { body: '' }
  }
}

const actors = computed(() => [
  {
    id: 'titForTat' as const,
    side: 'left',
    role: t('rules.table.youAre'),
    score: match.value.humanScore,
    testid: 'score-monkey',
    react: reaction(last.value?.human),
  },
  {
    id: 'prober' as const,
    side: 'right',
    role: t('rules.table.opponent'),
    score: match.value.botScore,
    testid: 'score-fox',
    react: reaction(last.value?.bot),
  },
])

/** Coins flow from the sharer to the keeper: +1 means left → right. */
const coinDir = computed(() => (last.value?.human === 'C' ? 1 : -1))

const shower = Array.from({ length: 8 }, (_, i) => ({
  '--dx': `${(i % 2 ? 1 : -1) * (60 + i * 12)}px`,
  '--dy': `${-50 - (i % 3) * 14}px`,
  '--d': `${0.2 + i * 0.12}s`,
}))
const slide = Array.from({ length: 5 }, (_, i) => ({ '--d': `${0.2 + i * 0.18}s`, top: `${-8 + (i % 3) * 8}px` }))

const chipClass = (m: Move | undefined) =>
  m === undefined
    ? 'border-2 border-dashed border-table-edge bg-table-edge/20 text-ink-soft'
    : m === 'C'
      ? 'bg-share text-white'
      : 'bg-keep text-white'
</script>

<template>
  <section class="grid gap-4" data-testid="deal-table">
    <div class="flex items-baseline justify-between">
      <span class="kicker">{{ t('rules.table.round', { n: match.human.length + 1 }) }}</span>
      <button v-if="match.human.length" type="button" class="btn btn-ghost px-3! py-1! text-sm" @click="restart">
        {{ t('rules.table.restart') }}
      </button>
    </div>

    <!-- The scene: Monkey | table | Fox -->
    <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 pt-6 sm:gap-4">
      <div
        v-for="a in actors"
        :key="a.id"
        class="flex flex-col items-center gap-1 text-center"
        :class="a.side === 'left' ? 'order-1' : 'order-3'"
        :style="{ '--dir': a.side === 'left' ? '1' : '-1' }"
      >
        <div class="relative">
          <StrategyAvatar :id="a.id" :key="revealKey" class="size-18 sm:size-22" :class="a.react.body" />
          <span
            v-if="a.react.badge"
            :key="`b${revealKey}`"
            class="absolute -top-2 -right-2 text-2xl animate-badge-pop"
            aria-hidden="true"
          >{{ a.react.badge }}</span>
        </div>
        <strong>{{ t(`strategies.${a.id}.name`) }}</strong>
        <span class="text-xs text-muted">{{ a.role }}</span>
        <strong class="text-2xl" :data-testid="a.testid">{{ a.score }}</strong>
      </div>

      <div
        class="relative order-2 flex h-28 w-36 items-center justify-center gap-3 rounded-[50%] border-4 border-table-edge bg-table shadow-card sm:w-52"
        role="img"
        :aria-label="t('rules.table.label')"
      >
        <span
          :key="`m${revealKey}`"
          class="grid size-11 place-items-center rounded-lg text-xl font-bold shadow-sm animate-deal"
          :class="chipClass(last?.human)"
          aria-hidden="true"
        >{{ last ? SYMBOL[last.human] : '?' }}</span>
        <span
          :key="`s${revealKey}`"
          class="grid size-11 place-items-center rounded-lg text-xl font-bold shadow-sm animate-deal"
          :class="chipClass(last?.bot)"
          aria-hidden="true"
        >{{ last ? SYMBOL[last.bot] : '?' }}</span>

        <!-- Scene effects, re-mounted every round -->
        <div :key="`fx${revealKey}`" class="pointer-events-none absolute inset-0" aria-hidden="true">
          <template v-if="kind === 'cheer'">
            <span
              v-for="(c, i) in shower"
              :key="i"
              class="absolute top-2 left-1/2 text-lg animate-coin-pop"
              :style="c"
            >🪙</span>
          </template>
          <template v-else-if="kind === 'betray'">
            <span
              v-for="(c, i) in slide"
              :key="i"
              class="absolute left-1/2 text-lg animate-coin-slide"
              :style="{ ...c, '--cdir': String(coinDir) }"
            >🪙</span>
          </template>
          <template v-else-if="kind === 'glare'">
            <span class="absolute -top-5 right-1/2 h-1 w-[120%] origin-right rounded-full bg-linear-to-r from-red-500/0 to-red-500 animate-laser" />
            <span class="absolute -top-5 left-1/2 h-1 w-[120%] origin-left rounded-full bg-linear-to-l from-red-500/0 to-red-500 animate-laser" />
            <span class="absolute -top-9 left-1/2 text-xl animate-spark">💥</span>
          </template>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center gap-2">
      <p class="font-semibold">{{ t('rules.table.prompt') }}</p>
      <div class="flex flex-wrap justify-center gap-3">
        <button
          v-for="m in MOVES"
          :key="m"
          type="button"
          class="btn btn-lg"
          :class="m === 'C' ? 'btn-share' : 'btn-keep'"
          :data-testid="`deal-${m}`"
          @click="choose(m)"
        >
          {{ t(`common.moves.${m}`) }}
        </button>
      </div>
    </div>

    <MoveHistory
      v-if="match.human.length"
      :rows="[
        { label: t('strategies.titForTat.name'), moves: match.human },
        { label: t('strategies.prober.name'), moves: match.bot },
      ]"
    />
  </section>
</template>
