import { expect } from '@playwright/test'
import { test, websiteURL } from './util'

test.use({
  locale: 'nl-NL',
  timezoneId: 'Europe/Amsterdam',
  geolocation: { latitude: 51.6045656, longitude: 5.5342026 },
})

interface MyTextConfig {
  name: string
  testConfig: { colorScheme?: string }
  forcedColors?: boolean
}
const parameters: MyTextConfig[] = [
  {
    name: 'Light mode',
    testConfig: { colorScheme: 'light' },
    forcedColors: false,
  },
  // { name: 'Dark mode', testConfig: { colorSchema: 'dark' } },
  // { name: 'Forced colors', forcedColors: true },
]

parameters.forEach(async ({ name, testConfig, forcedColors }) => {
  test.describe(`${name}`, () => {
    const pageURL = `${websiteURL}nl/incident/bedankt` // zorg dat je de juiste URL aanvulling invult per pagina
    if (testConfig) {
      test.use(testConfig as any)
    }

    test('has title', async ({ page }) => {
      await page.goto(pageURL)

      // Expect a title "to contain" a substring with the step
      await expect(page).toHaveTitle(/Melding verzonden/i)

      // Expect a title "to contain" a substring.
      await expect(page).toHaveTitle(/Purmerend/i)
    })

    test('has heading', async ({ makeAxeBuilder, page }) => {
      await page.goto(pageURL)

      const heading = page.getByRole('heading', {
        name: 'Melding verzonden',
        level: 1,
      })

      await expect(heading).toBeVisible()
      await expect(heading).toHaveText('Melding verzonden')

      const accessibilityScanResults = await makeAxeBuilder().analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })

    // BUTTON TESTS //
    // Button - Aanwezig
    test('has button', async ({ page }) => {
      await page.goto(pageURL)

      const button = page.getByRole('button', { name: 'Maak nog een melding' })

      await expect(button).toBeVisible()
    })
    // Button - Click
    test('click button', async ({ makeAxeBuilder, page }) => {
      await page.goto(pageURL)

      const button = page.getByRole('button', { name: 'Maak nog een melding' })

      await expect(button).toBeVisible()

      await button.click()

      const heading = page.getByRole('heading', {
        name: 'Beschrijf uw melding',
      })

      await expect(heading).toBeVisible()
    })
    // Button - Focus
    test('focus button', async ({ makeAxeBuilder, page }) => {
      await page.goto(pageURL)

      const button = page.getByRole('button', { name: 'Maak nog een melding' })

      await expect(button).toBeVisible()

      await button.focus()
      await expect(button).toBeFocused()

      const focusedButton = button.and(page.locator('css=:focus'))

      await expect(focusedButton).toBeVisible()

      const accessibilityScanResults = await makeAxeBuilder().analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })
    // Button - Hover
    test('hover button', async ({ makeAxeBuilder, page }) => {
      await page.goto(pageURL)

      const button = page.getByRole('button', { name: 'Maak nog een melding' })
      const hoveredButton = button.and(page.locator('css=:hover'))

      await expect(button).toBeVisible()
      await button.hover()

      await expect(hoveredButton).toBeVisible()

      const accessibilityScanResults = await makeAxeBuilder().analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })
    // Button - Press
    test('press button', async ({ page }) => {
      await page.goto(pageURL)

      const button = page.getByRole('button', { name: 'Maak nog een melding' })

      const heading = page.getByRole('heading', {
        name: 'Beschrijf uw melding',
      })

      await expect(button).toBeVisible()

      await button.focus()
      await button.press('Space')

      await expect(heading).toBeVisible()
      await expect(heading).toHaveText('Beschrijf uw melding')
    })
  })
})
