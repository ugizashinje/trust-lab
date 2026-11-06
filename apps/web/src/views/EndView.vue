<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const LESSONS = ['future', 'winwin', 'forgive'] as const
</script>

<template>
  <article class="space-y-5">
    <h1>{{ t('end.title') }}</h1>
    <ol class="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
      <li v-for="(id, i) in LESSONS" :key="id" class="card relative pt-10">
        <span class="absolute top-3.5 left-5 font-display text-2xl text-accent" aria-hidden="true">
          {{ i + 1 }}
        </span>
        <h2 class="text-lg">{{ t(`end.lessons.${id}.title`) }}</h2>
        <p>{{ t(`end.lessons.${id}.body`) }}</p>
      </li>
    </ol>
    <p class="lead">{{ t('end.closing') }}</p>
    <div class="flex flex-wrap gap-3">
      <RouterLink :to="{ name: 'sandbox' }" class="btn btn-primary">
        {{ t('common.chapters.sandbox') }}
      </RouterLink>
      <RouterLink :to="{ name: 'home' }" class="btn">{{ t('common.nav.restart') }}</RouterLink>
    </div>
    <p class="mt-12 text-sm text-muted">{{ t('end.credits') }}</p>
  </article>
</template>
