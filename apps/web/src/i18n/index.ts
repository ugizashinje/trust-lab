import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'
import srCyrl from './locales/sr-Cyrl.json'
import srLatn from './locales/sr-Latn.json' // generated from sr-Cyrl.json
import { createPluralRule } from './plural'

/** English is the source of truth for keys; the key check test enforces it. */
export type MessageSchema = typeof en

/**
 * To add a language:
 *   1. copy locales/en.json to locales/<code>.json and translate it,
 *   2. import it below and add it to `messages` and `LANGUAGES`,
 *   3. run `npm test -w @trust-lab/web` (key, depth and placeholder checks).
 */
export const LANGUAGES = [
  { id: 'en', label: 'English', locales: ['en'] },
  { id: 'fr', label: 'Français', locales: ['fr'] },
  { id: 'sr', label: 'Српски', locales: ['sr-Cyrl', 'sr-Latn'] },
] as const

export type Locale = 'en' | 'fr' | 'sr-Cyrl' | 'sr-Latn'
export type LanguageId = (typeof LANGUAGES)[number]['id']

const messages: Record<Locale, MessageSchema> = {
  en,
  fr,
  'sr-Cyrl': srCyrl,
  'sr-Latn': srLatn,
}

export const LOCALES = Object.keys(messages) as Locale[]
const STORAGE_KEY = 'trust-lab.locale'
const DEFAULT_LOCALE: Locale = 'en'

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as string[]).includes(value)
}

/** Maps a BCP 47 tag (e.g. from the browser) to a supported locale. */
export function matchLocale(tag: string): Locale | undefined {
  const lower = tag.toLowerCase()
  if (lower.startsWith('sr')) return lower.includes('latn') ? 'sr-Latn' : 'sr-Cyrl'
  const base = lower.split('-')[0]
  return isLocale(base) ? base : undefined
}

export function languageOf(locale: Locale): LanguageId {
  return LANGUAGES.find((l) => (l.locales as readonly string[]).includes(locale))!.id
}

/** Starting locale: ?lang= → saved choice → browser languages → English. */
function detectLocale(): Locale {
  const fromQuery = new URLSearchParams(window.location.search).get('lang')
  const queryMatch = fromQuery ? matchLocale(fromQuery) : undefined
  if (queryMatch) return queryMatch

  const saved = localStorage.getItem(STORAGE_KEY)
  if (isLocale(saved)) return saved

  for (const tag of navigator.languages ?? [navigator.language]) {
    const match = matchLocale(tag)
    if (match) return match
  }
  return DEFAULT_LOCALE
}

export const i18n = createI18n<[MessageSchema], Locale, false>({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages,
  pluralRules: {
    en: createPluralRule('en'),
    fr: createPluralRule('fr'),
    'sr-Cyrl': createPluralRule('sr'),
    'sr-Latn': createPluralRule('sr'),
  },
})

function syncDocument(locale: Locale) {
  document.documentElement.lang = locale
  document.title = messages[locale].common.app.title
}

export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale
  localStorage.setItem(STORAGE_KEY, locale)
  syncDocument(locale)
}

syncDocument(i18n.global.locale.value)
