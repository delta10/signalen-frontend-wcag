import { expect, afterEach, vitest } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

window.URL.createObjectURL = vitest.fn()

afterEach(() => {
  cleanup()
})
