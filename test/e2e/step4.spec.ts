import { expect } from '@playwright/test'
import { test, formStateFixture, websiteURL } from './util'
import { defaultStep4FormState } from '@/store/form_store'

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
      formStateFixture(context, defaultStep4FormState)
      await page.goto(pageURL)

      // Expect a title "to contain" a substring with the step
      await expect(page).toHaveTitle(/Stap 4 van 4/i)

      // Expect a title "to contain" a substring.
      await expect(page).toHaveTitle(/Purmerend/i)
    })

    test('has heading', async ({ makeAxeBuilder, page, context }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const heading = page.getByRole('heading', {
        name: 'Versturen',
        level: 1,
      })

      await expect(heading).toBeVisible()
    })

    // SUBMIT BUTTON TESTS //

    // Submit Button - Aanwezig + Axe page check
    test('has submit button', async ({ makeAxeBuilder, page, context }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const submitButton = page.getByRole('button', { name: 'Verstuur' })

      await expect(submitButton).toBeVisible()

      const accessibilityScanResults = await makeAxeBuilder().analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })

    // Submit Button - Click
    test('click submit button', async ({ page, context }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const submitButton = page.getByRole('button', { name: 'Verstuur' })

      await expect(submitButton).toBeVisible()

      await submitButton.click()

      await expect(submitButton).toBeVisible() //visueel(functioneel?) disabled wanneer net ingedrukt
    })

    // Submit Button - Focus
    test('focus submit button', async ({ makeAxeBuilder, page, context }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const submitButton = page.getByRole('button', { name: 'Verstuur' })

      await expect(submitButton).toBeVisible()

      await submitButton.focus()
      await expect(submitButton).toBeFocused()

      const accessibilityScanResults = await makeAxeBuilder().analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })
    // Submit Button - Hover + Axe
    test('hover submit button', async ({ makeAxeBuilder, page, context }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const submitButton = page.getByRole('button', { name: 'Verstuur' })

      await expect(submitButton).toBeVisible()

      await submitButton.hover()

      const accessibilityScanResults = await makeAxeBuilder().analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })

    // Submit Button - Press(enter)
    test('press submit button', async ({ page, context }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const submitButton = page.getByRole('button', { name: 'Verstuur' })

      await expect(submitButton).toBeVisible()

      await submitButton.focus()

      await submitButton.press('Enter')

      const heading = page.getByRole('heading', {
        name: 'Melding verzonden',
      })

      await expect(heading).toBeVisible()
    })

    // Submit Button - Navigates (to succespage)
    test('navigate submit button -> succespagina)', async ({
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)
      const submitButton = page.getByRole('button', { name: 'Verstuur' })

      const heading = page.getByRole('heading', {
        name: 'Melding verzonden',
      })

      await expect(submitButton).toBeVisible()

      await submitButton.click()

      await expect(heading).toBeVisible()
      await expect(heading).toHaveText('Melding verzonden')
    })

    // WIJZIG LINK TESTS //

    // Wijzig Link - Aanwezig
    // 1. wijzig uw melding
    test('has wijzig link - wijzig uw melding', async ({ page, context }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const wijzigLink = page.getByRole('link', { name: 'Wijzig uw melding' })

      await expect(wijzigLink).toBeVisible()
    })
    // 2. wijzig locatie en vragen
    test('has wijzig link - wijzig locatie en vragen', async ({
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const wijzigLink = page.getByRole('link', {
        name: 'Wijzig locatie en vragen',
      })

      await expect(wijzigLink).toBeVisible()
    })
    // 3. wijzig contactgegevens
    test('has wijzig link - wijzig contactgegevens', async ({
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const wijzigLink = page.getByRole('link', {
        name: 'Wijzig contactgegevens',
      })

      await expect(wijzigLink).toBeVisible()
    })

    // Wijzig Link - Click
    test('click wijzig link', async ({ page, context }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const wijzigLink = page.getByRole('link', { name: 'Wijzig uw melding' })

      await expect(wijzigLink).toBeVisible()

      await wijzigLink.click()
    })

    // Wijzig Link - Focus
    test('focus wijzig link', async ({ makeAxeBuilder, page, context }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const wijzigLink = page.getByRole('link', { name: 'Wijzig uw melding' })

      await expect(wijzigLink).toBeVisible()

      await wijzigLink.focus()
      await expect(wijzigLink).toBeFocused()

      const accessibilityScanResults = await makeAxeBuilder().analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })

    // Wijzig Link - Hover
    test('hover wijzig link', async ({ page, context }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const wijzigLink = page.getByRole('link', { name: 'Wijzig uw melding' })

      await expect(wijzigLink).toBeVisible()

      await wijzigLink.hover()
    })

    // Wijzig Link - Press(enter)
    test('press wijzig link', async ({ page, context }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const wijzigLink = page.getByRole('link', { name: 'Wijzig uw melding' })

      await expect(wijzigLink).toBeVisible()

      await wijzigLink.press('Enter')
    })

    // Wijzig Link - Navigate
    // 1. to step 1
    test('navigate wijzig link (wijzig uw melding -> step 1)', async ({
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const wijzigLink = page.getByRole('link', { name: 'Wijzig uw melding' })
      const heading = page.getByRole('heading', {
        name: 'Beschrijf uw melding',
      })

      await expect(wijzigLink).toBeVisible()

      await wijzigLink.click()

      await expect(heading).toBeVisible()
      await expect(heading).toHaveText('Beschrijf uw melding')
    })
    // 2. to step 2
    test('navigate wijzig link (wijzig locatie en vragen -> step 2)', async ({
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const wijzigLink = page.getByRole('link', {
        name: 'Wijzig locatie en vragen',
      })
      const heading = page.getByRole('heading', {
        name: 'Locatie en vragen',
      })

      await expect(wijzigLink).toBeVisible()

      await wijzigLink.click()

      await expect(heading).toBeVisible()
      await expect(heading).toHaveText('Locatie en vragen')
    })
    // 3. to step 3
    test('navigate wijzig link (wijzig contactgegevens -> step 3)', async ({
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const wijzigLink = page.getByRole('link', {
        name: 'Wijzig contactgegevens',
      })
      const heading = page.getByRole('heading', {
        name: 'Contactgegevens',
        level: 1,
      })

      await expect(wijzigLink).toBeVisible()

      await wijzigLink.click()

      await expect(heading).toBeVisible()
      await expect(heading).toHaveText('Contactgegevens')
    })

    // PREVIOUS STEP BUTTON TESTS //

    // Previous Step Buttons - Aanwezig
    // 1. top
    // 2. bottom
    test('has "previous page" buttons', async ({ page, context }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const previousButton = page.getByRole('button', {
        name: 'Vorige',
      })
      const topPreviousButton = previousButton.first()
      const bottomPreviousButton = previousButton.last()

      await expect(topPreviousButton).toBeVisible()
      await expect(bottomPreviousButton).toBeVisible()
    })

    // Previous Step Button - Click
    // 1. top
    test('click - "previous page" button(top)', async ({ page, context }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const previousButton = page.getByRole('button', {
        name: 'Vorige',
      })

      const topPreviousButton = previousButton.first()
      const bottomPreviousButton = previousButton.last()

      await expect(topPreviousButton).toBeVisible()
      await expect(bottomPreviousButton).toBeVisible()
      await topPreviousButton.click()

      const heading = page.getByRole('heading', {
        name: 'Contactgegevens',
        level: 1,
      })

      await expect(heading).toBeVisible()
    })
    // 2. bottom
    test('click - "previous page" button(bottom)', async ({
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const previousButton = page.getByRole('button', {
        name: 'Vorige',
      })

      const topPreviousButton = previousButton.first()
      const bottomPreviousButton = previousButton.last()

      await expect(topPreviousButton).toBeVisible()
      await expect(bottomPreviousButton).toBeVisible()
      await bottomPreviousButton.click()

      const heading = page.getByRole('heading', {
        name: 'Contactgegevens',
        level: 1,
      })

      await expect(heading).toBeVisible()
    })

    // Previous Step Buttons (top & bottom) - Focus
    // failed op axe (marker)
    test('focus - "previous page" buttons', async ({
      makeAxeBuilder,
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep4FormState)

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

      const accessibilityScanResults = await makeAxeBuilder().analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })

    // Previous Step Buttons (top &  bottom) - Hover
    test('hover - "previous page" buttons', async ({ page, context }) => {
      formStateFixture(context, defaultStep4FormState)

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

    // Previous Step Button - Press
    // 1. top - enter
    test('press(enter) - "previous page" button(top)', async ({
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const previousButton = page.getByRole('button', {
        name: 'Vorige',
      })

      const topPreviousButton = previousButton.first()
      const bottomPreviousButton = previousButton.last()

      await expect(topPreviousButton).toBeVisible()
      await expect(bottomPreviousButton).toBeVisible()
      await topPreviousButton.press('Enter')

      const heading = page.getByRole('heading', {
        name: 'Contactgegevens',
        level: 1,
      })

      await expect(heading).toBeVisible()
    })
    // 2. top - spacebar
    test('press(space) - "previous page" button(top)', async ({
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const previousButton = page.getByRole('button', {
        name: 'Vorige',
      })

      const topPreviousButton = previousButton.first()
      const bottomPreviousButton = previousButton.last()

      await expect(topPreviousButton).toBeVisible()
      await expect(bottomPreviousButton).toBeVisible()
      await topPreviousButton.press('Space')
      await expect(topPreviousButton).toBeVisible()
    })
    // 3. bottom - enter
    test('press(enter) - "previous page" button(bottom)', async ({
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const previousButton = page.getByRole('button', {
        name: 'Vorige',
      })

      const topPreviousButton = previousButton.first()
      const bottomPreviousButton = previousButton.last()

      await expect(topPreviousButton).toBeVisible()
      await expect(bottomPreviousButton).toBeVisible()
      await bottomPreviousButton.press('Enter')
      await expect(bottomPreviousButton).toBeVisible()
    })
    // 4. bottom - spacebar
    test('press(space) - "previous page" button(bottom)', async ({
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const previousButton = page.getByRole('button', {
        name: 'Vorige',
      })

      const topPreviousButton = previousButton.first()
      const bottomPreviousButton = previousButton.last()

      await expect(topPreviousButton).toBeVisible()
      await expect(bottomPreviousButton).toBeVisible()
      await bottomPreviousButton.press('Space')
      await expect(bottomPreviousButton).toBeVisible()
    })

    // Previous Step Button - Navigates (to prev. step)
    // 1. top
    test('navigate previous step button(top) (step 4 -> step 3)', async ({
      makeAxeBuilder,
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const previousButton = page.getByRole('button', {
        name: 'Vorige',
      })

      const topPreviousButton = previousButton.first()
      const bottomPreviousButton = previousButton.last()

      await expect(topPreviousButton).toBeVisible()
      await expect(bottomPreviousButton).toBeVisible()

      await topPreviousButton.click()

      const heading = page.getByRole('heading', {
        name: 'Contactgegevens',
        level: 1,
      })

      await expect(heading).toBeVisible()
      await expect(heading).toHaveText('Contactgegevens')
    })
    // 2. bottom
    test('navigate previous step button(bottom) (step 4 -> step 3)', async ({
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep4FormState)

      await page.goto(pageURL)

      const previousButton = page.getByRole('button', {
        name: 'Vorige',
      })

      const topPreviousButton = previousButton.first()
      const bottomPreviousButton = previousButton.last()

      await expect(bottomPreviousButton).toBeVisible()
      await expect(topPreviousButton).toBeVisible()

      await bottomPreviousButton.click()

      const heading = page.getByRole('heading', {
        name: 'Contactgegevens',
        level: 1,
      })

      await expect(heading).toBeVisible()
      await expect(heading).toHaveText('Contactgegevens')
    })

    // TODO: LOADER TEST //
    // deze faalt nu wanneer page te snel laadt
    // test('has loader', async ({ makeAxeBuilder, page, context }) => {
    //   formStateFixture(context, defaultStep4FormState)

    //   await page.goto(pageURL)

    //   const submitButton = page.getByRole('button', { name: 'Verstuur' })
    //   await expect(submitButton).toBeVisible()
    //   await submitButton.click()

    //   const loader = page.getByText('Laden...')
    //   await expect(loader).toBeVisible()

    //   const accessibilityScanResults = await makeAxeBuilder().analyze()
    //   expect(accessibilityScanResults.violations).toEqual([])
    // })
  })
})
