<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const THEMES = ['think', 'coop', 'team', 'luck', 'nature', 'trust'] as const
type Theme = (typeof THEMES)[number]

/** Full class names so Tailwind can see them. */
const THEME_BG: Record<Theme, string> = {
  think: 'bg-kids-think',
  coop: 'bg-kids-coop',
  team: 'bg-kids-team',
  luck: 'bg-kids-luck',
  nature: 'bg-kids-nature',
  trust: 'bg-kids-trust',
}

const THEME_EMOJI: Record<Theme, string> = {
  think: '🧠',
  coop: '🤝',
  team: '📞',
  luck: '🎲',
  nature: '🦅',
  trust: '🔍',
}

/** Payoffs as [row player, column player] for choice A/B × A/B. */
type Matrix = [[[number, number], [number, number]], [[number, number], [number, number]]]

interface Game {
  id: string
  theme: Theme
  emoji: string
  level: 1 | 2 | 3
  steps: number
  matrix?: Matrix
}

const GAMES: Game[] = [
  { id: 'tictactoe', theme: 'think', emoji: '❌', level: 1, steps: 3 },
  { id: 'magicNumber', theme: 'think', emoji: '🔢', level: 2, steps: 4 },
  { id: 'classFavourite', theme: 'think', emoji: '🐶', level: 1, steps: 3 },
  {
    id: 'lemonade',
    theme: 'think',
    emoji: '🍋',
    level: 2,
    steps: 3,
    matrix: [
      [
        [6, 4],
        [9, 3],
      ],
      [
        [5, 7],
        [3, 2],
      ],
    ],
  },
  { id: 'gameTree', theme: 'think', emoji: '🌳', level: 2, steps: 4 },
  { id: 'threats', theme: 'think', emoji: '🙄', level: 2, steps: 3 },
  { id: 'tripVote', theme: 'think', emoji: '🗳️', level: 3, steps: 3 },
  {
    id: 'cookie',
    theme: 'coop',
    emoji: '🍪',
    level: 1,
    steps: 3,
    matrix: [
      [
        [3, 3],
        [0, 5],
      ],
      [
        [5, 0],
        [1, 1],
      ],
    ],
  },
  { id: 'tournament', theme: 'coop', emoji: '🔁', level: 2, steps: 4 },
  { id: 'toyRoom', theme: 'coop', emoji: '🧸', level: 1, steps: 3 },
  { id: 'fishPond', theme: 'coop', emoji: '🐟', level: 2, steps: 4 },
  { id: 'whisper', theme: 'coop', emoji: '📣', level: 1, steps: 3 },
  { id: 'iceCream', theme: 'coop', emoji: '🍦', level: 3, steps: 4 },
  { id: 'movieOrPark', theme: 'team', emoji: '🎬', level: 1, steps: 4 },
  { id: 'meetMe', theme: 'team', emoji: '📍', level: 1, steps: 3 },
  { id: 'piggyBank', theme: 'team', emoji: '🐷', level: 2, steps: 4 },
  { id: 'rps', theme: 'luck', emoji: '✊', level: 1, steps: 3 },
  { id: 'goats', theme: 'luck', emoji: '🐐', level: 2, steps: 3 },
  { id: 'homework', theme: 'luck', emoji: '📚', level: 2, steps: 4 },
  { id: 'sandcastle', theme: 'luck', emoji: '🏰', level: 2, steps: 4 },
  { id: 'hawkDove', theme: 'nature', emoji: '🦅', level: 3, steps: 4 },
  { id: 'bike', theme: 'trust', emoji: '🚲', level: 2, steps: 4 },
  { id: 'cardSwap', theme: 'trust', emoji: '🎁', level: 2, steps: 3 },
  { id: 'lemonadePromise', theme: 'trust', emoji: '🏅', level: 2, steps: 4 },
  { id: 'teamLoan', theme: 'trust', emoji: '👫', level: 2, steps: 3 },
]

const SKIPPED = ['nuclear', 'work', 'religion'] as const
const TIPS = ['playFirst', 'rewards', 'debrief', 'path'] as const

const filter = ref<Theme | 'all'>('all')
const shown = computed(() => GAMES.filter((g) => filter.value === 'all' || g.theme === filter.value))

const g = (game: Game, field: string) => t(`kids.games.${game.id}.${field}`)
const choice = (game: Game, i: number) => g(game, i === 0 ? 'choiceA' : 'choiceB')
</script>

<template>
  <article class="space-y-10">
    <header class="space-y-3 text-center">
      <p class="kicker">{{ t('kids.kicker') }}</p>
      <h1 class="mx-auto max-w-[20ch] text-[clamp(2rem,5vw,3rem)]">{{ t('kids.title') }}</h1>
      <p class="lead mx-auto">{{ t('kids.lead') }}</p>
    </header>

    <section class="card space-y-5">
      <dl class="grid grid-cols-3 gap-3 text-center">
        <div class="flex flex-col rounded-xl bg-kids-trust/10 px-2 py-3">
          <dt class="text-sm text-ink-soft">{{ t('kids.stats.games') }}</dt>
          <dd class="order-first font-display text-2xl whitespace-nowrap sm:text-3xl text-kids-trust">{{ GAMES.length }}</dd>
        </div>
        <div class="flex flex-col rounded-xl bg-kids-coop/10 px-2 py-3">
          <dt class="text-sm text-ink-soft">{{ t('kids.stats.themes') }}</dt>
          <dd class="order-first font-display text-2xl whitespace-nowrap sm:text-3xl text-kids-coop">{{ THEMES.length }}</dd>
        </div>
        <div class="flex flex-col rounded-xl bg-kids-think/10 px-2 py-3">
          <dt class="text-sm text-ink-soft">{{ t('kids.stats.minutes') }}</dt>
          <dd class="order-first font-display text-2xl whitespace-nowrap sm:text-3xl text-kids-think">{{ t('kids.stats.minutesValue') }}</dd>
        </div>
      </dl>
      <p>{{ t('kids.intro') }}</p>
    </section>

    <section class="space-y-5">
      <div class="flex flex-wrap gap-2" role="group" :aria-label="t('kids.filter.label')">
        <button
          type="button"
          class="btn px-3 py-1.5 text-sm"
          :class="filter === 'all' && 'border-ink! bg-ink! text-white!'"
          :aria-pressed="filter === 'all'"
          @click="filter = 'all'"
        >
          {{ t('kids.filter.all') }}
        </button>
        <button
          v-for="theme in THEMES"
          :key="theme"
          type="button"
          class="btn px-3 py-1.5 text-sm"
          :class="filter === theme && 'border-ink! bg-ink! text-white!'"
          :aria-pressed="filter === theme"
          @click="filter = theme"
        >
          <span aria-hidden="true">{{ THEME_EMOJI[theme] }}</span>
          {{ t(`kids.themes.${theme}`) }}
        </button>
      </div>

      <ul class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-5" data-testid="kids-games">
        <li
          v-for="game in shown"
          :key="game.id"
          class="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card"
        >
          <div class="flex items-center gap-3 px-4 py-3 text-white" :class="THEME_BG[game.theme]">
            <span class="rounded-xl bg-white/25 px-2 py-1 text-3xl leading-none" aria-hidden="true">
              {{ game.emoji }}
            </span>
            <div class="min-w-0">
              <h2 class="text-lg leading-tight">{{ g(game, 'title') }}</h2>
              <p class="text-xs opacity-90">{{ t('kids.card.from', { source: g(game, 'source') }) }}</p>
            </div>
          </div>

          <div class="flex flex-1 flex-col gap-3 px-4 pt-3 pb-4">
            <ul class="flex flex-wrap gap-1.5 text-xs font-semibold">
              <li class="rounded-full bg-sand px-2.5 py-0.5">{{ g(game, 'players') }}</li>
              <li class="rounded-full bg-sand px-2.5 py-0.5">{{ g(game, 'materials') }}</li>
              <li class="rounded-full bg-sand px-2.5 py-0.5">{{ g(game, 'time') }}</li>
              <li class="rounded-full bg-sand px-2.5 py-0.5 text-warn">
                <span aria-hidden="true">{{ '★'.repeat(game.level) + '☆'.repeat(3 - game.level) }}</span>
                <span class="sr-only">{{ t('kids.card.difficulty', { n: game.level }) }}</span>
              </li>
            </ul>

            <div>
              <h3 class="text-xs font-semibold tracking-wider text-muted uppercase">{{ t('kids.card.howTo') }}</h3>
              <ol class="mt-1 list-decimal space-y-1 pl-5 text-sm">
                <li v-for="n in game.steps" :key="n">{{ g(game, `step${n}`) }}</li>
              </ol>
            </div>

            <table v-if="game.matrix" class="w-full border-collapse text-center text-sm">
              <caption class="pb-1 text-left text-xs text-muted">{{ t('kids.matrix.caption') }}</caption>
              <thead>
                <tr>
                  <th class="border border-line bg-sand p-1"></th>
                  <th v-for="c in 2" :key="c" scope="col" class="border border-line bg-sand p-1">
                    {{ t('kids.matrix.friend') }}: {{ choice(game, c - 1) }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, r) in game.matrix" :key="r">
                  <th scope="row" class="border border-line bg-sand p-1">
                    {{ t('kids.matrix.you') }}: {{ choice(game, r) }}
                  </th>
                  <td v-for="(cell, c) in row" :key="c" class="border border-line p-1 tabular-nums">
                    {{ cell[0] }} / {{ cell[1] }}
                  </td>
                </tr>
              </tbody>
            </table>

            <p class="callout mt-auto rounded-l-none py-2 text-sm font-semibold">💡 {{ g(game, 'idea') }}</p>
            <p class="text-sm text-muted italic">{{ t('kids.card.ask', { question: g(game, 'ask') }) }}</p>
          </div>
        </li>
      </ul>
    </section>

    <section class="space-y-3">
      <h2>{{ t('kids.map.title') }}</h2>
      <div class="card overflow-x-auto p-0">
        <table class="w-full border-collapse text-left text-sm">
          <thead class="bg-sand">
            <tr>
              <th scope="col" class="p-3">{{ t('kids.map.source') }}</th>
              <th scope="col" class="p-3">{{ t('kids.map.concept') }}</th>
              <th scope="col" class="p-3">{{ t('kids.map.game') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="game in GAMES" :key="game.id" class="border-t border-line align-top">
              <td class="p-3">{{ g(game, 'source') }}</td>
              <td class="p-3">{{ g(game, 'concept') }}</td>
              <td class="p-3 font-semibold">{{ game.emoji }} {{ g(game, 'title') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="grid gap-5 md:grid-cols-2">
      <section class="card space-y-3">
        <h2 class="text-xl">🚫 {{ t('kids.skipped.title') }}</h2>
        <ul class="list-disc space-y-2 pl-5 text-sm">
          <li v-for="id in SKIPPED" :key="id">{{ t(`kids.skipped.${id}`) }}</li>
        </ul>
      </section>
      <section class="card space-y-3">
        <h2 class="text-xl">🧑‍🏫 {{ t('kids.tips.title') }}</h2>
        <ul class="list-disc space-y-2 pl-5 text-sm">
          <li v-for="id in TIPS" :key="id">{{ t(`kids.tips.${id}`) }}</li>
        </ul>
      </section>
    </div>

    <p class="text-sm text-muted">{{ t('kids.credits') }}</p>
  </article>
</template>
