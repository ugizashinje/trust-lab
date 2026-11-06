/**
 * Catches typos in translation keys: every `t('...')` call in the source must
 * point to a key that exists in en.json. Template-literal keys such as
 * t(`strategies.${id}.name`) must match at least one existing key.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

type Tree = { [key: string]: Tree | string }

const srcDir = fileURLToPath(new URL('../', import.meta.url))
const en = JSON.parse(
  readFileSync(fileURLToPath(new URL('./locales/en.json', import.meta.url)), 'utf8'),
) as Tree

const flatten = (tree: Tree, prefix = ''): string[] =>
  Object.entries(tree).flatMap(([k, v]) =>
    typeof v === 'string' ? [`${prefix}${k}`] : flatten(v, `${prefix}${k}.`),
  )
const KEYS = flatten(en)

const files = readdirSync(srcDir, { recursive: true, encoding: 'utf8' })
  .filter((f) => /\.(vue|ts)$/.test(f) && !f.endsWith('.test.ts'))
  .map((f) => ({ file: f, text: readFileSync(`${srcDir}${f}`, 'utf8') }))

const CALL = /\bt\(\s*(['`])([^'`]+)\1/g
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

describe('translation key usage', () => {
  const calls = files.flatMap(({ file, text }) =>
    [...text.matchAll(CALL)].map((m) => ({ file, key: m[2]!, dynamic: m[1] === '`' })),
  )

  it('finds t() calls in the source', () => {
    expect(calls.length).toBeGreaterThan(20)
  })

  it('every key used in the source exists in en.json', () => {
    const missing = calls.filter(({ key, dynamic }) => {
      if (!dynamic) return !KEYS.includes(key)
      const pattern = new RegExp(`^${key.split(/\$\{[^}]+\}/).map(escape).join('[^.]+')}$`)
      return !KEYS.some((k) => pattern.test(k))
    })
    expect(missing.map((c) => `${c.file}: ${c.key}`)).toEqual([])
  })
})
