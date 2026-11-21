<script setup lang="ts">
/**
 * Original anime-action Monkey: spiky crest, cel shading, big shiny eyes.
 * Front-facing so it reads well on the left side of the table.
 */
import { useId } from 'vue'
import { INK, type Mood } from './types'

withDefaults(defineProps<{ mood?: Mood; aura?: boolean }>(), { mood: 'idle', aura: false })

const uid = useId()
const FUR = '#8b5a35'
const FUR_DARK = '#5e3a20'
const SKIN = '#f2c49b'
const SKIN_DARK = '#d99d70'
const MOUTH = '#5a1a14'
</script>

<template>
  <svg viewBox="0 0 200 200" class="block size-full overflow-visible" aria-hidden="true">
    <defs>
      <clipPath :id="`${uid}-head`"><circle cx="100" cy="106" r="62" /></clipPath>
      <clipPath :id="`${uid}-mask`">
        <path d="M100 84C88 66 52 68 52 100c0 18 8 28 12 34 2 26 20 36 36 36s34-10 36-36c4-6 12-16 12-34 0-32-36-34-48-16Z" />
      </clipPath>
      <radialGradient :id="`${uid}-aura`">
        <stop offset="0.45" stop-color="#ffe680" stop-opacity="0.95" />
        <stop offset="1" stop-color="#ffb300" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- energy aura -->
    <path
      v-if="aura"
      :fill="`url(#${uid}-aura)`"
      d="M100 -6 112 30 140 4 140 42 176 26 160 62 198 66 168 92 200 116 162 124 182 158 146 150 150 192 120 164 100 200 80 164 50 192 54 150 18 158 38 124 0 116 32 92 2 66 40 62 24 26 60 42 60 4 88 30Z"
    />

    <g :stroke="INK" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
      <!-- spiky crest -->
      <path :fill="FUR" d="M56 78 44 34 76 58 84 14 104 50 124 16 128 58 158 34 146 80Z" />
      <!-- ears -->
      <circle cx="40" cy="108" r="24" :fill="FUR" />
      <circle cx="40" cy="108" r="12" :fill="SKIN" stroke-width="3" />
      <circle cx="160" cy="108" r="24" :fill="FUR" />
      <circle cx="160" cy="108" r="12" :fill="SKIN" stroke-width="3" />
      <!-- head + cel shadow -->
      <circle cx="100" cy="106" r="62" :fill="FUR" />
      <g :clip-path="`url(#${uid}-head)`" stroke="none">
        <ellipse cx="172" cy="120" rx="44" ry="80" :fill="FUR_DARK" opacity="0.55" />
        <ellipse cx="74" cy="62" rx="22" ry="9" fill="#fff" opacity="0.18" transform="rotate(-25 74 62)" />
      </g>
      <!-- face mask + shadow -->
      <path :fill="SKIN" stroke-width="4" d="M100 84C88 66 52 68 52 100c0 18 8 28 12 34 2 26 20 36 36 36s34-10 36-36c4-6 12-16 12-34 0-32-36-34-48-16Z" />
      <g :clip-path="`url(#${uid}-mask)`" stroke="none">
        <ellipse cx="150" cy="140" rx="26" ry="50" :fill="SKIN_DARK" opacity="0.6" />
      </g>
      <!-- nostrils -->
      <ellipse cx="94" cy="134" rx="3" ry="4" :fill="INK" stroke="none" />
      <ellipse cx="106" cy="134" rx="3" ry="4" :fill="INK" stroke="none" />

      <!-- ===== moods ===== -->
      <template v-if="mood === 'happy'">
        <path fill="none" stroke-width="6" d="M68 108q12-16 24 0M108 108q12-16 24 0" />
        <path fill="none" stroke-width="6" d="M66 80q13-8 26-2M134 80q-13-8-26-2" />
        <path :fill="MOUTH" stroke-width="4" d="M78 144q22 34 44 0Z" />
        <path fill="#e8686a" stroke="none" d="M88 156q12 10 24 0q-12-6-24 0Z" />
        <ellipse cx="66" cy="126" rx="9" ry="5" fill="#ff7f8a" opacity="0.55" stroke="none" />
        <ellipse cx="134" cy="126" rx="9" ry="5" fill="#ff7f8a" opacity="0.55" stroke="none" />
      </template>

      <template v-else-if="mood === 'sad'">
        <g stroke-width="3">
          <ellipse cx="80" cy="106" rx="12" ry="15" fill="#fff" />
          <ellipse cx="120" cy="106" rx="12" ry="15" fill="#fff" />
        </g>
        <ellipse cx="81" cy="112" rx="8" ry="9" :fill="INK" stroke="none" />
        <ellipse cx="119" cy="112" rx="8" ry="9" :fill="INK" stroke="none" />
        <circle cx="78" cy="108" r="3" fill="#fff" stroke="none" />
        <circle cx="116" cy="108" r="3" fill="#fff" stroke="none" />
        <circle cx="84" cy="115" r="1.6" fill="#fff" stroke="none" />
        <circle cx="122" cy="115" r="1.6" fill="#fff" stroke="none" />
        <path fill="none" stroke-width="6" d="M66 90 92 80M134 90 108 80" />
        <path fill="#7cc7f2" stroke-width="2.5" d="M70 120c-4 12-6 22 0 26 6-4 4-14 0-26ZM130 120c-4 12-6 22 0 26 6-4 4-14 0-26Z" />
        <path fill="none" stroke-width="4" d="M84 156q8-10 16-4t16 4" />
      </template>

      <template v-else-if="mood === 'smug'">
        <g stroke-width="3">
          <ellipse cx="80" cy="110" rx="12" ry="9" fill="#fff" />
          <ellipse cx="120" cy="110" rx="12" ry="9" fill="#fff" />
        </g>
        <circle cx="84" cy="112" r="6" :fill="INK" stroke="none" />
        <circle cx="124" cy="112" r="6" :fill="INK" stroke="none" />
        <circle cx="82" cy="110" r="2" fill="#fff" stroke="none" />
        <circle cx="122" cy="110" r="2" fill="#fff" stroke="none" />
        <path fill="none" stroke-width="6" d="M66 104h28M106 104h28" />
        <path fill="none" stroke-width="6" d="M64 84q14-14 30-2M108 94l26-4" />
        <path fill="none" stroke-width="4" d="M84 150q20 8 34-10" />
        <path fill="#fff" stroke-width="2.5" d="M106 150l6 6 3-9Z" />
      </template>

      <template v-else-if="mood === 'angry'">
        <g stroke-width="3">
          <ellipse cx="80" cy="108" rx="12" ry="11" fill="#fff" />
          <ellipse cx="120" cy="108" rx="12" ry="11" fill="#fff" />
        </g>
        <circle cx="83" cy="109" r="4.5" :fill="INK" stroke="none" />
        <circle cx="117" cy="109" r="4.5" :fill="INK" stroke="none" />
        <path :fill="FUR" stroke-width="7" d="M62 84 96 98M138 84 104 98" />
        <rect x="82" y="144" width="36" height="14" rx="3" fill="#fff" stroke-width="3.5" />
        <path fill="none" stroke-width="2.5" d="M82 151h36M91 144v14M100 144v14M109 144v14" />
        <path fill="none" stroke="#e0302a" stroke-width="5" d="M138 52q6 6 0 12M150 52q-6 6 0 12M138 52q6 4 12 0M138 64q6-4 12 0" />
      </template>

      <!-- idle -->
      <template v-else>
        <g stroke-width="3">
          <ellipse cx="80" cy="106" rx="12" ry="16" fill="#fff" />
          <ellipse cx="120" cy="106" rx="12" ry="16" fill="#fff" />
        </g>
        <ellipse cx="84" cy="107" rx="8" ry="11" :fill="INK" stroke="none" />
        <ellipse cx="116" cy="107" rx="8" ry="11" :fill="INK" stroke="none" />
        <circle cx="81" cy="101" r="3.5" fill="#fff" stroke="none" />
        <circle cx="113" cy="101" r="3.5" fill="#fff" stroke="none" />
        <circle cx="87" cy="112" r="1.6" fill="#fff" stroke="none" />
        <circle cx="119" cy="112" r="1.6" fill="#fff" stroke="none" />
        <path fill="none" stroke-width="6" d="M66 86l26 6M134 86l-26 6" />
        <path fill="none" stroke-width="4" d="M86 150q14 8 28-4" />
      </template>
    </g>
  </svg>
</template>
