<script setup lang="ts">
/** DEV-ONLY preview of the drawn characters in every mood. Not translated, not shipped. */
import { ref } from 'vue'
import MonkeyArt from '@/components/characters/MonkeyArt.vue'
import SharkArt from '@/components/characters/SharkArt.vue'
import { MOODS } from '@/components/characters/types'
import { STRATEGY_META } from '@/strategyMeta'

const aura = ref(false)
const disc = ref(true)
const size = ref(176)
</script>

<template>
  <article class="space-y-8">
    <header class="space-y-2">
      <span class="kicker">Design lab · dev only</span>
      <h1>Drawn characters</h1>
      <p class="lead">Original anime-action Monkey and Shark. One mood per reaction on the table.</p>
    </header>

    <div class="sticky top-0 z-20 -mx-2 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-line bg-white/95 px-4 py-3 shadow-card backdrop-blur">
      <label class="flex items-center gap-2 text-sm"><input v-model="aura" type="checkbox" class="accent-accent" /> Aura</label>
      <label class="flex items-center gap-2 text-sm"><input v-model="disc" type="checkbox" class="accent-accent" /> Colour disc</label>
      <label class="flex items-center gap-2 text-sm">
        Size <input v-model.number="size" type="range" min="96" max="260" step="8" class="w-32!" />
        <span class="tabular-nums text-muted">{{ size }}px</span>
      </label>
    </div>

    <section class="card space-y-3">
      <h2>Face-off (in context)</h2>
      <div class="flex items-center justify-center gap-6">
        <div
          class="grid place-items-center rounded-full p-3"
          :style="{ width: `${size}px`, height: `${size}px`, background: disc ? STRATEGY_META.titForTat.color : 'transparent' }"
        >
          <MonkeyArt :aura="aura" />
        </div>
        <div class="h-16 w-32 rounded-[50%] border-4 border-table-edge bg-table" />
        <div
          class="grid place-items-center rounded-full p-3"
          :style="{ width: `${size}px`, height: `${size}px`, background: disc ? STRATEGY_META.alwaysDefect.color : 'transparent' }"
        >
          <SharkArt :aura="aura" />
        </div>
      </div>
    </section>

    <section v-for="who in ['monkey', 'shark'] as const" :key="who" class="space-y-3">
      <h2>{{ who === 'monkey' ? 'Monkey' : 'Shark' }}</h2>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <figure v-for="m in MOODS" :key="m" class="card flex flex-col items-center gap-2 p-4!">
          <div
            class="grid place-items-center rounded-full p-2"
            :style="{
              width: `${Math.min(size, 160)}px`,
              height: `${Math.min(size, 160)}px`,
              background: disc ? STRATEGY_META[who === 'monkey' ? 'titForTat' : 'alwaysDefect'].color : 'transparent',
            }"
          >
            <MonkeyArt v-if="who === 'monkey'" :mood="m" :aura="aura" />
            <SharkArt v-else :mood="m" :aura="aura" />
          </div>
          <figcaption class="text-sm font-semibold">{{ m }}</figcaption>
        </figure>
      </div>
    </section>
  </article>
</template>
