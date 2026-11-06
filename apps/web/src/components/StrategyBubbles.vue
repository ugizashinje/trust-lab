<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { STRATEGY_IDS, STRATEGY_META } from '@/strategyMeta'

/**
 * Row of character tokens with one cartoon speech balloon above it.
 * - Rotates through the characters on its own.
 * - Hover (mouse) or keyboard focus shows that character and pauses rotation
 *   until the pointer/focus leaves; rotation then continues from it.
 * - Tap/click selects a character and pauses rotation for a while.
 * - prefers-reduced-motion: no auto-rotation.
 */
const ROTATE_MS = 3500
const TAP_PAUSE_MS = 8000

const { t } = useI18n()
const active = ref(0)
const held = ref(false)
let pausedUntil = 0
let timer: ReturnType<typeof setInterval> | undefined

const wrap = ref<HTMLElement | null>(null)
const buttons: HTMLElement[] = []
const tailX = ref(0)

const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function stop() {
  if (timer !== undefined) clearInterval(timer)
  timer = undefined
}

/** (Re)starts the rotation clock, so the next change is a full interval away. */
function schedule() {
  stop()
  if (!reducedMotion) timer = setInterval(tick, ROTATE_MS)
}

function tick() {
  if (held.value || Date.now() < pausedUntil) return
  active.value = (active.value + 1) % STRATEGY_IDS.length
}

function hold(i: number) {
  active.value = i
  held.value = true
}

function release() {
  held.value = false
  schedule()
}

function onPointerEnter(i: number, e: PointerEvent) {
  if (e.pointerType === 'mouse') hold(i)
}

function onPointerLeave(e: PointerEvent) {
  if (e.pointerType === 'mouse') release()
}

/** Only keyboard focus holds; a tap also focuses the button but is handled by `select`. */
function onFocus(i: number, e: FocusEvent) {
  if ((e.target as HTMLElement).matches(':focus-visible')) hold(i)
}

function select(i: number) {
  active.value = i
  pausedUntil = Date.now() + TAP_PAUSE_MS
  schedule()
}

/** Horizontal position of the balloon tail: centre of the active token. */
function measure() {
  const w = wrap.value
  const b = buttons[active.value]
  if (!w || !b) return
  const wr = w.getBoundingClientRect()
  const br = b.getBoundingClientRect()
  tailX.value = Math.min(Math.max(br.left + br.width / 2 - wr.left, 28), wr.width - 28)
}

let observer: ResizeObserver | undefined
onMounted(() => {
  schedule()
  measure()
  observer = new ResizeObserver(measure)
  if (wrap.value) observer.observe(wrap.value)
})
onBeforeUnmount(() => {
  stop()
  observer?.disconnect()
})
watch(active, () => nextTick(measure))
</script>

<template>
  <div ref="wrap" class="relative mx-auto w-full max-w-xl">
    <!-- All balloons share one grid cell, so the height is that of the longest text and never jumps. -->
    <div
      class="relative mb-9 grid rounded-3xl border-3 border-ink bg-white px-5 py-4 text-left shadow-[5px_5px_0_var(--color-ink)]"
    >
      <div
        v-for="(id, i) in STRATEGY_IDS"
        :id="`bubble-${id}`"
        :key="id"
        class="col-start-1 row-start-1 transition-all duration-300"
        :class="i === active ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-1 opacity-0'"
      >
        <p class="mb-1 flex flex-wrap items-baseline gap-x-2">
          <strong class="font-display text-xl">{{ t(`strategies.${id}.name`) }}</strong>
          <span class="text-sm text-muted">{{ t(`strategies.${id}.tech`) }}</span>
        </p>
        <p class="m-0 leading-snug text-ink-soft">{{ t(`strategies.${id}.desc`) }}</p>
      </div>

      <span
        class="absolute -bottom-[12px] size-5 -translate-x-1/2 rotate-45 border-r-3 border-b-3 border-ink bg-white transition-[left] duration-300"
        :style="{ left: `${tailX}px` }"
        aria-hidden="true"
      />
    </div>

    <div class="flex flex-wrap justify-center gap-2 sm:gap-2.5">
      <button
        v-for="(id, i) in STRATEGY_IDS"
        :key="id"
        :ref="(el) => (buttons[i] = el as HTMLElement)"
        type="button"
        class="grid size-9 cursor-pointer place-items-center rounded-full border-0 text-xl transition-transform duration-300 sm:size-12 sm:text-2xl"
        :class="
          i === active
            ? '-translate-y-1.5 scale-110 ring-3 ring-ink ring-offset-2 ring-offset-paper'
            : 'hover:-translate-y-0.5'
        "
        :style="{ background: STRATEGY_META[id].color }"
        :aria-pressed="i === active"
        :aria-describedby="`bubble-${id}`"
        @pointerenter="onPointerEnter(i, $event)"
        @pointerleave="onPointerLeave($event)"
        @focus="onFocus(i, $event)"
        @blur="release"
        @click="select(i)"
      >
        <span
          class="animate-bob"
          :style="{ animationDelay: `${i * 0.12}s` }"
          aria-hidden="true"
        >
          {{ STRATEGY_META[id].icon }}
        </span>
        <span class="sr-only">{{ t(`strategies.${id}.name`) }}</span>
      </button>
    </div>

    <p class="mt-3 text-sm text-muted">{{ t('home.hint') }}</p>
  </div>
</template>
