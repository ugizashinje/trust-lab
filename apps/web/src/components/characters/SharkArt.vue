<script setup lang="ts">
/**
 * Original anime-action Shark: sharp fins, cel shading, angular eye.
 * Faces left, toward the Monkey across the table.
 */
import { useId } from 'vue'
import { INK, type Mood } from './types'

withDefaults(defineProps<{ mood?: Mood; aura?: boolean }>(), { mood: 'idle', aura: false })

const uid = useId()
const SKIN = '#6d8ea6'
const SKIN_DARK = '#46667e'
const BELLY = '#eef3f6'
const MOUTH = '#5a1a14'
const BODY =
  'M22 112C28 70 78 48 128 52c32 2 54 22 58 48 4 30-18 60-66 64-50 4-92-14-98-52Z'
const TEETH_TOP = 'M34 118l6 9 6-8 6 10 6-9 6 10 6-9 6 10 6-9 6 9 6-8 6 8'
</script>

<template>
  <svg viewBox="0 0 200 200" class="block size-full overflow-visible" aria-hidden="true">
    <defs>
      <clipPath :id="`${uid}-body`"><path :d="BODY" /></clipPath>
      <radialGradient :id="`${uid}-aura`">
        <stop offset="0.45" stop-color="#9fe8ff" stop-opacity="0.95" />
        <stop offset="1" stop-color="#2d7bff" stop-opacity="0" />
      </radialGradient>
    </defs>

    <path
      v-if="aura"
      :fill="`url(#${uid}-aura)`"
      d="M100 -6 112 30 140 4 140 42 176 26 160 62 198 66 168 92 200 116 162 124 182 158 146 150 150 192 120 164 100 200 80 164 50 192 54 150 18 158 38 124 0 116 32 92 2 66 40 62 24 26 60 42 60 4 88 30Z"
    />

    <g :stroke="INK" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
      <!-- fins behind the body -->
      <path :fill="SKIN" d="M100 58 132 4 148 62Z" />
      <path :fill="SKIN" d="M176 92 198 62 196 136 176 118Z" />
      <!-- body, belly, shading -->
      <path :fill="SKIN" :d="BODY" />
      <g :clip-path="`url(#${uid}-body)`" stroke="none">
        <path :fill="BELLY" d="M10 114c40 14 110 16 186-8v80H10Z" />
        <ellipse cx="150" cy="54" rx="70" ry="30" :fill="SKIN_DARK" opacity="0.55" />
        <ellipse cx="70" cy="70" rx="26" ry="8" fill="#fff" opacity="0.25" transform="rotate(-18 70 70)" />
      </g>
      <path fill="none" :d="BODY" />
      <!-- gills + pectoral fin -->
      <path fill="none" stroke-width="4" d="M134 90q-6 14 0 28M144 88q-6 14 0 28M154 88q-6 14 0 26" />
      <path :fill="SKIN" d="M98 142 80 184 128 152Z" />

      <!-- ===== moods ===== -->
      <template v-if="mood === 'happy'">
        <path fill="none" stroke-width="6" d="M58 90q12-14 24 0" />
        <path fill="none" stroke-width="6" d="M56 70q14-8 30 0" />
        <path :fill="MOUTH" stroke-width="4" d="M30 114q38 46 80 2Z" />
        <path fill="#fff" stroke-width="2.5" :d="`${TEETH_TOP}Z`" />
        <ellipse cx="96" cy="104" rx="9" ry="5" fill="#ff7f8a" opacity="0.5" stroke="none" />
      </template>

      <template v-else-if="mood === 'sad'">
        <path fill="#fff" stroke-width="3" d="M54 88q16-16 32 0q-16 16-32 0Z" />
        <circle cx="70" cy="93" r="7" :fill="INK" stroke="none" />
        <circle cx="67" cy="90" r="2.5" fill="#fff" stroke="none" />
        <path fill="none" stroke-width="6" d="M54 70l30 8" />
        <path fill="#7cc7f2" stroke-width="2.5" d="M62 100c-4 12-6 22 0 26 6-4 4-14 0-26Z" />
        <path fill="none" stroke-width="4" d="M40 134q28-16 60-2" />
      </template>

      <template v-else-if="mood === 'smug'">
        <path fill="#fff" stroke-width="3" d="M54 90q16-12 32 0q-16 10-32 0Z" />
        <circle cx="64" cy="91" r="6" :fill="INK" stroke="none" />
        <circle cx="62" cy="89" r="2" fill="#fff" stroke="none" />
        <path fill="none" stroke-width="6" d="M52 86h36" />
        <path fill="none" stroke-width="6" d="M52 72q18-16 36-2" />
        <path :fill="MOUTH" stroke-width="4" d="M30 116q40 30 82-4q-40 14-82 4Z" />
        <path fill="#fff" stroke-width="2.5" d="M38 120l6 7 6-6 6 8 6-7 6 8 6-7 6 8 6-8 6 6 6-7 6 4Z" />
      </template>

      <template v-else-if="mood === 'angry'">
        <path fill="#fff" stroke-width="3" d="M54 92q16-10 32-4q-16 14-32 4Z" />
        <circle cx="68" cy="93" r="4.5" :fill="INK" stroke="none" />
        <path fill="none" stroke-width="8" d="M50 72l38 14" />
        <path :fill="MOUTH" stroke-width="4" d="M30 114q40 34 82 2q-40 4-82-2Z" />
        <path fill="#fff" stroke-width="2.5" :d="`${TEETH_TOP}Z`" />
        <path fill="#fff" stroke-width="2.5" d="M46 132l6-8 6 9 6-9 6 9 6-9 6 9 6-8 6 6" />
        <path fill="none" stroke="#e0302a" stroke-width="5" d="M100 62q6 6 0 12M112 62q-6 6 0 12M100 62q6 4 12 0M100 74q6-4 12 0" />
      </template>

      <!-- idle -->
      <template v-else>
        <path fill="#fff" stroke-width="3" d="M52 90q18-18 36 0q-18 16-36 0Z" />
        <ellipse cx="66" cy="90" rx="8" ry="9" :fill="INK" stroke="none" />
        <circle cx="63" cy="86" r="3" fill="#fff" stroke="none" />
        <circle cx="69" cy="94" r="1.5" fill="#fff" stroke="none" />
        <path fill="none" stroke-width="6" d="M50 74l38 6" />
        <path fill="none" stroke-width="4" d="M32 120q36 14 70-2" />
        <path fill="#fff" stroke-width="2.5" d="M42 124l5 7 5-6 5 7 5-6 5 6 5-6 5 5Z" />
      </template>
    </g>
  </svg>
</template>
