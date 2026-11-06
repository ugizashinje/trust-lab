<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { STRATEGY_IDS, STRATEGY_META } from '@/strategyMeta'

const { t } = useI18n()
</script>

<template>
  <section class="py-12 text-center">
    <p class="kicker mb-4">{{ t('home.kicker') }}</p>
    <h1 class="mx-auto mb-4 max-w-[18ch] text-[clamp(2.2rem,6vw,3.6rem)]">{{ t('home.title') }}</h1>
    <p class="lead mx-auto mb-8">{{ t('home.lead') }}</p>
    <div class="mb-8 flex flex-wrap justify-center gap-2.5" aria-hidden="true">
      <span
        v-for="(id, i) in STRATEGY_IDS"
        :key="id"
        class="grid size-12 animate-bob place-items-center rounded-full text-2xl"
        :style="{ background: STRATEGY_META[id].color, animationDelay: `${i * 0.12}s` }"
      >
        {{ STRATEGY_META[id].icon }}
      </span>
    </div>
    <RouterLink :to="{ name: 'rules' }" class="btn btn-primary btn-lg" data-testid="start">
      {{ t('home.start') }} →
    </RouterLink>
  </section>
</template>
