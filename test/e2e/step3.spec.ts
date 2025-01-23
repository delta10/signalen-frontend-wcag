import { expect } from '@playwright/test'
import { test, formStateFixture, websiteURL } from './util'
import { defaultStep3FormState } from '@/store/form_store'

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
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      // Expect a title "to contain" a substring with the step
      await expect(page).toHaveTitle(/Stap 3 van 4/i)

      // Expect a title "to contain" a substring.
      await expect(page).toHaveTitle(/Purmerend/i)
    })

    test('has heading', async ({ page, context }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const heading = page.getByRole('heading', {
        name: 'Contactgegevens',
        level: 1,
      })

      await expect(heading).toBeVisible()
    })

    // TEXTBOX TESTS //

    // Textbox - Aanwezig
    // 1. telefoonnummer
    test('has textbox(phone)', async ({ page, context }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const textbox = page.getByRole('textbox', {
        name: 'Wat is uw telefoonnummer? (niet verplicht)',
      })

      await expect(textbox).toBeVisible()
    })
    // 2. e-mailadres
    test('has textbox(mail)', async ({ page, context }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const textbox = page.getByRole('textbox', {
        name: 'Wat is uw e-mailadres? (niet verplicht)',
      })

      await expect(textbox).toBeVisible()
    })

    // Textbox - Focus
    // 1. telefoonnummer
    test('focus textbox(phone)', async ({ makeAxeBuilder, page, context }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const textbox = page.getByRole('textbox', {
        name: 'Wat is uw telefoonnummer? (niet verplicht)',
      })

      await expect(textbox).toBeVisible()

      await textbox.focus()

      await expect(textbox).toBeFocused()

      const accessibilityScanResults = await makeAxeBuilder().analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })
    // 2. e-mailadres
    test('focus textbox(mail)', async ({ makeAxeBuilder, page, context }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const textbox = page.getByRole('textbox', {
        name: 'Wat is uw e-mailadres? (niet verplicht)',
      })

      await expect(textbox).toBeVisible()

      await textbox.focus()

      await expect(textbox).toBeFocused()

      const accessibilityScanResults = await makeAxeBuilder().analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })

    // Textbox - Foutmelding
    // 1. telefoonnummer (verkeerde invoer + 'Volgende' button)
    test('textbox(phone) - error trigger', async ({ page, context }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const textbox = page.getByRole('textbox', {
        name: 'Wat is uw telefoonnummer? (niet verplicht)',
      })

      await expect(textbox).toBeVisible()

      await textbox.fill('test@test.nl')
      await expect(textbox).toHaveValue('test@test.nl')

      const nextButton = page.getByRole('button', { name: 'Volgende' })

      await nextButton.click()

      await expect(nextButton).toBeVisible()
    })
    // 2. e-mailadres (verkeerde invoer + 'Volgende' button)
    test('textbox mail - error trigger', async ({ page, context }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const textbox = page.getByRole('textbox', {
        name: 'Wat is uw e-mailadres? (niet verplicht)',
      })

      await expect(textbox).toBeVisible()

      await textbox.fill('0612345678')
      await expect(textbox).toHaveValue('0612345678')

      const nextButton = page.getByRole('button', { name: 'Volgende' })

      await nextButton.click()
      await expect(nextButton).toBeVisible()
    })
    // Textbox - Foutmelding (Axe)
    test('textbox - error trigger axe check', async ({
      makeAxeBuilder,
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const textbox = page.getByRole('textbox', {
        name: 'Wat is uw e-mailadres? (niet verplicht)',
      })

      await expect(textbox).toBeVisible()

      await textbox.fill('0612345678')

      const nextButton = page.getByRole('button', { name: 'Volgende' })

      await nextButton.click()

      const accessibilityScanResults = await makeAxeBuilder().analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })

    // Textbox - Tekst (invoer + heeft ingevoerde tekst)
    // 1. telefoonnummer
    test('text fill textbox phone', async ({ page, context }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const textbox = page.getByRole('textbox', {
        name: 'Wat is uw telefoonnummer? (niet verplicht)',
      })

      await expect(textbox).toBeVisible()

      await textbox.focus()
      await expect(textbox).toBeFocused()

      await textbox.fill('0612345678')
      await expect(textbox).toHaveValue('0612345678')
    })
    // 2. e-mailadres
    test('text fill textbox mail', async ({ page, context }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const textbox = page.getByRole('textbox', {
        name: 'Wat is uw e-mailadres? (niet verplicht)',
      })

      await expect(textbox).toBeVisible()

      await textbox.focus()

      await expect(textbox).toBeVisible()

      await textbox.fill('test@test.nl')

      await expect(textbox).toHaveValue('test@test.nl')
    })
    // Textbox - Tekst (Axe)
    test('text fill textbox axe', async ({ makeAxeBuilder, page, context }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const textbox = page.getByRole('textbox', {
        name: 'Wat is uw e-mailadres? (niet verplicht)',
      })

      await expect(textbox).toBeVisible()

      await textbox.focus()

      await textbox.fill('test@test.nl')

      const accessibilityScanResults = await makeAxeBuilder().analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })

    // CHECKBOX TESTS //

    // Checkbox - Aanwezig
    test('has checkbox', async ({ page, context }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const checkbox = page.getByRole('checkbox', {
        name: 'Ja, ik geef de gemeente Purmerend toestemming om mijn melding door te sturen naar andere organisaties als de melding niet voor de gemeente is bestemd.',
      })

      await expect(checkbox).toBeVisible()
    })
    // Checkbox - is(not)Checked + Axe
    test('check/uncheck checkbox', async ({
      makeAxeBuilder,
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const checkbox = page.getByRole('checkbox', {
        name: 'Ja, ik geef de gemeente Purmerend toestemming om mijn melding door te sturen naar andere organisaties als de melding niet voor de gemeente is bestemd.',
      })

      await expect(checkbox).toBeVisible()

      await checkbox.check()
      await expect(checkbox).toBeChecked()

      const accessibilityScanResultsChecked = await makeAxeBuilder().analyze()
      expect(accessibilityScanResultsChecked.violations).toEqual([])

      await checkbox.uncheck()
      await expect(checkbox).not.toBeChecked()

      const accessibilityScanResultsUnchecked = await makeAxeBuilder().analyze()
      expect(accessibilityScanResultsUnchecked.violations).toEqual([])
    })
    // Checkbox - Focus + Axe
    test('focus checkbox', async ({ makeAxeBuilder, page, context }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const checkbox = page.getByRole('checkbox', {
        name: 'Ja, ik geef de gemeente Purmerend toestemming om mijn melding door te sturen naar andere organisaties als de melding niet voor de gemeente is bestemd.',
      })

      await expect(checkbox).toBeVisible()

      await checkbox.focus()
      await expect(checkbox).toBeFocused()

      const accessibilityScanResults = await makeAxeBuilder().analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })

    // Checkbox - Hover + Axe
    test('hover checkbox', async ({ makeAxeBuilder, page, context }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const checkbox = page.getByRole('checkbox', {
        name: 'Ja, ik geef de gemeente Purmerend toestemming om mijn melding door te sturen naar andere organisaties als de melding niet voor de gemeente is bestemd.',
      })

      await expect(checkbox).toBeVisible()
      await checkbox.hover()

      const accessibilityScanResults = await makeAxeBuilder().analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })

    // Checkbox - Click
    test('click checkbox', async ({ page, context }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const checkbox = page.getByRole('checkbox', {
        name: 'Ja, ik geef de gemeente Purmerend toestemming om mijn melding door te sturen naar andere organisaties als de melding niet voor de gemeente is bestemd.',
      })

      await expect(checkbox).toBeVisible()
      await checkbox.click()
      await expect(checkbox).toBeChecked()
    })
    // Checkbox - Press + Axe
    test('press checkbox', async ({ makeAxeBuilder, page, context }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const checkbox = page.getByRole('checkbox', {
        name: 'Ja, ik geef de gemeente Purmerend toestemming om mijn melding door te sturen naar andere organisaties als de melding niet voor de gemeente is bestemd.',
      })

      await expect(checkbox).toBeVisible()
      await checkbox.focus()
      await expect(checkbox).toBeFocused()

      await checkbox.press('Space')
      await expect(checkbox).toBeChecked()

      const accessibilityScanResults = await makeAxeBuilder().analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })

    // PREVIOUS STEP BUTTON TESTS //

    // Previous Step Button - Aanwezig
    // 1. top
    // 2. bottom
    test('has "previous page" buttons (top & bottom)', async ({
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep3FormState)

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
      formStateFixture(context, defaultStep3FormState)

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
        name: 'Locatie en vragen',
      })

      await expect(heading).toBeVisible()
    })
    // 2. bottom
    test('click - "previous page" button(bottom)', async ({
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep3FormState)

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
        name: 'Locatie en vragen',
      })

      await expect(heading).toBeVisible()
    })

    // Previous Step Buttons (top & bottom) - Focus + Axe
    test('focus - "previous page" buttons', async ({
      makeAxeBuilder,
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep3FormState)

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

    // Previous Step Buttons (top & bottom) - Hover + Axe
    test('hover - "previous page" buttons', async ({
      makeAxeBuilder,
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep3FormState)

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

      const accessibilityScanResults = await makeAxeBuilder().analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })

    // Previous Step Button - Press
    // 1. top - enter
    test('press(enter) - "previous page" button(top)', async ({
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep3FormState)

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
        name: 'Locatie en vragen',
      })

      await expect(heading).toBeVisible()
    })
    // 2. top - spacebar
    test('press(space) - "previous page" button(top)', async ({
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const previousButton = page.getByRole('button', {
        name: 'Vorige',
      })

      const topPreviousButton = previousButton.first()
      const bottomPreviousButton = previousButton.last()

      await expect(topPreviousButton).toBeVisible()
      await expect(bottomPreviousButton).toBeVisible()
      await topPreviousButton.press('Space')

      const heading = page.getByRole('heading', {
        name: 'Locatie en vragen',
      })

      await expect(heading).toBeVisible()
    })
    // 3. bottom - enter
    test('press(enter) - "previous page" button(bottom)', async ({
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const previousButton = page.getByRole('button', {
        name: 'Vorige',
      })

      const topPreviousButton = previousButton.first()
      const bottomPreviousButton = previousButton.last()

      await expect(topPreviousButton).toBeVisible()
      await expect(bottomPreviousButton).toBeVisible()
      await bottomPreviousButton.press('Enter')

      const heading = page.getByRole('heading', {
        name: 'Locatie en vragen',
      })

      await expect(heading).toBeVisible()
    })
    // 4. bottom - spacebar
    test('press(space) - "previous page" button(bottom)', async ({
      page,
      context,
    }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const previousButton = page.getByRole('button', {
        name: 'Vorige',
      })

      const topPreviousButton = previousButton.first()
      const bottomPreviousButton = previousButton.last()

      await expect(topPreviousButton).toBeVisible()
      await expect(bottomPreviousButton).toBeVisible()
      await bottomPreviousButton.press('Space')

      const heading = page.getByRole('heading', {
        name: 'Locatie en vragen',
      })

      await expect(heading).toBeVisible()
    })

    // NEXT STEP BUTTON TESTS //

    // Next Step Button - Aanwezig
    test('has next button', async ({ page, context }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const nextButton = page.getByRole('button', { name: 'Volgende' })

      await expect(nextButton).toBeVisible()
    })

    // Next Step Button - Click
    test('click next button', async ({ page, context }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const nextButton = page.getByRole('button', { name: 'Volgende' })

      await expect(nextButton).toBeVisible()
      await nextButton.click()

      const heading = page.getByRole('heading', {
        name: 'Versturen',
      })

      await expect(heading).toBeVisible()
    })

    // Next Step Button - Focus + Axe
    test('focus next button', async ({ makeAxeBuilder, page, context }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const nextButton = page.getByRole('button', { name: 'Volgende' })

      await expect(nextButton).toBeVisible()

      await nextButton.focus()
      await expect(nextButton).toBeFocused()

      const accessibilityScanResults = await makeAxeBuilder().analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })
    // Next Step Button - Hover + Axe
    test('hover next button', async ({ makeAxeBuilder, page, context }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const nextButton = page.getByRole('button', { name: 'Volgende' })

      await expect(nextButton).toBeVisible()

      await nextButton.hover()
      await expect(nextButton).toBeVisible()

      const accessibilityScanResults = await makeAxeBuilder().analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })

    // Next Step Button - Press
    test('press(enter) next button', async ({ page, context }) => {
      formStateFixture(context, defaultStep3FormState)

      await page.goto(pageURL)

      const nextButton = page.getByRole('button', { name: 'Volgende' })

      await expect(nextButton).toBeVisible()

      await nextButton.press('Enter')

      const heading = page.getByRole('heading', {
        name: 'Versturen',
      })

      await expect(heading).toBeVisible()
    })
  })
})
