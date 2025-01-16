/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, BrowserContext } from '@playwright/test'
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
        .exclude('.maplibregl-marker')

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

export const websiteURL = 'http://localhost:3000/'
