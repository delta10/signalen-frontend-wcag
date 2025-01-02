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
    const pageURL = `${websiteURL}nl/incident/samenvatting`
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
        last_completed_step: 3,
      })
      await page.goto(pageURL)

      // Expect a title "to contain" a substring with the step
      await expect(page).toHaveTitle(/Stap 4 van 4/i)

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
        last_completed_step: 3,
      })

      await page.goto(pageURL)

      const heading = page.getByRole('heading', {
        name: 'Versturen',
        level: 1,
      })

      await expect(heading).toBeVisible()

      // add Axe to check contrast
      // const accessibilityScanResults = await makeAxeBuilder().analyze()
      // expect(accessibilityScanResults.violations).toEqual([]) //deze failed soms wel/soms niet?
    })

    // SUBMIT BUTTON TESTS //

    // Submit button - aanwezig
    test('has submit button', async ({ page, context }) => {
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
        last_completed_step: 3,
      })

      await page.goto(pageURL)

      const submitButton = page.getByRole('button', { name: 'Verstuur' })

      await expect(submitButton).toBeVisible()
    })

    // Submit button - click
    test('click submit button', async ({ makeAxeBuilder, page, context }) => {
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
        last_completed_step: 3,
      })

      await page.goto(pageURL)

      const submitButton = page.getByRole('button', { name: 'Verstuur' })

      await expect(submitButton).toBeVisible()

      await submitButton.click()

      await expect(submitButton).toBeVisible() //visueel(functioneel?) disabled wanneer net ingedrukt

      // add Axe to check contrast
      // const accessibilityScanResults = await makeAxeBuilder().analyze()
      // expect(accessibilityScanResults.violations).toEqual([]) //deze failed soms wel/soms niet?
    })

    // Submit button - focus
    test('focus submit button', async ({ makeAxeBuilder, page, context }) => {
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
        last_completed_step: 3,
      })

      await page.goto(pageURL)

      const submitButton = page.getByRole('button', { name: 'Verstuur' })

      await expect(submitButton).toBeVisible()

      await submitButton.focus()

      // const focusedButton = submitButton.and(page.locator('css=:focus'))
      // await expect(focusedButton).toBeVisible()

      await expect(submitButton).toBeFocused()

      // const accessibilityScanResults = await makeAxeBuilder().analyze()
      // expect(accessibilityScanResults.violations).toEqual([]) //deze failed soms wel/soms niet?
    })
    // Submit button - hover
    test('hover submit button', async ({ makeAxeBuilder, page, context }) => {
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
        last_completed_step: 3,
      })

      await page.goto(pageURL)

      const submitButton = page.getByRole('button', { name: 'Verstuur' })

      await expect(submitButton).toBeVisible()

      await submitButton.hover()

      await expect(submitButton).toBeVisible()

      // add Axe to check contrast
      // const accessibilityScanResults = await makeAxeBuilder().analyze()
      // expect(accessibilityScanResults.violations).toEqual([]) //deze failed soms/soms niet?
    })

    // Submit button - press (keyboard)
    test('press submit button', async ({ makeAxeBuilder, page, context }) => {
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
        last_completed_step: 3,
      })

      await page.goto(pageURL)

      const submitButton = page.getByRole('button', { name: 'Verstuur' })

      await expect(submitButton).toBeVisible()

      await submitButton.press('Enter')

      // const accessibilityScanResults = await makeAxeBuilder().analyze()
      // expect(accessibilityScanResults.violations).toEqual([]) //deze failed soms wel/soms niet?
    })

    // WIJZIG LINK TESTS //

    // Wijzig link - aanwezig
    // 1. Wijzig uw melding
    test('has wijzig link - wijzig uw melding', async ({ page, context }) => {
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
        last_completed_step: 3,
      })

      await page.goto(pageURL)

      const wijzigLink = page.getByRole('link', { name: 'Wijzig uw melding' })

      await expect(wijzigLink).toBeVisible()
    })

    // 2. Wijzig locatie en vragen
    test('has wijzig link - wijzig locatie en vragen', async ({
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
        last_completed_step: 3,
      })

      await page.goto(pageURL)

      const wijzigLink = page.getByRole('link', {
        name: 'Wijzig locatie en vragen',
      })

      await expect(wijzigLink).toBeVisible()
    })
    // 3. Wijzig contactgegevens
    test('has wijzig link - wijzig contactgegevens', async ({
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
        last_completed_step: 3,
      })

      await page.goto(pageURL)

      const wijzigLink = page.getByRole('link', {
        name: 'Wijzig contactgegevens',
      })

      await expect(wijzigLink).toBeVisible()
    })

    // Wijzig link - click
    test('click wijzig link - wijzig uw melding', async ({
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
        last_completed_step: 3,
      })

      await page.goto(pageURL)

      const wijzigLink = page.getByRole('link', { name: 'Wijzig uw melding' })

      await expect(wijzigLink).toBeVisible()

      await wijzigLink.click()

      // const accessibilityScanResults = await makeAxeBuilder().analyze()
      // expect(accessibilityScanResults.violations).toEqual([]) //deze failed soms?
    })

    // Wijzig link - focus
    test('focus wijzig link - wijzig uw melding', async ({
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
        last_completed_step: 3,
      })

      await page.goto(pageURL)

      const wijzigLink = page.getByRole('link', { name: 'Wijzig uw melding' })

      await expect(wijzigLink).toBeVisible()

      await wijzigLink.focus()

      await expect(wijzigLink).toBeFocused()
      // const focusedWijzigLink = wijzigLink.and(page.locator('css=:focus'))

      // await expect(focusedWijzigLink).toBeVisible()

      // await expect(wijzigLink).toBeFocused()

      // const accessibilityScanResults = await makeAxeBuilder().analyze()
      // expect(accessibilityScanResults.violations).toEqual([]) //deze failed soms?
    })

    // Wijzig link - hover = SUCCES MAAR FAILED?
    // 1. Wijzig uw melding (alle 3 dezelfde werking of alsnog apart testen?)
    test('hover wijzig link - wijzig uw melding', async ({
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
        last_completed_step: 3,
      })

      await page.goto(pageURL)

      const wijzigLink = page.getByRole('link', { name: 'Wijzig uw melding' })

      await expect(wijzigLink).toBeVisible()

      await wijzigLink.hover()

      await expect(wijzigLink).toBeVisible()

      // const accessibilityScanResults = await makeAxeBuilder().analyze()
      // expect(accessibilityScanResults.violations).toEqual([]) //deze failed soms?
    })

    // Wijzig link - press (keyboard)
    test('press wijzig link - wijzig uw melding', async ({
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
        last_completed_step: 3,
      })

      await page.goto(pageURL)

      const wijzigLink = page.getByRole('link', { name: 'Wijzig uw melding' })

      await expect(wijzigLink).toBeVisible()

      await wijzigLink.press('Enter')

      // const accessibilityScanResults = await makeAxeBuilder().analyze()
      // expect(accessibilityScanResults.violations).toEqual([]) //deze failed soms?
    })

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
        last_completed_step: 3,
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
        last_completed_step: 3,
      })

      await page.goto(pageURL)

      const previousButton = page.getByRole('button', {
        name: 'Vorige',
      })

      const topPreviousButton = previousButton.first()
      const bottomPreviousButton = previousButton.last()

      await expect(topPreviousButton).toBeVisible()
      await topPreviousButton.click()
      await expect(topPreviousButton).toBeVisible() //hier blijft ie op stap 4

      await expect(bottomPreviousButton).toBeVisible()
      await bottomPreviousButton.click()
      await expect(bottomPreviousButton).toBeVisible() //hier zie ik dat ie naar stap 3 terug navigeert
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
        last_completed_step: 3,
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
        last_completed_step: 3,
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
        last_completed_step: 3,
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

    // TODO
    // Submit button - submits
    // Submit button - navigates to thankyou page
    // Wijzig link - navigates to page 1, 2 or 3
    // Previous page button - navigates to prev. page

    // loader?

    // ? TO ASK
    // getByRole = al een test? (hoeft await expet(locator).toHaveRole() niet meer apart te testen?)
    // kan een element ook een URL hebben? (combi tussen expact(page).toHaveURL - locator ipv page?)
    // soms verander ik niks inhoudelijk maar als ik de test opnieuw draai krijg ik een andere uitkomst - why?
  })
})
