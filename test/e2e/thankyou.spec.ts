import { expect, test, formStateFixture, websiteURL } from './util'
// is formState nodig bij de thankyou page? - form is nu opgestuurd toch?
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

test.describe('Na stap 4 - Bedankt voor uw melding', () => {
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
          name: 'Bedankt voor uw melding',
          level: 1,
        })

        await expect(heading).toBeVisible()
      })

      // test('Next page', async ({ page }) => {
      //   await page.goto(websiteURL)

      //   const button = page.getByRole('button', { name: 'Volgende' })

      //   await button.click()

      //   await expect(button).toBeVisible()
      // })
    })
  })
})
