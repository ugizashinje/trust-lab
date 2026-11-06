<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { LANGUAGES, languageOf, setLocale, type LanguageId, type Locale } from '@/i18n'

const { t, locale } = useI18n()
const current = computed(() => locale.value as Locale)

const language = computed({
  get: () => languageOf(current.value),
  set: (id: LanguageId) => {
    const lang = LANGUAGES.find((l) => l.id === id)!
    setLocale(lang.locales[0])
  },
})

/** Script names are shown in their own script, so they are not translated. */
const SCRIPTS: { locale: Locale; label: string }[] = [
  { locale: 'sr-Cyrl', label: 'Ћир' },
  { locale: 'sr-Latn', label: 'Lat' },
]
</script>

<template>
  <div class="flex items-center gap-2">
    <label>
      <span class="sr-only">{{ t('common.nav.language') }}</span>
      <select
        v-model="language"
        class="rounded-lg border border-line bg-white px-2.5 py-1.5"
        data-testid="language-select"
      >
        <option v-for="l in LANGUAGES" :key="l.id" :value="l.id">{{ l.label }}</option>
      </select>
    </label>
    <div
      v-if="language === 'sr'"
      class="segmented text-sm"
      role="group"
      :aria-label="t('common.nav.script')"
    >
      <button
        v-for="s in SCRIPTS"
        :key="s.locale"
        type="button"
        class="px-2.5! py-1!"
        :aria-pressed="current === s.locale"
        @click="setLocale(s.locale)"
      >
        {{ s.label }}
      </button>
    </div>
  </div>
</template>
