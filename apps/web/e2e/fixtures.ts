import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { test as base, expect, type Page } from '@playwright/test'

export const LOCALES = ['en', 'fr', 'sr-Cyrl', 'sr-Latn'] as const
export type Locale = (typeof LOCALES)[number]

type Tree = { [key: string]: Tree | string }

/** Loads a locale's messages so tests can assert on real translated text. */
export function messages(locale: Locale): Tree {
  const file = fileURLToPath(new URL(`../src/i18n/locales/${locale}.json`, import.meta.url))
  return JSON.parse(readFileSync(file, 'utf8')) as Tree
}

/** Reads a message by dotted key, e.g. msg(m, 'play.match.prompt'). */
export function msg(tree: Tree, key: string): string {
  const value = key.split('.').reduce<Tree | string>((node, part) => (node as Tree)[part]!, tree)
  if (typeof value !== 'string') throw new Error(`Not a leaf: ${key}`)
  return value
}

/**
 * Opens a page in a given locale and records console problems. Missing
 * translation keys show up as vue-i18n warnings, so they fail the test.
 */
export const test = base.extend<{ problems: string[]; open: (path: string, locale: Locale) => Promise<Page> }>({
  problems: async ({ page }, use) => {
    const problems: string[] = []
    page.on('console', (m) => {
      if (m.type() === 'error' || m.type() === 'warning') problems.push(m.text())
    })
    page.on('pageerror', (e) => problems.push(e.message))
    await use(problems)
  },
  open: async ({ page }, use) => {
    await use(async (path, locale) => {
      const sep = path.includes('?') ? '&' : '?'
      await page.goto(`${path}${sep}lang=${locale}`)
      await expect(page.locator('html')).toHaveAttribute('lang', locale)
      return page
    })
  },
})

export { expect }
