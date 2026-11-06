import { expect, messages, msg, test } from './fixtures'

test.describe('play chapter', () => {
  test('a full game against all five strangers ends with a reveal', async ({ open, problems }) => {
    const page = await open('/play', 'en')
    await page.getByTestId('play-start').click()

    for (let stranger = 1; stranger <= 5; stranger++) {
      await expect(page.getByTestId('stranger')).toContainText(`${stranger} of 5`)
      // Always share until the stranger leaves.
      while (await page.getByTestId('move-C').isVisible()) {
        await page.getByTestId('move-C').click()
      }
      await page.getByTestId('play-next').click()
    }

    await expect(page.getByRole('heading', { name: 'Who were they?' })).toBeVisible()
    await expect(page.getByTestId('play-total')).toContainText(/Your total: \d+ points?/)
    expect(problems).toEqual([])
  })

  test('round outcome is described in Serbian Cyrillic', async ({ open }) => {
    const page = await open('/play', 'sr-Cyrl')
    const m = messages('sr-Cyrl')
    await page.getByTestId('play-start').click()
    await page.getByTestId('move-C').click()
    // First stranger (Monkey) shares in round 1: both shared.
    await expect(page.getByTestId('round-outcome')).toHaveText(
      msg(m, 'common.outcome.CC').replace('{you}', '3'),
    )
  })
})

test.describe('rules chapter', () => {
  test('clicking a matrix cell updates the outcome', async ({ open }) => {
    const page = await open('/rules', 'fr')
    const m = messages('fr')
    await page.getByRole('button', { name: /5\s*\/\s*0/ }).click()
    await expect(page.getByTestId('outcome')).toHaveText(
      msg(m, 'common.outcome.DC').replace('{you}', '5').replace('{them}', '0'),
    )
  })
})

test.describe('simulation', () => {
  test('every agent keeps its own spot on the ring across generations', async ({ open }) => {
    const page = await open('/evolution', 'en')
    for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Next generation' }).click()
    await page.waitForTimeout(900) // let move/fade transitions finish
    const dots = page.getByTestId('ring-dot')
    await expect(dots).toHaveCount(25)
    const centers = new Set<string>()
    for (const box of await dots.evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect()
        return `${Math.round(r.x + r.width / 2)},${Math.round(r.y + r.height / 2)}`
      }),
    ))
      centers.add(box)
    expect(centers.size).toBe(25)
  })

  test('one-shot meetings let the Foxes take over', async ({ open }) => {
    const page = await open('/evolution', 'en')
    await page.getByRole('tab', { name: 'One-time meetings' }).click()
    await page.getByRole('button', { name: 'Play' }).click()
    await expect(page.getByTestId('settled')).toHaveText('Only one strategy is left: Fox.', { timeout: 30_000 })
  })
})

test.describe('language switcher', () => {
  test('switching to Serbian defaults to Cyrillic and offers Latin', async ({ page }) => {
    await page.goto('/?lang=en')
    await page.getByTestId('language-select').selectOption('sr')
    await expect(page.locator('html')).toHaveAttribute('lang', 'sr-Cyrl')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(msg(messages('sr-Cyrl'), 'home.title'))

    await page.getByRole('button', { name: 'Lat' }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'sr-Latn')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(msg(messages('sr-Latn'), 'home.title'))

    // Choice survives a reload.
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'sr-Latn')
  })

  for (const browserLocale of ['en-US', 'fr-FR', 'sr-RS']) {
    test(`first visit defaults to Serbian Cyrillic (browser ${browserLocale})`, async ({ browser }) => {
      const context = await browser.newContext({ locale: browserLocale })
      const page = await context.newPage()
      await page.goto('/')
      await expect(page.locator('html')).toHaveAttribute('lang', 'sr-Cyrl')
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(msg(messages('sr-Cyrl'), 'home.title'))
      await expect(page.getByTestId('language-select')).toHaveValue('sr')
      await context.close()
    })
  }
})
