import { beforeEach, describe, expect, it, vi } from 'vitest'
import { axiosInstance } from '@/services/client/api-client'
import {
  getNearestHectometerPostByCoordinate,
  getSuggestedHectometerPosts,
  getSuggestedRoads,
} from './address'

vi.mock('@/services/client/api-client', () => ({ axiosInstance: vi.fn() }))
const get = vi.fn()
beforeEach(() => {
  get.mockReset()
  vi.mocked(axiosInstance).mockReturnValue({ get } as unknown as ReturnType<
    typeof axiosInstance
  >)
})

describe('PDOK hectometer requests', () => {
  it('requests street and road suggestions within the same configured rectangle', async () => {
    get.mockResolvedValue({ data: { response: { docs: [] } } })
    const { PdokAddressSuggestScope } = await import('@/types/config')
    const signal = new AbortController().signal
    await getSuggestedRoads(
      'N270',
      PdokAddressSuggestScope.Provincie,
      'Noord-Brabant',
      'https://api.pdok.nl/bzk/locatieserver',
      {
        bounds: [
          [4.17, 51.21],
          [6.08, 51.88],
        ],
      },
      signal
    )
    const url = new URL(get.mock.calls[0][0], 'https://example.test')
    expect(url.searchParams.get('q')).toBe('N270')
    expect(url.searchParams.getAll('fq')).toEqual([
      'provincienaam:(Noord-Brabant)',
      'type:weg',
      'centroide_ll:[51.21,4.17 TO 51.88,6.08]',
    ])
    expect(get.mock.calls[0][1]).toEqual({ signal })
  })

  it('requests 400 posts within the search rectangle using the N-road filter and exact A270 exception', async () => {
    get.mockResolvedValue({ data: { response: { docs: [] } } })
    await getSuggestedHectometerPosts(
      'A270',
      'https://api.pdok.nl/bzk/locatieserver',
      {
        bounds: [
          [4.17, 51.21],
          [6.08, 51.88],
        ],
        roadNumberPrefix: 'N',
        roadNumberExceptions: ['A270'],
      }
    )
    const url = new URL(get.mock.calls[0][0], 'https://example.test')
    expect(url.searchParams.get('rows')).toBe('400')
    expect(url.searchParams.get('q')).toBe('A270')
    expect(url.searchParams.getAll('fq')).toEqual([
      'bron:NWB',
      'type:hectometerpaal',
      'centroide_ll:[51.21,4.17 TO 51.88,6.08]',
      'wegnummer:(N* OR A270)',
    ])
  })

  it('ignores an invalid closer reverse result when finding the nearest post', async () => {
    get.mockResolvedValue({
      data: {
        response: {
          docs: [
            {
              id: 'invalid',
              afstand: 1,
              weergavenaam: 'Hectometerpaal A270-5.34547',
            },
            { id: 'far', afstand: 20, weergavenaam: 'Hectometerpaal N270-125' },
            {
              id: 'near',
              afstand: 10,
              weergavenaam: 'Hectometerpaal N270-123',
            },
          ],
        },
      },
    })
    const post = await getNearestHectometerPostByCoordinate(
      51.5,
      5.5,
      30,
      'https://api.pdok.nl/bzk/locatieserver'
    )
    expect(post?.id).toBe('near')
  })
})
