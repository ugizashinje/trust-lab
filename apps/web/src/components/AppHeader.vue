<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { CHAPTERS } from '@/router'
import LanguageSwitcher from './LanguageSwitcher.vue'

const { t } = useI18n()
const route = useRoute()
</script>

<template>
  <header
    class="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-line bg-paper/90 px-[max(1rem,(100%-960px)/2)] py-3 backdrop-blur md:flex-nowrap"
  >
    <RouterLink to="/" class="flex items-center gap-2 font-bold whitespace-nowrap no-underline">
      <span class="relative h-5 w-7" aria-hidden="true">
        <i class="absolute top-0 left-0 size-5 rounded-full bg-accent opacity-90" />
        <i class="absolute top-0 right-0 size-5 rounded-full bg-[#e8a33d] opacity-90" />
      </span>
      <span>{{ t('common.app.title') }}</span>
    </RouterLink>

    <nav
      class="order-3 flex w-full justify-between gap-1.5 md:order-none md:w-auto md:justify-start"
      :aria-label="t('common.nav.chapters')"
    >
      <RouterLink
        v-for="(id, i) in CHAPTERS"
        :key="id"
        :to="{ name: id }"
        class="grid size-7 place-items-center rounded-full border text-xs no-underline"
        :class="
          route.name === id
            ? 'border-accent bg-accent text-white'
            : 'border-line bg-white text-muted hover:border-line-strong'
        "
        :aria-current="route.name === id ? 'page' : undefined"
        :title="t(`common.chapters.${id}`)"
      >
        <span class="sr-only">{{ t(`common.chapters.${id}`) }}</span>
        <span aria-hidden="true">{{ i + 1 }}</span>
      </RouterLink>
    </nav>

    <LanguageSwitcher />
  </header>
</template>
