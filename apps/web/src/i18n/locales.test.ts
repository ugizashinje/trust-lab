/**
 * Enforces the translation rules for every locale file:
 *  - same keys as en.json (no missing, no extra),
 *  - at most 4 levels of nesting, top-level keys included,
 *  - every leaf is a non-empty string,
 *  - same {placeholders} as the English text,
 *  - same number of plural forms as the language requires,
 *  - sr-Cyrl is written in Cyrillic, and sr-Latn is up to date.
 *
 * Files are read with fs on purpose: the Vite i18n plugin would turn the JSON
 * into compiled functions if they were imported.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
// @ts-expect-error plain .mjs helper shared with the generator script
import { toLatinMessages } from '../../scripts/sr-transliterate.mjs'

type Tree = { [key: string]: Tree | string }

const dir = fileURLToPath(new URL('./locales/', import.meta.url))
const load = (code: string) => JSON.parse(readFileSync(`${dir}${code}.json`, 'utf8')) as Tree

const MAX_DEPTH = 4
const NAMESPACES = [
  'common',
  'strategies',
  'sim',
  'home',
  'rules',
  'play',
  'tournament',
  'evolution',
  'mistakes',
  'sandbox',
  'end',
]
const PLURAL_FORMS: Record<string, number> = { en: 2, fr: 2, 'sr-Cyrl': 3, 'sr-Latn': 3 }
/** Latin words allowed inside Serbian Cyrillic text (titles, brand names). */
const LATIN_ALLOWED = ['The Evolution of Trust']

function leaves(tree: Tree, prefix = '', depth = 1): { key: string; value: unknown; depth: number }[] {
  return Object.entries(tree).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k
    return v !== null && typeof v === 'object' && !Array.isArray(v)
      ? leaves(v as Tree, key, depth + 1)
      : [{ key, value: v, depth }]
  })
}

/** Unique placeholder names: plural forms repeat `{n}` a different number of times per language. */
const placeholders = (s: string) => [...new Set([...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))].sort()

const en = load('en')
const enLeaves = new Map(leaves(en).map((l) => [l.key, l.value as string]))
const LOCALES = ['en', 'fr', 'sr-Cyrl', 'sr-Latn']

describe.each(LOCALES)('locale %s', (code) => {
  const tree = load(code)
  const all = leaves(tree)

  it('has only the agreed top-level namespaces', () => {
    expect(Object.keys(tree).sort()).toEqual([...NAMESPACES].sort())
  })

  it(`nests at most ${MAX_DEPTH} levels and every leaf is a non-empty string`, () => {
    const bad = all.filter((l) => l.depth > MAX_DEPTH || typeof l.value !== 'string' || !l.value)
    expect(bad.map((l) => l.key)).toEqual([])
  })

  it('has exactly the same keys as en.json', () => {
    const keys = new Set(all.map((l) => l.key))
    expect([...enLeaves.keys()].filter((k) => !keys.has(k))).toEqual([]) // missing
    expect([...keys].filter((k) => !enLeaves.has(k))).toEqual([]) // extra
  })

  it('uses the same placeholders as English', () => {
    const mismatched = all.filter(
      (l) => JSON.stringify(placeholders(l.value as string)) !== JSON.stringify(placeholders(enLeaves.get(l.key) ?? '')),
    )
    expect(mismatched.map((l) => l.key)).toEqual([])
  })

  it('has the right number of plural forms', () => {
    const plural = all.filter((l) => enLeaves.get(l.key)?.includes('|'))
    const wrong = plural.filter((l) => (l.value as string).split('|').length !== PLURAL_FORMS[code])
    expect(wrong.map((l) => l.key)).toEqual([])
  })
})

describe('French', () => {
  it('uses a non-breaking space before ? ! : ; % and inside « » (so punctuation never wraps alone)', () => {
    const offenders = leaves(load('fr')).filter((l) => / [?!:;»%]|« /.test(l.value as string))
    expect(offenders.map((l) => l.key)).toEqual([])
  })
})

describe('Serbian', () => {
  it('sr-Cyrl contains no Latin letters outside allowed names and placeholders', () => {
    const offenders = leaves(load('sr-Cyrl')).filter((l) => {
      let text = (l.value as string).replace(/\{\w+\}/g, '')
      for (const allowed of LATIN_ALLOWED) text = text.replaceAll(allowed, '')
      return /[A-Za-z]/.test(text)
    })
    expect(offenders.map((l) => l.key)).toEqual([])
  })

  it('sr-Latn.json matches the transliteration of sr-Cyrl.json', () => {
    expect(load('sr-Latn')).toEqual(toLatinMessages(load('sr-Cyrl')))
  })

  it('sr-Latn contains no Cyrillic letters', () => {
    const offenders = leaves(load('sr-Latn')).filter((l) => /[Ѐ-ӿ]/.test(l.value as string))
    expect(offenders.map((l) => l.key)).toEqual([])
  })
})
