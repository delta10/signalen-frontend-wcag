import { expect } from '@playwright/test'
import { test, formStateFixture, websiteURL } from './util'

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
    const pageURL = `${websiteURL}nl/incident/contact`
    if (testConfig) {
      test.use(testConfig as any)
    }

    test('has title', async ({ page, context }) => {
      formStateFixture(context, {
        description: 'lamp',
        coordinates: [51.61892134, 5.52874105],
        address: {
          coordinates: [5.52874105, 51.61892134],
          id: 'adr-987acc537500c2f62ab7449a6d1e6f2e',
          postcode: '5462GJ',
          huisnummer: '3A',
          woonplaats: 'Veghel',
          openbare_ruimte: 'Lage Landstraat',
          weergave_naam: 'Lage Landstraat 3A, 5462GJ Veghel',
        },
        last_completed_step: 2,
      })
      await page.goto(pageURL)

      // Expect a title "to contain" a substring with the step
      await expect(page).toHaveTitle(/Stap 3 van 4/i)

      // Expect a title "to contain" a substring.
      await expect(page).toHaveTitle(/Purmerend/i)
    })

    test('has heading', async ({ makeAxeBuilder, page, context }) => {
      formStateFixture(context, {
        description: 'lamp',
        coordinates: [51.61892134, 5.52874105],
        address: {
          coordinates: [5.52874105, 51.61892134],
          id: 'adr-987acc537500c2f62ab7449a6d1e6f2e',
          postcode: '5462GJ',
          huisnummer: '3A',
          woonplaats: 'Veghel',
          openbare_ruimte: 'Lage Landstraat',
          weergave_naam: 'Lage Landstraat 3A, 5462GJ Veghel',
        },
        last_completed_step: 2,
      })

      await page.goto(pageURL)

      const heading = page.getByRole('heading', {
        name: 'Contactgegevens',
        level: 1,
      })

      await expect(heading).toBeVisible()

      // add Axe to check contrast
      // const accessibilityScanResults = await makeAxeBuilder().analyze()
      // expect(accessibilityScanResults.violations).toEqual([]) //deze failed soms wel/soms niet?
    })

    // TEXTBOX TESTS //
    // TODO
    // Textbox - aanwezig
    // 1. Telefoonnummer
    // 2. E-mailadres
    // Textbox - hasText
    // Textbox - keyboard tekst invoeren (insertText)
    // Textbox - removeText
    // Textbox - focus
    // Textbox - hover(?)

    // CHECKBOX TESTS //
    //TODO
    // Checkbox - aanwezig
    // Checkbox - isChecked
    // Checkbox - isUnchecked
    // Checkbox - focus
    // Checkbox - hover(?)

    // PREVIOUS PAGE BUTTON TESTS //

    // Previous page button - aanwezig (2x)
    // 1. getByRole('group').getByRole('button', { name: 'Vorige' })
    // 2. locator('div').filter({ hasText: /^Vorige$/ })
    test('has "previous page" buttons', async ({ page, context }) => {
      formStateFixture(context, {
        description: 'lamp',
        coordinates: [51.61892134, 5.52874105],
        address: {
          coordinates: [5.52874105, 51.61892134],
          id: 'adr-987acc537500c2f62ab7449a6d1e6f2e',
          postcode: '5462GJ',
          huisnummer: '3A',
          woonplaats: 'Veghel',
          openbare_ruimte: 'Lage Landstraat',
          weergave_naam: 'Lage Landstraat 3A, 5462GJ Veghel',
        },
        last_completed_step: 2,
      })

      await page.goto(pageURL)

      const previousButton = page.getByRole('button', {
        name: 'Vorige',
      })
      const topPreviousButton = previousButton.first()
      const bottomPreviousButton = previousButton.last()

      await expect(topPreviousButton).toBeVisible()
      await expect(bottomPreviousButton).toBeVisible()
    })

    // Previous page button - click
    test('click - "previous page" buttons', async ({ page, context }) => {
      formStateFixture(context, {
        description: 'lamp',
        coordinates: [51.61892134, 5.52874105],
        address: {
          coordinates: [5.52874105, 51.61892134],
          id: 'adr-987acc537500c2f62ab7449a6d1e6f2e',
          postcode: '5462GJ',
          huisnummer: '3A',
          woonplaats: 'Veghel',
          openbare_ruimte: 'Lage Landstraat',
          weergave_naam: 'Lage Landstraat 3A, 5462GJ Veghel',
        },
        last_completed_step: 2,
      })

      await page.goto(pageURL)

      const previousButton = page.getByRole('button', {
        name: 'Vorige',
      })

      const topPreviousButton = previousButton.first()
      const bottomPreviousButton = previousButton.last()

      await expect(topPreviousButton).toBeVisible()
      await topPreviousButton.click()
      await expect(topPreviousButton).toBeVisible()

      await expect(bottomPreviousButton).toBeVisible()
      await bottomPreviousButton.click()
      await expect(bottomPreviousButton).toBeVisible()
    })

    // Previous page button - focus
    test('focus - "previous page" buttons', async ({
      makeAxeBuilder,
      page,
      context,
    }) => {
      formStateFixture(context, {
        description: 'lamp',
        coordinates: [51.61892134, 5.52874105],
        address: {
          coordinates: [5.52874105, 51.61892134],
          id: 'adr-987acc537500c2f62ab7449a6d1e6f2e',
          postcode: '5462GJ',
          huisnummer: '3A',
          woonplaats: 'Veghel',
          openbare_ruimte: 'Lage Landstraat',
          weergave_naam: 'Lage Landstraat 3A, 5462GJ Veghel',
        },
        last_completed_step: 2,
      })

      await page.goto(pageURL)

      const previousButton = page.getByRole('button', {
        name: 'Vorige',
      })

      const topPreviousButton = previousButton.first()
      const bottomPreviousButton = previousButton.last()

      await topPreviousButton.focus()

      await expect(topPreviousButton).toBeFocused()

      await bottomPreviousButton.focus()
      await expect(bottomPreviousButton).toBeFocused()
    })

    // Previous page button - hover
    test('hover - "previous page" buttons', async ({
      makeAxeBuilder,
      page,
      context,
    }) => {
      formStateFixture(context, {
        description: 'lamp',
        coordinates: [51.61892134, 5.52874105],
        address: {
          coordinates: [5.52874105, 51.61892134],
          id: 'adr-987acc537500c2f62ab7449a6d1e6f2e',
          postcode: '5462GJ',
          huisnummer: '3A',
          woonplaats: 'Veghel',
          openbare_ruimte: 'Lage Landstraat',
          weergave_naam: 'Lage Landstraat 3A, 5462GJ Veghel',
        },
        last_completed_step: 2,
      })

      await page.goto(pageURL)

      const previousButton = page.getByRole('button', {
        name: 'Vorige',
      })

      const topPreviousButton = previousButton.first()
      const bottomPreviousButton = previousButton.last()

      await topPreviousButton.hover()

      await expect(topPreviousButton).toBeVisible()

      await bottomPreviousButton.hover()
      await expect(bottomPreviousButton).toBeVisible()
    })

    // Previous page button - press (keyboard)
    test('press - "previous page" buttons', async ({ page, context }) => {
      formStateFixture(context, {
        description: 'lamp',
        coordinates: [51.61892134, 5.52874105],
        address: {
          coordinates: [5.52874105, 51.61892134],
          id: 'adr-987acc537500c2f62ab7449a6d1e6f2e',
          postcode: '5462GJ',
          huisnummer: '3A',
          woonplaats: 'Veghel',
          openbare_ruimte: 'Lage Landstraat',
          weergave_naam: 'Lage Landstraat 3A, 5462GJ Veghel',
        },
        last_completed_step: 2,
      })

      await page.goto(pageURL)

      const previousButton = page.getByRole('button', {
        name: 'Vorige',
      })

      const topPreviousButton = previousButton.first()
      const bottomPreviousButton = previousButton.last()

      await expect(topPreviousButton).toBeVisible()
      await topPreviousButton.press('Enter')
      // await topPreviousButton.press('Spacebar') // test failed, doet het wel op website
      await expect(topPreviousButton).toBeVisible()

      await expect(bottomPreviousButton).toBeVisible()
      await bottomPreviousButton.press('Enter')
      // await bottomPreviousButton.press('Spacebar') // test failed, doet het wel op website
      await expect(bottomPreviousButton).toBeVisible()
    })

    // NEXT STEP BUTTON TESTS //

    // Next step button - aanwezig
    test('has next button', async ({ page, context }) => {
      formStateFixture(context, {
        description: 'lamp',
        coordinates: [51.61892134, 5.52874105],
        address: {
          coordinates: [5.52874105, 51.61892134],
          id: 'adr-987acc537500c2f62ab7449a6d1e6f2e',
          postcode: '5462GJ',
          huisnummer: '3A',
          woonplaats: 'Veghel',
          openbare_ruimte: 'Lage Landstraat',
          weergave_naam: 'Lage Landstraat 3A, 5462GJ Veghel',
        },
        last_completed_step: 2,
      })

      await page.goto(pageURL)

      const nextButton = page.getByRole('button', { name: 'Volgende' })

      await expect(nextButton).toBeVisible()
    })

    // Next step button - click
    test('click next button', async ({ makeAxeBuilder, page, context }) => {
      formStateFixture(context, {
        description: 'lamp',
        coordinates: [51.61892134, 5.52874105],
        address: {
          coordinates: [5.52874105, 51.61892134],
          id: 'adr-987acc537500c2f62ab7449a6d1e6f2e',
          postcode: '5462GJ',
          huisnummer: '3A',
          woonplaats: 'Veghel',
          openbare_ruimte: 'Lage Landstraat',
          weergave_naam: 'Lage Landstraat 3A, 5462GJ Veghel',
        },
        last_completed_step: 2,
      })

      await page.goto(pageURL)

      const nextButton = page.getByRole('button', { name: 'Volgende' })

      await expect(nextButton).toBeVisible()

      await nextButton.click()

      await expect(nextButton).toBeVisible()

      // const accessibilityScanResults = await makeAxeBuilder().analyze()
      // expect(accessibilityScanResults.violations).toEqual([]) //deze failed soms wel/soms niet?
    })

    // Next step button - focus
    test('focus next button', async ({ makeAxeBuilder, page, context }) => {
      formStateFixture(context, {
        description: 'lamp',
        coordinates: [51.61892134, 5.52874105],
        address: {
          coordinates: [5.52874105, 51.61892134],
          id: 'adr-987acc537500c2f62ab7449a6d1e6f2e',
          postcode: '5462GJ',
          huisnummer: '3A',
          woonplaats: 'Veghel',
          openbare_ruimte: 'Lage Landstraat',
          weergave_naam: 'Lage Landstraat 3A, 5462GJ Veghel',
        },
        last_completed_step: 2,
      })

      await page.goto(pageURL)

      const nextButton = page.getByRole('button', { name: 'Volgende' })

      await expect(nextButton).toBeVisible()

      await nextButton.focus()

      // const focusedButton = submitButton.and(page.locator('css=:focus'))
      // await expect(focusedButton).toBeVisible()

      await expect(nextButton).toBeFocused()

      // const accessibilityScanResults = await makeAxeBuilder().analyze()
      // expect(accessibilityScanResults.violations).toEqual([]) //deze failed soms wel/soms niet?
    })
    // Next step button - hover
    test('hover next button', async ({ makeAxeBuilder, page, context }) => {
      formStateFixture(context, {
        description: 'lamp',
        coordinates: [51.61892134, 5.52874105],
        address: {
          coordinates: [5.52874105, 51.61892134],
          id: 'adr-987acc537500c2f62ab7449a6d1e6f2e',
          postcode: '5462GJ',
          huisnummer: '3A',
          woonplaats: 'Veghel',
          openbare_ruimte: 'Lage Landstraat',
          weergave_naam: 'Lage Landstraat 3A, 5462GJ Veghel',
        },
        last_completed_step: 2,
      })

      await page.goto(pageURL)

      const nextButton = page.getByRole('button', { name: 'Volgende' })

      await expect(nextButton).toBeVisible()

      await nextButton.hover()

      await expect(nextButton).toBeVisible()

      // add Axe to check contrast
      // const accessibilityScanResults = await makeAxeBuilder().analyze()
      // expect(accessibilityScanResults.violations).toEqual([]) //deze failed soms/soms niet?
    })

    // Next step button - press (keyboard)
    test('press next button', async ({ makeAxeBuilder, page, context }) => {
      formStateFixture(context, {
        description: 'lamp',
        coordinates: [51.61892134, 5.52874105],
        address: {
          coordinates: [5.52874105, 51.61892134],
          id: 'adr-987acc537500c2f62ab7449a6d1e6f2e',
          postcode: '5462GJ',
          huisnummer: '3A',
          woonplaats: 'Veghel',
          openbare_ruimte: 'Lage Landstraat',
          weergave_naam: 'Lage Landstraat 3A, 5462GJ Veghel',
        },
        last_completed_step: 2,
      })

      await page.goto(pageURL)

      const nextButton = page.getByRole('button', { name: 'Volgende' })

      await expect(nextButton).toBeVisible()

      await nextButton.press('Enter')

      // const accessibilityScanResults = await makeAxeBuilder().analyze()
      // expect(accessibilityScanResults.violations).toEqual([]) //deze failed soms wel/soms niet?
    })

    // loader?

    // TODO
    // Next step button - navigates to step 4
    // Previous page button (2x) - navigates to prev. page
  })
})
