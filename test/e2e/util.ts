/* eslint-disable react-hooks/rules-of-hooks */

export { expect } from '@playwright/test'
import { test as base, BrowserContext } from '@playwright/test' // hier hoort eigenlijk expect nog bij te staan - die gaf error en heb ik nu apart als export
import AxeBuilder from '@axe-core/playwright'
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

export const sessionStorageFixture = (
  context: BrowserContext,
  sessionStorage: { [index: string]: string }
) =>
  context.addInitScript((storage) => {
    for (const [key, value] of Object.entries(storage)) {
      window.sessionStorage.setItem(key, value)
      console.log(key, value)
    }
  }, sessionStorage)

export const formStateFixture = (
  context: BrowserContext,
  formState: Partial<FormStoreState>
) => sessionStorageFixture(context, createSessionStorageFixture(formState))

test.use({
  locale: 'nl-NL',
  timezoneId: 'Europe/Amsterdam',
  geolocation: { latitude: 51.6045656, longitude: 5.5342026 },
})

export const websiteURL = 'http://localhost:3000/'
