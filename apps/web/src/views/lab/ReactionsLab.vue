<script setup lang="ts">
/**
 * DEV-ONLY playground for choosing Monkey/Fox reaction animations.
 * Not translated and not shipped: the route exists only in `vite dev`.
 * Winning variants get moved into DealTable + main.css tokens.
 */
import { computed, ref, watch } from 'vue'
import StrategyAvatar from '@/components/StrategyAvatar.vue'

type Fx = 'confetti' | 'stars' | 'notes' | 'tears' | 'cloud' | 'streams' | 'horns' | 'sparkle' | 'squint'

interface ActorFx {
  anim?: string
  look?: string
  badge?: string
  badgeAnim?: string
  fx?: Fx[]
}

interface Variant {
  id: string
  title: string
  note: string
  /** In the share/keep section `a` is the sharer, `b` the keeper; otherwise a = Monkey, b = Fox. */
  a: ActorFx
  b: ActorFx
  scene?: ('bolt' | 'laser' | 'coins' | 'coinShower' | 'highFive' | 'storm' | 'glowRing')[]
}

interface Section {
  key: 'cheer' | 'betray' | 'glare'
  title: string
  subtitle: string
  moves: [string, string]
  variants: Variant[]
}

const SECTIONS: Section[] = [
  {
    key: 'cheer',
    title: 'Both share → both cheer',
    subtitle: 'Share / Share — each gets 3',
    moves: ['C', 'C'],
    variants: [
      { id: 'C1', title: 'Jump + confetti', note: 'Bouncy hops, confetti burst from each head.', a: { anim: 'lab-jump', fx: ['confetti'] }, b: { anim: 'lab-jump lab-delay', fx: ['confetti'] } },
      { id: 'C2', title: 'Wiggle dance + sparkles', note: 'Side-to-side dance with twinkling stars.', a: { anim: 'lab-wiggle', fx: ['stars'] }, b: { anim: 'lab-wiggle lab-delay', fx: ['stars'] } },
      { id: 'C3', title: 'Spin jump + party badge', note: 'A full twirl in the air, 🎉 pops above.', a: { anim: 'lab-spin-jump', badge: '🎉', badgeAnim: 'lab-pop' }, b: { anim: 'lab-spin-jump lab-delay', badge: '🎉', badgeAnim: 'lab-pop' } },
      { id: 'C4', title: 'High five over the table', note: 'Both lean in, 🙌 flashes in the middle.', a: { anim: 'lab-lean-bump' }, b: { anim: 'lab-lean-bump' }, scene: ['highFive'] },
      { id: 'C5', title: 'Golden glow + music', note: 'Warm glow ring and floating notes. Calm, friendly.', a: { anim: 'lab-glow-gold', fx: ['notes'] }, b: { anim: 'lab-glow-gold lab-delay', fx: ['notes'] } },
      { id: 'C6', title: 'Coin shower', note: 'Coins pop out of the table toward both. Ties to “points”.', a: { anim: 'lab-bounce-soft' }, b: { anim: 'lab-bounce-soft lab-delay' }, scene: ['coinShower'] },
    ],
  },
  {
    key: 'betray',
    title: 'One shares, one keeps → cry vs evil smile',
    subtitle: 'Sharer gets 0, keeper gets 5',
    moves: ['C', 'D'],
    variants: [
      { id: 'S1', title: 'Teardrops vs devil laugh', note: 'Drops fall, sharer droops. Keeper rocks with laughter, 😈 badge.', a: { anim: 'lab-droop', fx: ['tears'] }, b: { anim: 'lab-rock-laugh', badge: '😈', badgeAnim: 'lab-pop' } },
      { id: 'S2', title: 'Rain cloud vs horns', note: 'Personal rain cloud over the sharer. Little red horns grow on the keeper.', a: { anim: 'lab-droop', look: 'lab-grey', fx: ['cloud'] }, b: { anim: 'lab-smug-tilt', fx: ['horns'] } },
      { id: 'S3', title: 'Sobbing vs tooth sparkle', note: '😭 badge + shaking shoulders. Keeper lifts chin, ✨ glints.', a: { anim: 'lab-sob', badge: '😭', badgeAnim: 'lab-pop' }, b: { anim: 'lab-smug-tilt', fx: ['sparkle'] } },
      { id: 'S4', title: 'Coins change hands', note: 'Coins slide from sharer to keeper. Sharer shrinks; keeper gloats with 💰.', a: { anim: 'lab-shrink', look: 'lab-grey' }, b: { anim: 'lab-gloat', badge: '💰', badgeAnim: 'lab-pop' }, scene: ['coins'] },
      { id: 'S5', title: 'Tear streams vs red aura', note: 'Cartoon tear rivers. Keeper pulses a red glow with 😏.', a: { anim: 'lab-droop', fx: ['streams'] }, b: { anim: 'lab-glow-red', badge: '😏', badgeAnim: 'lab-pop' } },
      { id: 'S6', title: 'Minimal: badges only', note: 'No body motion, just 😢 and 😈 popping. Quietest option.', a: { badge: '😢', badgeAnim: 'lab-pop-float' }, b: { badge: '😈', badgeAnim: 'lab-pop-float' } },
    ],
  },
  {
    key: 'glare',
    title: 'Both keep → evil eye',
    subtitle: 'Keep / Keep — each gets 1',
    moves: ['D', 'D'],
    variants: [
      { id: 'E1', title: 'Lean in + lightning', note: 'Both lean toward each other, ⚡ crackles between them.', a: { anim: 'lab-lean-hold' }, b: { anim: 'lab-lean-hold' }, scene: ['bolt'] },
      { id: 'E2', title: 'Squinting eyes', note: 'A narrowing 👁️ over each, slow suspicious pulse.', a: { fx: ['squint'], anim: 'lab-lean-hold' }, b: { fx: ['squint'], anim: 'lab-lean-hold' } },
      { id: 'E3', title: 'Anger marks + tremble', note: '💢 throbs, both shake with rage.', a: { anim: 'lab-tremble', badge: '💢', badgeAnim: 'lab-throb' }, b: { anim: 'lab-tremble', badge: '💢', badgeAnim: 'lab-throb' } },
      { id: 'E4', title: 'Laser stare', note: 'Red beams meet over the table and spark.', a: { anim: 'lab-lean-hold', look: 'lab-glow-red-static' }, b: { anim: 'lab-lean-hold', look: 'lab-glow-red-static' }, scene: ['laser'] },
      { id: 'E5', title: 'Storm at the table', note: 'Scene darkens, both go 😒 and slowly slide-glare.', a: { anim: 'lab-slide-glare', badge: '😒', badgeAnim: 'lab-pop' }, b: { anim: 'lab-slide-glare', badge: '😒', badgeAnim: 'lab-pop' }, scene: ['storm'] },
      { id: 'E6', title: 'Side-eye', note: 'Turn away, then a quick 👀 glance back. Passive-aggressive.', a: { anim: 'lab-side-eye', badge: '👀', badgeAnim: 'lab-peek' }, b: { anim: 'lab-side-eye', badge: '👀', badgeAnim: 'lab-peek' } },
    ],
  },
]

const MONKEY = 'titForTat' as const
const FOX = 'prober' as const

// ---- Controls ----
const loop = ref(true)
const speed = ref(1)
const replayKey = ref(0)
/** false: Monkey shared and got betrayed. true: Fox shared, Monkey kept. */
const mirror = ref(false)

const PICKS_KEY = 'lab-reaction-picks'
const picks = ref<Record<string, string>>(JSON.parse(localStorage.getItem(PICKS_KEY) ?? '{}'))
watch(picks, (v) => localStorage.setItem(PICKS_KEY, JSON.stringify(v)), { deep: true })
const pickSummary = computed(() =>
  SECTIONS.map((s) => `${s.key}: ${picks.value[s.key] ?? '—'}`).join(' · '),
)
function pick(section: string, id: string) {
  picks.value = { ...picks.value, [section]: picks.value[section] === id ? '' : id }
}

/** Resolve who is on the left (Monkey) / right (Fox) for a variant. */
function sides(section: Section, v: Variant) {
  const swap = section.key === 'betray' && mirror.value
  const left = swap ? v.b : v.a
  const right = swap ? v.a : v.b
  const moves = swap ? [section.moves[1], section.moves[0]] : section.moves
  return [
    { side: 'left' as const, who: MONKEY, fx: left, move: moves[0]! },
    { side: 'right' as const, who: FOX, fx: right, move: moves[1]! },
  ]
}
/** Coins flow from the sharer to the keeper. */
const coinDir = (section: Section) => (section.key === 'betray' && mirror.value ? -1 : 1)

// ---- Deterministic particles ----
const CONFETTI_COLORS = ['#2f9e6e', '#f2c14e', '#d4553f', '#8ec5f0', '#d8579a', '#8a63d2']
const confetti = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2
  const r = 46 + ((i * 37) % 22)
  return {
    '--dx': `${Math.round(Math.cos(angle) * r)}px`,
    '--dy': `${Math.round(Math.sin(angle) * r - 30)}px`,
    '--rot': `${(i * 77) % 360}deg`,
    '--d': `${(i % 4) * 0.05}s`,
    background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }
})
const stars = [
  { top: '-8%', left: '-6%', '--d': '0s' },
  { top: '-14%', left: '70%', '--d': '.3s' },
  { top: '55%', left: '-18%', '--d': '.6s' },
  { top: '60%', left: '92%', '--d': '.9s' },
]
const notes = [
  { left: '10%', '--d': '0s', '--drift': '-14px', ch: '🎵' },
  { left: '55%', '--d': '.5s', '--drift': '12px', ch: '🎶' },
  { left: '80%', '--d': '1s', '--drift': '-6px', ch: '🎵' },
]
const drops = [
  { left: '28%', '--d': '0s' },
  { left: '64%', '--d': '.45s' },
  { left: '30%', '--d': '.9s' },
]
const coins = Array.from({ length: 5 }, (_, i) => ({ '--d': `${i * 0.18}s`, top: `${38 + (i % 3) * 8}%` }))
const shower = Array.from({ length: 8 }, (_, i) => ({
  '--dx': `${(i % 2 ? 1 : -1) * (40 + i * 9)}px`,
  '--dy': `${-50 - (i % 3) * 14}px`,
  '--d': `${i * 0.12}s`,
}))
</script>

<template>
  <article
    class="space-y-8"
    :style="{ '--speed': String(1 / speed), '--iter': loop ? 'infinite' : '2' }"
  >
    <header class="space-y-2">
      <span class="kicker">Design lab · dev only</span>
      <h1>Monkey &amp; Fox reactions</h1>
      <p class="lead">
        Pick one variant per row (click <em>Pick</em>). Tell me the IDs, and anything to mix, e.g. “C1 but with C5’s
        music” — I’ll iterate and then build the winners into the table on page 2.
      </p>
    </header>

    <div class="sticky top-0 z-20 -mx-2 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-line bg-white/95 px-4 py-3 shadow-card backdrop-blur">
      <label class="flex items-center gap-2 text-sm">
        <input v-model="loop" type="checkbox" class="accent-accent" /> Loop
      </label>
      <label class="flex items-center gap-2 text-sm">
        Speed
        <input v-model.number="speed" type="range" min="0.5" max="2" step="0.25" class="w-28!" />
        <span class="w-8 tabular-nums text-muted">{{ speed }}×</span>
      </label>
      <button type="button" class="btn px-3! py-1! text-sm" @click="replayKey++">↻ Replay all</button>
      <span class="ml-auto text-sm"><strong>Picks:</strong> <span class="text-muted">{{ pickSummary }}</span></span>
    </div>

    <section v-for="section in SECTIONS" :key="section.key" class="space-y-3">
      <div class="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 class="mb-0!">{{ section.title }}</h2>
          <p class="text-sm text-muted">{{ section.subtitle }}</p>
        </div>
        <div v-if="section.key === 'betray'" class="segmented text-sm" role="group" aria-label="Who shared">
          <button type="button" :aria-pressed="!mirror" @click="mirror = false">🐒 shared, 🦊 kept</button>
          <button type="button" :aria-pressed="mirror" @click="mirror = true">🦊 shared, 🐒 kept</button>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="v in section.variants"
          :key="`${v.id}-${replayKey}-${mirror}`"
          class="card flex flex-col gap-3 p-4!"
          :class="picks[section.key] === v.id ? 'ring-3 ring-accent' : ''"
        >
          <div class="flex items-baseline justify-between gap-2">
            <strong><span class="text-accent">{{ v.id }}</span> · {{ v.title }}</strong>
          </div>

          <!-- Scene -->
          <div
            class="relative grid grid-cols-[1fr_auto_1fr] items-center overflow-visible rounded-xl px-1 py-6 transition-colors"
            :class="v.scene?.includes('storm') ? 'lab-storm' : 'bg-sand'"
          >
            <div
              v-for="actor in sides(section, v)"
              :key="actor.side"
              class="flex justify-center"
              :class="actor.side === 'left' ? 'order-1' : 'order-3'"
              :style="{ '--dir': actor.side === 'left' ? '1' : '-1' }"
            >
              <div class="relative size-18">
                <!-- body -->
                <div class="size-full" :class="actor.fx.anim">
                  <StrategyAvatar :id="actor.who" class="size-full" :class="actor.fx.look" />

                  <!-- attached fx (move with the body) -->
                  <template v-if="actor.fx.fx?.includes('horns')">
                    <span class="lab-horn absolute top-0.5 left-[22%] h-0 w-0 border-x-[6px] border-b-[15px] border-x-transparent border-b-red-600" />
                    <span class="lab-horn absolute top-0.5 right-[22%] h-0 w-0 border-x-[6px] border-b-[15px] border-x-transparent border-b-red-600" />
                  </template>
                  <span v-if="actor.fx.fx?.includes('sparkle')" class="lab-twinkle absolute right-1 bottom-2 text-lg">✨</span>
                  <template v-if="actor.fx.fx?.includes('streams')">
                    <span class="lab-stream absolute top-[48%] left-[30%] w-1.5 rounded-full bg-sky-400/80" />
                    <span class="lab-stream absolute top-[48%] right-[30%] w-1.5 rounded-full bg-sky-400/80" />
                  </template>
                  <span v-if="actor.fx.fx?.includes('squint')" class="lab-squint absolute -top-5 left-1/2 -translate-x-1/2 text-2xl">👁️</span>
                </div>

                <!-- free fx (don't follow body motion) -->
                <span
                  v-if="actor.fx.badge"
                  class="absolute -top-3 -right-3 text-2xl"
                  :class="actor.fx.badgeAnim"
                >{{ actor.fx.badge }}</span>

                <template v-if="actor.fx.fx?.includes('confetti')">
                  <span
                    v-for="(c, i) in confetti"
                    :key="i"
                    class="lab-confetti absolute top-2 left-1/2 size-2 rounded-[2px]"
                    :style="c"
                  />
                </template>
                <template v-if="actor.fx.fx?.includes('stars')">
                  <span v-for="(st, i) in stars" :key="i" class="lab-twinkle absolute text-base" :style="st">✨</span>
                </template>
                <template v-if="actor.fx.fx?.includes('notes')">
                  <span v-for="(n, i) in notes" :key="i" class="lab-note absolute top-0 text-base" :style="n">{{ n.ch }}</span>
                </template>
                <template v-if="actor.fx.fx?.includes('tears')">
                  <span v-for="(d, i) in drops" :key="i" class="lab-tear absolute top-[45%] text-sm" :style="d">💧</span>
                </template>
                <template v-if="actor.fx.fx?.includes('cloud')">
                  <span class="lab-cloud absolute -top-9 left-1/2 -translate-x-1/2 text-3xl">☁️</span>
                  <span v-for="(d, i) in drops" :key="i" class="lab-rain absolute -top-2 text-xs" :style="d">💧</span>
                </template>
              </div>
            </div>

            <!-- table with the revealed choices -->
            <div
              class="relative order-2 flex h-14 w-24 items-center justify-center gap-1.5 rounded-[50%] border-3 border-table-edge bg-table"
            >
              <span
                v-for="(actor, i) in sides(section, v)"
                :key="i"
                class="grid size-7 place-items-center rounded-md text-sm font-bold text-white"
                :class="actor.move === 'C' ? 'bg-share' : 'bg-keep'"
              >{{ actor.move === 'C' ? '✓' : '✕' }}</span>

              <!-- scene fx anchored to the table -->
              <span v-if="v.scene?.includes('highFive')" class="lab-pop-center absolute -top-9 left-1/2 text-3xl">🙌</span>
              <span v-if="v.scene?.includes('bolt')" class="lab-bolt absolute -top-10 left-1/2 text-3xl">⚡</span>
              <template v-if="v.scene?.includes('laser')">
                <span class="lab-laser absolute -top-6 right-1/2 h-1 w-[110%] origin-right rounded-full bg-gradient-to-r from-red-500/0 to-red-500" />
                <span class="lab-laser absolute -top-6 left-1/2 h-1 w-[110%] origin-left rounded-full bg-gradient-to-l from-red-500/0 to-red-500" />
                <span class="lab-spark absolute -top-9 left-1/2 text-xl">💥</span>
              </template>
              <template v-if="v.scene?.includes('coins')">
                <span
                  v-for="(c, i) in coins"
                  :key="i"
                  class="lab-coin-slide absolute left-1/2 text-lg"
                  :style="{ ...c, '--cdir': String(coinDir(section)) }"
                >🪙</span>
              </template>
              <template v-if="v.scene?.includes('coinShower')">
                <span v-for="(c, i) in shower" :key="i" class="lab-coin-pop absolute top-1 left-1/2 text-base" :style="c">🪙</span>
              </template>
            </div>
          </div>

          <p class="text-sm text-ink-soft">{{ v.note }}</p>
          <button
            type="button"
            class="btn mt-auto self-start px-3! py-1! text-sm"
            :class="picks[section.key] === v.id ? 'btn-primary' : ''"
            :aria-pressed="picks[section.key] === v.id"
            @click="pick(section.key, v.id)"
          >
            {{ picks[section.key] === v.id ? '★ Picked' : 'Pick' }}
          </button>
        </div>
      </div>
    </section>
  </article>
</template>

<!--
  Exploration-only keyframes. A plain <style> block is deliberate here: this page
  holds ~30 throwaway animations. The chosen ones move to @theme in main.css.
  Every animation uses var(--speed) and var(--iter) from the page controls.
-->
<style>
.lab-delay { animation-delay: calc(0.15s * var(--speed)) !important; }

/* ---------- bodies ---------- */
.lab-jump { animation: lab-jump calc(0.7s * var(--speed)) ease-in-out var(--iter) both; }
@keyframes lab-jump { 0%, 100% { transform: translateY(0) scale(1, 1); } 15% { transform: translateY(0) scale(1.1, 0.9); } 45% { transform: translateY(-22px) scale(0.95, 1.05); } 75% { transform: translateY(0) scale(1.06, 0.94); } }

.lab-wiggle { animation: lab-wiggle calc(0.8s * var(--speed)) ease-in-out var(--iter) both; }
@keyframes lab-wiggle { 0%, 100% { transform: rotate(0) translateY(0); } 25% { transform: rotate(-14deg) translateY(-6px); } 75% { transform: rotate(14deg) translateY(-6px); } }

.lab-spin-jump { animation: lab-spin-jump calc(1.3s * var(--speed)) cubic-bezier(.3,.7,.4,1) var(--iter) both; }
@keyframes lab-spin-jump { 0%, 100% { transform: translateY(0) rotate(0); } 15% { transform: translateY(0) scale(1.08, .92); } 50% { transform: translateY(-26px) rotate(360deg); } 70% { transform: translateY(0) rotate(360deg); } }

.lab-lean-bump { animation: lab-lean-bump calc(1.1s * var(--speed)) ease-in-out var(--iter) both; }
@keyframes lab-lean-bump { 0%, 100% { transform: translateX(0) rotate(0); } 40%, 55% { transform: translateX(calc(var(--dir) * 18px)) rotate(calc(var(--dir) * 12deg)); } 48% { transform: translateX(calc(var(--dir) * 22px)) rotate(calc(var(--dir) * 14deg)) scale(1.05); } }

.lab-glow-gold > span:first-child { animation: lab-glow-gold calc(1.4s * var(--speed)) ease-in-out var(--iter) both; }
@keyframes lab-glow-gold { 0%, 100% { box-shadow: 0 0 0 0 rgb(242 193 78 / 0); transform: scale(1); } 50% { box-shadow: 0 0 22px 8px rgb(242 193 78 / .75); transform: scale(1.08); } }

.lab-bounce-soft { animation: lab-bounce-soft calc(0.6s * var(--speed)) ease-in-out var(--iter) both; }
@keyframes lab-bounce-soft { 50% { transform: translateY(-10px); } }

.lab-droop { animation: lab-droop calc(1.6s * var(--speed)) ease-in-out var(--iter) both; }
@keyframes lab-droop { 0% { transform: none; } 30%, 80% { transform: translateY(8px) rotate(calc(var(--dir) * -8deg)) scale(.94); } 100% { transform: none; } }

.lab-grey { animation: lab-grey calc(1.6s * var(--speed)) ease-in-out var(--iter) both; }
@keyframes lab-grey { 0%, 100% { filter: none; } 30%, 80% { filter: grayscale(.85) brightness(.92); } }

.lab-sob { animation: lab-sob calc(0.35s * var(--speed)) linear var(--iter) both; }
@keyframes lab-sob { 0%, 100% { transform: translateY(4px); } 25% { transform: translate(-2px, 1px); } 50% { transform: translateY(5px); } 75% { transform: translate(2px, 1px); } }

.lab-shrink { animation: lab-shrink calc(1.8s * var(--speed)) ease-in-out var(--iter) both; }
@keyframes lab-shrink { 0%, 100% { transform: scale(1); } 40%, 85% { transform: scale(.78) translateY(6px); } }

.lab-rock-laugh { animation: lab-rock-laugh calc(0.5s * var(--speed)) ease-in-out var(--iter) both; transform-origin: 50% 90%; }
@keyframes lab-rock-laugh { 0%, 100% { transform: rotate(calc(var(--dir) * -10deg)); } 50% { transform: rotate(calc(var(--dir) * 4deg)) translateY(-3px); } }

.lab-smug-tilt { animation: lab-smug-tilt calc(2s * var(--speed)) ease-in-out var(--iter) both; }
@keyframes lab-smug-tilt { 0%, 100% { transform: rotate(0); } 25%, 80% { transform: rotate(calc(var(--dir) * -14deg)) translateY(-4px); } }

.lab-gloat { animation: lab-gloat calc(0.9s * var(--speed)) ease-in-out var(--iter) both; }
@keyframes lab-gloat { 0%, 100% { transform: translateY(0) scale(1); } 30% { transform: translateY(-12px) scale(1.08); } 60% { transform: translateY(0) scale(1.12); } }

.lab-glow-red > span:first-child { animation: lab-glow-red calc(1.2s * var(--speed)) ease-in-out var(--iter) both; }
@keyframes lab-glow-red { 0%, 100% { box-shadow: 0 0 0 0 rgb(220 38 38 / 0); } 50% { box-shadow: 0 0 22px 7px rgb(220 38 38 / .7); } }
.lab-glow-red-static { box-shadow: 0 0 16px 4px rgb(220 38 38 / .55); }

.lab-lean-hold { animation: lab-lean-hold calc(2s * var(--speed)) ease-in-out var(--iter) both; }
@keyframes lab-lean-hold { 0%, 100% { transform: none; } 25%, 80% { transform: translateX(calc(var(--dir) * 14px)) rotate(calc(var(--dir) * 8deg)) scaleY(.94); } }

.lab-tremble { animation: lab-tremble calc(0.12s * var(--speed)) linear var(--iter) both; }
@keyframes lab-tremble { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-2px, 1px); } 50% { transform: translate(2px, -1px); } 75% { transform: translate(-1px, -1px); } }

.lab-slide-glare { animation: lab-slide-glare calc(2.6s * var(--speed)) ease-in-out var(--iter) both; }
@keyframes lab-slide-glare { 0%, 100% { transform: none; } 40%, 85% { transform: translateX(calc(var(--dir) * 12px)) rotate(calc(var(--dir) * 5deg)); } }

.lab-side-eye { animation: lab-side-eye calc(2.4s * var(--speed)) ease-in-out var(--iter) both; }
@keyframes lab-side-eye { 0%, 100% { transform: none; } 15%, 45% { transform: rotate(calc(var(--dir) * -22deg)) translateX(calc(var(--dir) * -6px)); } 55%, 70% { transform: rotate(calc(var(--dir) * 6deg)); } 85% { transform: rotate(calc(var(--dir) * -22deg)) translateX(calc(var(--dir) * -6px)); } }

/* ---------- badges ---------- */
.lab-pop { animation: lab-pop calc(1.6s * var(--speed)) cubic-bezier(.3,1.6,.5,1) var(--iter) both; }
@keyframes lab-pop { 0% { transform: scale(0) rotate(-30deg); opacity: 0; } 20%, 85% { transform: scale(1) rotate(0); opacity: 1; } 100% { transform: scale(.6); opacity: 0; } }

.lab-pop-float { animation: lab-pop-float calc(1.8s * var(--speed)) ease-out var(--iter) both; }
@keyframes lab-pop-float { 0% { transform: translateY(8px) scale(.4); opacity: 0; } 25% { transform: translateY(0) scale(1.15); opacity: 1; } 75% { transform: translateY(-10px) scale(1); opacity: 1; } 100% { transform: translateY(-18px); opacity: 0; } }

.lab-throb { animation: lab-throb calc(0.5s * var(--speed)) ease-in-out var(--iter) both; }
@keyframes lab-throb { 0%, 100% { transform: scale(.85); } 50% { transform: scale(1.25); } }

.lab-peek { animation: lab-peek calc(2.4s * var(--speed)) ease-in-out var(--iter) both; }
@keyframes lab-peek { 0%, 45%, 75%, 100% { opacity: 0; transform: scale(.5); } 52%, 68% { opacity: 1; transform: scale(1.1); } }

/* ---------- particles ---------- */
.lab-confetti { animation: lab-confetti calc(1.1s * var(--speed)) cubic-bezier(.2,.7,.4,1) var(--iter) both; animation-delay: var(--d); }
@keyframes lab-confetti { 0% { transform: translate(-50%, 0) scale(.3); opacity: 1; } 70% { opacity: 1; } 100% { transform: translate(calc(-50% + var(--dx)), calc(var(--dy) + 40px)) rotate(var(--rot)); opacity: 0; } }

.lab-twinkle { animation: lab-twinkle calc(1.2s * var(--speed)) ease-in-out var(--iter) both; animation-delay: var(--d, 0s); }
@keyframes lab-twinkle { 0%, 100% { transform: scale(0) rotate(0); opacity: 0; } 50% { transform: scale(1.1) rotate(45deg); opacity: 1; } }

.lab-note { animation: lab-note calc(2s * var(--speed)) ease-out var(--iter) both; animation-delay: var(--d); }
@keyframes lab-note { 0% { transform: translate(0, 10px); opacity: 0; } 20% { opacity: 1; } 100% { transform: translate(var(--drift), -48px) rotate(15deg); opacity: 0; } }

.lab-tear { animation: lab-tear calc(1.3s * var(--speed)) ease-in var(--iter) both; animation-delay: var(--d); }
@keyframes lab-tear { 0% { transform: translateY(0) scale(.5); opacity: 0; } 15% { opacity: 1; transform: scale(1); } 100% { transform: translateY(40px) scale(.8); opacity: 0; } }

.lab-cloud { animation: lab-cloud calc(2s * var(--speed)) ease-in-out var(--iter) both; }
@keyframes lab-cloud { 0%, 100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, -3px); } }
.lab-rain { animation: lab-rain calc(0.8s * var(--speed)) linear var(--iter) both; animation-delay: var(--d); }
@keyframes lab-rain { 0% { transform: translateY(0); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(46px); opacity: 0; } }

.lab-stream { animation: lab-stream calc(1.4s * var(--speed)) ease-in var(--iter) both; }
@keyframes lab-stream { 0% { height: 0; opacity: .3; } 60%, 100% { height: 34px; opacity: .9; } }

.lab-horn { animation: lab-horn calc(1.8s * var(--speed)) cubic-bezier(.3,1.6,.5,1) var(--iter) both; transform-origin: bottom; }
@keyframes lab-horn { 0% { transform: translateY(4px) scaleY(0); } 25%, 90% { transform: translateY(-10px) scaleY(1); } 100% { transform: translateY(4px) scaleY(0); } }

.lab-squint { animation: lab-squint calc(1.8s * var(--speed)) ease-in-out var(--iter) both; }
@keyframes lab-squint { 0%, 100% { transform: translateX(-50%) scaleY(1); } 40%, 75% { transform: translateX(-50%) scaleY(.25) scaleX(1.15); } }

/* ---------- scene ---------- */
.lab-pop-center { animation: lab-pop-center calc(1.1s * var(--speed)) cubic-bezier(.3,1.6,.5,1) var(--iter) both; }
@keyframes lab-pop-center { 0%, 30% { transform: translateX(-50%) scale(0); opacity: 0; } 48% { transform: translateX(-50%) scale(1.3); opacity: 1; } 75% { transform: translateX(-50%) scale(1); opacity: 1; } 100% { transform: translateX(-50%) scale(.8); opacity: 0; } }

.lab-bolt { animation: lab-bolt calc(0.9s * var(--speed)) steps(1) var(--iter) both; }
@keyframes lab-bolt { 0% { transform: translateX(-50%) scale(1); opacity: 0; } 20% { opacity: 1; } 30% { opacity: .2; transform: translateX(-50%) scale(1.2) rotate(10deg); } 45% { opacity: 1; } 70% { opacity: 0; } }

.lab-laser { animation: lab-laser calc(1s * var(--speed)) ease-in-out var(--iter) both; }
@keyframes lab-laser { 0% { transform: scaleX(0); opacity: 0; } 40%, 80% { transform: scaleX(1); opacity: 1; } 60% { opacity: .6; } 100% { transform: scaleX(1); opacity: 0; } }
.lab-spark { animation: lab-spark calc(1s * var(--speed)) ease-out var(--iter) both; }
@keyframes lab-spark { 0%, 38% { transform: translateX(-50%) scale(0); opacity: 0; } 50% { transform: translateX(-50%) scale(1.3); opacity: 1; } 100% { transform: translateX(-50%) scale(.9); opacity: 0; } }

.lab-coin-slide { animation: lab-coin-slide calc(1.6s * var(--speed)) ease-in-out var(--iter) both; animation-delay: var(--d); }
@keyframes lab-coin-slide { 0% { transform: translate(calc(-50% - var(--cdir) * 90px), -10px) scale(.6); opacity: 0; } 15% { opacity: 1; } 50% { transform: translate(-50%, -34px) scale(1); } 85% { opacity: 1; } 100% { transform: translate(calc(-50% + var(--cdir) * 90px), -10px) scale(.6); opacity: 0; } }

.lab-coin-pop { animation: lab-coin-pop calc(1.2s * var(--speed)) cubic-bezier(.2,.7,.4,1) var(--iter) both; animation-delay: var(--d); }
@keyframes lab-coin-pop { 0% { transform: translate(-50%, 0) scale(.4); opacity: 0; } 20% { opacity: 1; } 55% { transform: translate(calc(-50% + var(--dx) * .6), var(--dy)) scale(1) rotate(180deg); } 100% { transform: translate(calc(-50% + var(--dx)), 0) scale(.7) rotate(360deg); opacity: 0; } }

.lab-storm { animation: lab-storm calc(2.6s * var(--speed)) ease-in-out var(--iter) both; }
@keyframes lab-storm { 0%, 100% { background: var(--color-sand); } 35%, 85% { background: #3b3f4d; } }
</style>
