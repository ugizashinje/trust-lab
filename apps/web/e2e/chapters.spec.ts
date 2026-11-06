import { LOCALES, expect, messages, msg, test } from './fixtures'

const CHAPTERS = [
  { path: '/', title: 'home.title' },
  { path: '/rules', title: 'rules.title' },
  { path: '/play', title: 'play.title' },
  { path: '/tournament', title: 'tournament.title' },
  { path: '/evolution', title: 'evolution.title' },
  { path: '/mistakes', title: 'mistakes.title' },
  { path: '/sandbox', title: 'sandbox.title' },
  { path: '/end', title: 'end.title' },
]

for (const locale of LOCALES) {
  test.describe(`chapters [${locale}]`, () => {
    const m = messages(locale)

    for (const chapter of CHAPTERS) {
      test(`${chapter.path} renders translated heading without console problems`, async ({
        open,
        problems,
      }) => {
        const page = await open(chapter.path, locale)
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(msg(m, chapter.title))
        // Nothing should overflow horizontally (long French/Serbian strings).
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        expect(overflow).toBeLessThanOrEqual(1)
        expect(problems).toEqual([])
      })
    }
  })
}

test('deep links work on refresh (SPA fallback)', async ({ page }) => {
  await page.goto('/tournament')
  await page.reload()
  await expect(page.getByTestId('leaderboard')).toBeVisible()
})
