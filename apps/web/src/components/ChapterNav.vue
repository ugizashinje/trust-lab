<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { CHAPTERS, type ChapterId } from '@/router'

const { t } = useI18n()
const route = useRoute()

const index = computed(() => CHAPTERS.indexOf(route.name as ChapterId))
const prev = computed(() => (index.value > 0 ? CHAPTERS[index.value - 1] : undefined))
const next = computed(() =>
  index.value >= 0 && index.value < CHAPTERS.length - 1 ? CHAPTERS[index.value + 1] : undefined,
)
</script>

<template>
  <nav
    v-if="index > 0"
    class="sticky bottom-0 flex justify-between gap-4 border-t border-line bg-paper/90 px-[max(1rem,(100%-960px)/2)] py-3 backdrop-blur"
  >
    <RouterLink v-if="prev" :to="{ name: prev }" class="btn btn-ghost">
      ← {{ t(`common.chapters.${prev}`) }}
    </RouterLink>
    <span v-else />
    <RouterLink v-if="next" :to="{ name: next }" class="btn btn-primary" data-testid="next-chapter">
      {{ t(`common.chapters.${next}`) }} →
    </RouterLink>
    <RouterLink v-else :to="{ name: 'home' }" class="btn">
      {{ t('common.nav.restart') }}
    </RouterLink>
  </nav>
</template>
