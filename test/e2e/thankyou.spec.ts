import { expect } from '@playwright/test'
import { test, websiteURL } from './util'
// wat voor soort tests zou ik wel op thankyou page kunnen doen? - contrast?

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

      // AxeBuilder is 1x nodig op de pagina (bijv. hier bij heading 1) + in ieder element dat verschillende states heeft
      const accessibilityScanResults = await makeAxeBuilder().analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    // BUTTON
    // Click
    test('Maak nog een melding button', async ({ page }) => {
      await page.goto(pageURL)

      const button = page.getByRole('button', { name: 'Maak nog een melding' })

      await button.click()

      await expect(button).toBeVisible()
    })
    // Hover
    test('Hover: Maak nog een melding button', async ({
      makeAxeBuilder,
      page,
    }) => {
      await page.goto(pageURL)

      const button = page.getByRole('button', { name: 'Maak nog een melding' })

      await button.hover()

      await expect(button).toBeVisible()
      // add Axe to check contrast
      const accessibilityScanResults = await makeAxeBuilder().analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })
    // Focus
    test('Focus: Maak nog een melding button', async ({
      makeAxeBuilder,
      page,
    }) => {
      await page.goto(pageURL)

      const button = page.getByRole('button', { name: 'Maak nog een melding' })

      await expect(button).toBeVisible()

      await button.focus()

      const focusedButton = button.and(page.locator('css=:focus'))

      await expect(focusedButton).toBeVisible()

      const accessibilityScanResults = await makeAxeBuilder().analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })
    // Press (WIP)
    test('Press: Maak nog een melding button', async ({ page }) => {
      await page.goto(pageURL)

      const button = page.getByRole('button', { name: 'Maak nog een melding' })

      await expect(button).toBeVisible()

      await button.press('Backspace')

      // const pressedButton = button.and(page.locator()

      // await expect(pressedButton).toBeVisible()
    })
  })
})
