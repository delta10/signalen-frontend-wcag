import { expect } from '@playwright/test'
import {
  test,
  formStateFixture,
  websiteURL,
  sessionStorageFixture,
} from './util'

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
]

parameters.forEach(async ({ name, testConfig, forcedColors }) => {
  test.describe(`${name}`, () => {
    const pageURL = `${websiteURL}nl/incident/samenvatting` // zorg dat je de juiste URL aanvulling invult per pagina
    if (testConfig) {
      test.use(testConfig as any)
    }

    test('has title', async ({ page }) => {
      await page.goto(pageURL)

      // Expect a title "to contain" a substring with the step
      await expect(page).toHaveTitle(/Stap 4 van 4/i)

      // Expect a title "to contain" a substring.
      await expect(page).toHaveTitle(/Purmerend/i)
    })

    test('has heading', async ({ context, page }) => {
      formStateFixture(context, { description: 'lamp' })
      await page.goto(pageURL)

      const heading = page.getByRole('heading', {
        name: 'Versturen',
        level: 1,
      })

      await expect(heading).not.toBeVisible() //werkt wel met "not" maar dat mot natuurlijk not.
    })

    // Submit button
    // Next page (too soon)
    // Wijzig link
    // Previous page
    //
  })
})
