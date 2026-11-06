<script setup lang="ts">
import { InteractiveMatch, type Move, type RoundOutcome, type StrategyId } from '@trust-lab/game-core'
import { computed, ref, shallowRef, triggerRef } from 'vue'
import { useI18n } from 'vue-i18n'
import MoveHistory from '@/components/MoveHistory.vue'
import StrategyBadge from '@/components/StrategyBadge.vue'
import { submitPlayResult } from '@/services/api'

const { t, locale } = useI18n()

/** Fixed line-up so every player meets the same characters. Lengths are hidden from the player. */
const OPPONENTS: { strategy: StrategyId; rounds: number }[] = [
  { strategy: 'titForTat', rounds: 6 },
  { strategy: 'alwaysDefect', rounds: 5 },
  { strategy: 'alwaysCooperate', rounds: 5 },
  { strategy: 'grimTrigger', rounds: 6 },
  { strategy: 'prober', rounds: 7 },
]

interface Result {
  strategy: StrategyId
  you: number
  them: number
  human: Move[]
  bot: Move[]
}

type Phase = 'intro' | 'playing' | 'between' | 'reveal'

const phase = ref<Phase>('intro')
const index = ref(0)
const match = shallowRef<InteractiveMatch | null>(null)
const last = ref<RoundOutcome | null>(null)
const results = ref<Result[]>([])

const opponent = computed(() => OPPONENTS[index.value]!)
const isLastOpponent = computed(() => index.value === OPPONENTS.length - 1)
const total = computed(() => results.value.reduce((sum, r) => sum + r.you, 0))
const MOVES: Move[] = ['C', 'D']

function startMatch() {
  match.value = new InteractiveMatch(opponent.value.strategy)
  last.value = null
  phase.value = 'playing'
}

function begin() {
  index.value = 0
  results.value = []
  startMatch()
}

function choose(move: Move) {
  const m = match.value
  if (!m || phase.value !== 'playing') return
  last.value = m.play(move)
  triggerRef(match)
  if (m.human.length >= opponent.value.rounds) {
    results.value.push({
      strategy: m.opponent,
      you: m.humanScore,
      them: m.botScore,
      human: [...m.human],
      bot: [...m.bot],
    })
    phase.value = 'between'
  }
}

function next() {
  if (isLastOpponent.value) {
    phase.value = 'reveal'
    void submitPlayResult({
      locale: locale.value,
      totalScore: total.value,
      matches: results.value.map((r) => ({
        opponent: r.strategy,
        moves: r.human.join(''),
        score: r.you,
        opponentScore: r.them,
      })),
    })
    return
  }
  index.value++
  startMatch()
}

const lastText = computed(() => {
  const o = last.value
  if (!o) return ''
  return t(`common.outcome.${o.human}${o.bot}`, { you: o.humanPoints, them: o.botPoints })
})
</script>

<template>
  <article class="space-y-5">
    <h1>{{ t('play.title') }}</h1>

    <template v-if="phase === 'intro'">
      <p class="lead">{{ t('play.intro') }}</p>
      <button type="button" class="btn btn-primary btn-lg" data-testid="play-start" @click="begin">
        {{ t('play.start') }}
      </button>
    </template>

    <section v-else-if="(phase === 'playing' || phase === 'between') && match" class="card">
      <header class="mb-4 flex items-baseline justify-between">
        <span class="kicker" data-testid="stranger">
          {{ t('play.match.stranger', { n: index + 1, total: OPPONENTS.length }) }}
        </span>
        <span v-if="phase === 'playing'" class="text-muted">
          {{ t('play.match.round', { n: match.human.length + 1 }) }}
        </span>
      </header>

      <div class="mb-4 flex justify-around gap-4">
        <div class="flex flex-col items-center gap-1">
          <span class="grid size-16 place-items-center rounded-full bg-[#e3efe8] text-3xl" aria-hidden="true">🙂</span>
          <span class="text-sm text-muted">{{ t('play.score.you') }}</span>
          <strong class="text-2xl" data-testid="score-you">{{ match.humanScore }}</strong>
        </div>
        <div class="flex flex-col items-center gap-1">
          <span
            class="grid size-16 place-items-center rounded-full bg-[#ece6dc] text-3xl font-bold text-muted"
            aria-hidden="true"
          >?</span>
          <span class="text-sm text-muted">{{ t('play.score.them') }}</span>
          <strong class="text-2xl">{{ match.botScore }}</strong>
        </div>
      </div>

      <MoveHistory
        :rows="[
          { label: t('common.labels.you'), moves: match.human },
          { label: t('common.labels.them'), moves: match.bot },
        ]"
      />

      <p class="mt-3 min-h-[1.6em] font-semibold" aria-live="polite" data-testid="round-outcome">
        {{ lastText }}
      </p>

      <div v-if="phase === 'playing'" class="mt-4 flex flex-wrap items-center justify-center gap-3">
        <p class="w-full text-center font-semibold">{{ t('play.match.prompt') }}</p>
        <button
          v-for="m in MOVES"
          :key="m"
          type="button"
          class="btn btn-lg"
          :class="m === 'C' ? 'btn-share' : 'btn-keep'"
          :data-testid="`move-${m}`"
          @click="choose(m)"
        >
          {{ t(`common.moves.${m}`) }}
        </button>
      </div>

      <div v-else class="mt-4 flex flex-col items-center gap-3">
        <p class="text-muted">{{ t('play.match.over') }}</p>
        <button type="button" class="btn btn-primary" data-testid="play-next" @click="next">
          {{ isLastOpponent ? t('play.reveal.button') : t('play.match.next') }}
        </button>
      </div>
    </section>

    <section v-else-if="phase === 'reveal'" class="space-y-4">
      <h2>{{ t('play.reveal.title') }}</h2>
      <ol class="grid gap-3">
        <li v-for="r in results" :key="r.strategy" class="card grid gap-2.5">
          <StrategyBadge :id="r.strategy" describe />
          <p class="font-semibold">{{ t('play.reveal.vs', { you: r.you, them: r.them }) }}</p>
          <MoveHistory
            :rows="[
              { label: t('common.labels.you'), moves: r.human },
              { label: t('common.labels.them'), moves: r.bot },
            ]"
          />
        </li>
      </ol>
      <p class="text-xl font-bold" data-testid="play-total">{{ t('play.reveal.total', total) }}</p>
      <p class="text-muted">{{ t('play.reveal.hint') }}</p>
      <button type="button" class="btn" @click="begin">{{ t('play.reveal.again') }}</button>
    </section>
  </article>
</template>
