import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { axiosInstance } from '@/services/client/api-client'
import { getCategoryForDescription } from '@/services/classification'

vi.mock('@/services/client/api-client', () => ({
  axiosInstance: vi.fn(),
}))

const mockedAxiosInstance = vi.mocked(axiosInstance)
const post = vi.fn()

const createResponse = (mainCertainty: number, subCertainty: number) => ({
  data: {
    hoofdrubriek: [
      ['/terms/categories/openbaar-groen-en-water'],
      [mainCertainty],
    ],
    subrubriek: [
      ['/terms/categories/openbaar-groen-en-water/sub_categories/beschoeiing'],
      [subCertainty],
    ],
  },
})

describe('getCategoryForDescription', () => {
  beforeEach(() => {
    post.mockReset()
    mockedAxiosInstance.mockReturnValue({ post } as never)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('throws when baseUrl is missing', async () => {
    await expect(
      getCategoryForDescription('description', undefined)
    ).rejects.toThrow('Base URL is required to fetch category prediction.')
  })

  test('returns overig values when both certainties are below the threshold', async () => {
    post.mockResolvedValue(createResponse(0.4, 0.4))

    await expect(
      getCategoryForDescription('description', 'https://api.example.com')
    ).resolves.toEqual({
      main: 'overig',
      sub: 'overig',
    })
  })

  test('uses the fallback sub slug when main certainty is exactly on the threshold', async () => {
    post.mockResolvedValue(createResponse(0.41, 0.4))

    await expect(
      getCategoryForDescription('description', 'https://api.example.com')
    ).resolves.toEqual({
      main: 'openbaar-groen-en-water',
      sub: 'overig-openbaar-groen-en-water',
    })
  })

  test('uses the predicted sub when both certainties are exactly on the threshold', async () => {
    post.mockResolvedValue(createResponse(0.41, 0.41))

    await expect(
      getCategoryForDescription('description', 'https://api.example.com')
    ).resolves.toEqual({
      main: 'openbaar-groen-en-water',
      sub: 'beschoeiing',
    })
  })

  test('keeps both values as overig when only the sub certainty reaches the threshold', async () => {
    post.mockResolvedValue(createResponse(0.4, 0.41))

    await expect(
      getCategoryForDescription('description', 'https://api.example.com')
    ).resolves.toEqual({
      main: 'overig',
      sub: 'overig',
    })
  })

  test('logs and returns the fallback values when the API request fails', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)
    const error = new Error('Network error')

    post.mockRejectedValue(error)

    await expect(
      getCategoryForDescription('description', 'https://api.example.com')
    ).resolves.toEqual({
      main: 'overig',
      sub: 'overig',
    })

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Could not fetch the classification response',
      error
    )
  })
})
