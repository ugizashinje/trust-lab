<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import StrategyBubbles from '@/components/StrategyBubbles.vue'

const { t } = useI18n()
</script>

<template>
  <section class="py-12 text-center">
    <p class="kicker mb-4">{{ t('home.kicker') }}</p>
    <h1 class="mx-auto mb-4 max-w-[18ch] text-[clamp(2.2rem,6vw,3.6rem)]">{{ t('home.title') }}</h1>
    <p class="lead mx-auto mb-8">{{ t('home.lead') }}</p>
    <StrategyBubbles class="mb-8" />
    <RouterLink :to="{ name: 'rules' }" class="btn btn-primary btn-lg" data-testid="start">
      {{ t('home.start') }} →
    </RouterLink>
  </section>
</template>
