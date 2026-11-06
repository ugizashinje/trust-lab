import { expect, messages, msg, test } from './fixtures'

const ROTATE_MS = 3500

for (const locale of ['en', 'sr-Cyrl'] as const) {
  test.describe(`landing balloons [${locale}]`, () => {
    const m = messages(locale)
    const desc = (id: string) => msg(m, `strategies.${id}.desc`)
    const name = (id: string) => msg(m, `strategies.${id}.name`)

    test('rotates on its own, starting with the first character', async ({ page, open, problems }) => {
      await page.clock.install()
      await open('/', locale)

      await expect(page.getByText(desc('alwaysCooperate'))).toBeVisible()
      await expect(page.getByRole('button', { name: name('alwaysCooperate'), exact: true })).toHaveAttribute(
        'aria-pressed',
        'true',
      )

      await page.clock.runFor(ROTATE_MS + 100)
      await expect(page.getByText(desc('alwaysDefect'))).toBeVisible()
      await expect(page.getByText(desc('alwaysCooperate'))).toBeHidden()

      await page.clock.runFor(ROTATE_MS)
      await expect(page.getByText(desc('titForTat'))).toBeVisible()
      expect(problems).toEqual([])
    })

    test('hovering a character explains it and pauses rotation', async ({ page, open }) => {
      await page.clock.install()
      await open('/', locale)

      const scout = page.getByRole('button', { name: name('prober'), exact: true })
      await scout.hover()
      await expect(page.getByText(desc('prober'))).toBeVisible()
      await expect(scout).toHaveAttribute('aria-pressed', 'true')

      await page.clock.runFor(ROTATE_MS * 3)
      await expect(page.getByText(desc('prober'))).toBeVisible()

      // Leaving resumes rotation from the hovered character.
      await page.mouse.move(5, 5)
      await page.clock.runFor(ROTATE_MS + 100)
      await expect(page.getByText(desc('alwaysCooperate'))).toBeVisible() // wraps to the first
    })
  })
}

test('keyboard focus explains a character and holds it', async ({ page, open }) => {
  await page.clock.install()
  await open('/', 'en')

  await page.getByRole('button', { name: 'Dove', exact: true }).focus()
  await page.keyboard.press('Tab') // real keyboard navigation → :focus-visible
  const fox = page.getByRole('button', { name: 'Fox', exact: true })
  await expect(fox).toBeFocused()
  await expect(fox).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByText('Never shares. Takes whatever it can get.')).toBeVisible()

  await page.clock.runFor(ROTATE_MS * 3)
  await expect(page.getByText('Never shares. Takes whatever it can get.')).toBeVisible()
})

test('tapping selects a character and pauses rotation for a while', async ({ page, open }) => {
  await page.clock.install()
  await open('/', 'en')
  // Simulate touch: pointerenter from touch must not "hold" the balloon.
  await page.getByRole('button', { name: 'Elephant', exact: true }).dispatchEvent('pointerenter', {
    pointerType: 'touch',
  })
  await page.getByRole('button', { name: 'Elephant', exact: true }).dispatchEvent('click')
  await expect(page.getByText(/Shares until you betray it once/)).toBeVisible()

  await page.clock.runFor(ROTATE_MS * 2) // still within the tap pause
  await expect(page.getByText(/Shares until you betray it once/)).toBeVisible()

  await page.clock.runFor(ROTATE_MS + 100) // pause (8 s) over → next tick advances
  await expect(page.getByText(/Shares first\. If you both made the same choice/)).toBeVisible()
})

test('reduced motion: no auto-rotation, still interactive', async ({ page, open }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.clock.install()
  await open('/', 'en')

  await page.clock.runFor(ROTATE_MS * 3)
  await expect(page.getByText('Shares every single time, no matter what.')).toBeVisible()

  await page.getByRole('button', { name: 'Scout', exact: true }).hover()
  await expect(page.getByText(/Tests you with Keep, Share, Share/)).toBeVisible()
})

test('balloon height stays the same while rotating', async ({ page, open }) => {
  await page.clock.install()
  await open('/', 'fr')
  const balloon = page.locator('#bubble-alwaysCooperate').locator('..')
  const first = (await balloon.boundingBox())!.height
  for (let i = 0; i < 6; i++) {
    await page.clock.runFor(ROTATE_MS)
    expect((await balloon.boundingBox())!.height).toBe(first)
  }
})
