/* eslint-disable react-hooks/rules-of-hooks */
import { expect, test as base, BrowserContext } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { describe } from 'vitest'
import { createSessionStorageFixture } from '@/store/form_store'
import { FormStoreState } from '@/types/stores'

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

const sessionStorageFixture = (
  context: BrowserContext,
  sessionStorage: { [index: string]: string }
) =>
  context.addInitScript((storage) => {
    for (const [key, value] of Object.entries(storage)) {
      window.sessionStorage.setItem(key, value)
      console.log(key, value)
    }
  }, sessionStorage)

const formStateFixture = (
  context: BrowserContext,
  formState: Partial<FormStoreState>
) => sessionStorageFixture(context, createSessionStorageFixture(formState))

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
        level: 1,
      })

      await expect(heading).toBeVisible()
    })

    test('Next link', async ({ page }) => {
      await page.goto(websiteURL)

      const link = page.getByRole('button', { name: 'Volgende' })

      await expect(link).toBeVisible()
    })

    test('Next page (too soon)', async ({ page }) => {
      await page.goto(websiteURL)

      const link = page.getByRole('button', { name: 'Volgende' })

      await link.click()

      await expect(link).toBeVisible()
    })

    test('Focus textbox', async ({ page }) => {
      await page.goto(websiteURL)

      const textbox = page.getByRole('textbox', { name: 'Waar gaat het om?' })

      await expect(textbox).toBeVisible()

      await textbox.focus()
    })

    test('Enter text', async ({ page }) => {
      await page.goto(websiteURL)

      const textbox = page.getByRole('textbox', { name: 'Waar gaat het om?' })

      await expect(textbox).toBeVisible()

      await textbox.focus()

      page.keyboard.insertText('lamp kapot')

      await textbox.blur()
    })

    test('Enter text (a11y)', async ({ makeAxeBuilder, page }) => {
      await page.goto(websiteURL)

      const accessibilityScanResults = await makeAxeBuilder().analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('Previously entered text', async ({ page, context }) => {
      formStateFixture(context, { description: 'lamp is kapot' })

      await page.goto(websiteURL)

      const textbox = page.getByRole('textbox', { name: 'Waar gaat het om?' })

      await expect(textbox).toBeVisible()

      await expect(textbox).toHaveValue('lamp is kapot')
    })

    test('Go to next step', async ({ page, context }) => {
      formStateFixture(context, { description: 'lamp' })

      await page.goto(websiteURL)

      // Submitting the form stores the form data, so it will be available
      // in tests of the next step.
      const button = page.getByRole('button', { name: 'Volgende' })

      await expect(button).toBeVisible()

      await button.click()
    })

    test('Next page', async ({ page }) => {
      await page.goto(websiteURL)

      const button = page.getByRole('button', { name: 'Volgende' })

      await button.click()

      await expect(button).toBeVisible()
    })

    test.describe('step 2', () => {
      const pageURL = 'http://localhost:3000/nl/incident/vulaan'
      test('has title', async ({ page, context }) => {
        formStateFixture(context, { description: 'lamp' })

        await page.goto(pageURL)

        // Expect a title "to contain" a substring with the step
        await expect(page).toHaveTitle(/Stap 2 van 4/i)

        // Expect a title "to contain" a substring.
        await expect(page).toHaveTitle(/Purmerend/i)
      })

      test('has heading', async ({ context, page }) => {
        formStateFixture(context, { description: 'lamp' })

        await page.goto(pageURL)

        const heading = page.getByRole('heading', {
          name: 'Locatie en vragen',
          level: 1,
        })

        await expect(heading).toBeVisible()
      })

      test('Focus combobox', async ({ context, page }) => {
        formStateFixture(context, { description: 'lamp' })

        await page.goto(pageURL)

        // const combobox = page.getByRole('combobox', { name: 'Adres' })
        const combobox = page.getByRole('combobox')

        await expect(combobox).toBeVisible()

        await combobox.focus()
      })
    })
  })
})
