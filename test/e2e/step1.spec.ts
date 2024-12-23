/* eslint-disable react-hooks/rules-of-hooks */
import { expect, test as base } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

type AxeFixture = {
  makeAxeBuilder: () => AxeBuilder
}

// Extend base test by providing "makeAxeBuilder"
//
// This new "test" can be used in multiple test files, and each of them will get
// a consistently configured AxeBuilder instance.
export const test = base.extend<AxeFixture>({
  makeAxeBuilder: async ({ page }, use, testInfo) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('#commonly-reused-element-with-known-issue')

    await use(makeAxeBuilder)
  },
})

test.use({
  locale: 'nl-NL',
  timezoneId: 'Europe/Amsterdam',
  geolocation: { latitude: 51.6045656, longitude: 5.5342026 },
})

const websiteURL = 'http://localhost:3000/'

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

parameters.slice(0, 1).forEach(async ({ name, testConfig, forcedColors }) => {
  test.describe(`${name}`, () => {
    // TODO: Make new context for each test config to avoid interference
    if (testConfig) {
      test.use(testConfig as any)
    }

    // TODO: Toggle forced colors mode
    // await page.emulateMedia({ forcedColors: forcedColors })

    test('has title', async ({ page }) => {
      await page.goto(websiteURL)

      // Expect a title "to contain" a substring.
      await expect(page).toHaveTitle(/Purmerend/i)
    })

    test('has heading', async ({ page }) => {
      await page.goto(websiteURL)

      const heading = page.getByRole('heading', {
        name: 'Beschrijf uw melding',
      })

      await expect(heading).toBeDefined()
    })

    test('Next link', async ({ page }) => {
      await page.goto(websiteURL)

      const link = page.getByRole('button', { name: 'Volgende' })

      await expect(link).toBeDefined()
    })

    test('Next page (too soon)', async ({ page }) => {
      await page.goto(websiteURL)

      const link = page.getByRole('button', { name: 'Volgende' })

      await link.click()

      await expect(link).toBeDefined()
    })

    test('Focus textbox', async ({ page }) => {
      await page.goto(websiteURL)

      const textbox = page.getByRole('textbox', { name: 'Waar gaat het om?' })

      await expect(textbox).toBeDefined()

      await textbox.focus()
    })

    test('Enter text', async ({ page }) => {
      await page.goto(websiteURL)

      const textbox = page.getByRole('textbox', { name: 'Waar gaat het om?' })

      await expect(textbox).toBeDefined()

      await textbox.focus()

      page.keyboard.insertText('lamp kapot')
    })

    test('Enter text (a11y)', async ({ makeAxeBuilder, page }) => {
      await page.goto(websiteURL)

      const accessibilityScanResults = await makeAxeBuilder().analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('Next page', async ({ page }) => {
      await page.goto(websiteURL)

      const link = page.getByRole('button', { name: 'Volgende' })

      await link.click()

      await expect(link).toBeDefined()
    })
  })
})
