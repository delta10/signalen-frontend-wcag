import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ConfigProvider } from '@/contexts/ConfigContext'
import { RootMock } from '../../../__mocks__/RootMock'
import {
  createFormState,
  isValidForStep3,
  useFormStore,
} from '@/store/form_store'
import {
  getSuggestedHectometerPosts,
  getSuggestedRoads,
} from '@/services/location/address'
import { isCoordinateOutsideRestrictedArea } from '@/lib/utils/restrictedAreaUtils'
import type { AppConfig } from '@/types/config'
import config from '../../../config.json'
import { AddressCombobox, SearchType } from './AddressCombobox'

vi.mock('@/services/location/address', () => ({
  getSuggestedAddresses: vi.fn(),
  getSuggestedHectometerPosts: vi.fn(),
  getSuggestedRoads: vi.fn(),
}))

vi.mock('@/lib/utils/restrictedAreaUtils', () => ({
  isCoordinateOutsideRestrictedArea: vi.fn(),
}))
afterEach(() => vi.unstubAllGlobals())

const post = {
  id: 'hmp-inside',
  identificatie: 'inside',
  weergavenaam: 'Hectometerpaal A270-65',
  centroide_ll: 'POINT(5.54162224 51.45663389)',
  wegnummer: 'A270',
  hectometernummer: '65',
}

beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(getSuggestedRoads).mockRejectedValue(new Error('No road response'))
  vi.mocked(isCoordinateOutsideRestrictedArea).mockResolvedValue(false)
  useFormStore.setState({
    formState: createFormState({
      description: 'Broken sign',
      selectedFeatures: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [5.5, 51.5] },
          properties: {},
          description: 'Old sign',
          label: 'Old sign',
          id: 1,
          internal_id: 1,
        },
      ],
      coordinates: [51.5, 5.5],
      address: {
        id: 'old',
        coordinates: [5.5, 51.5],
        weergave_naam: 'Old location',
        huisnummer: '',
        woonplaats: '',
        openbare_ruimte: '',
      },
    }),
  })
  vi.mocked(getSuggestedHectometerPosts).mockResolvedValue({
    response: {
      numFound: 2,
      start: 0,
      maxScore: 1,
      numFoundExact: true,
      docs: [
        post,
        {
          ...post,
          id: 'hmp-invalid',
          weergavenaam: 'Hectometerpaal A270-5.34547',
        },
      ],
    },
  })
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  )
  Element.prototype.scrollIntoView = vi.fn()
})

const renderSearch = (
  validateSelection: () => Promise<boolean>,
  restrictSelectionArea = true
) => {
  const updatePosition = vi.fn()
  render(
    <RootMock>
      <ConfigProvider
        config={{ ...config, restrictSelectionArea } as unknown as AppConfig}
      >
        <AddressCombobox
          searchType={SearchType.HectometerAndRoad}
          updatePosition={updatePosition}
          validateSelection={validateSelection}
        />
      </ConfigProvider>
    </RootMock>
  )
  return { updatePosition, input: screen.getByRole('combobox') }
}

const showSuggestions = async (
  validateSelection: () => Promise<boolean>,
  restrictSelectionArea = true
) => {
  const { updatePosition, input } = renderSearch(
    validateSelection,
    restrictSelectionArea
  )
  fireEvent.change(input, { target: { value: 'A270 6.5' } })
  const option = await screen.findByRole('option', {
    name: 'Hectometerpaal A270-6.5',
  })
  expect(
    screen.queryByText('Hectometerpaal A270-5.34547')
  ).not.toBeInTheDocument()
  return { updatePosition, input, option }
}

const choosePost = async (validateSelection: () => Promise<boolean>) => {
  const result = await showSuggestions(validateSelection)
  fireEvent.mouseDown(result.option, { button: 0 })
  return result
}

describe('hectometer selection', () => {
  it('shows roads on the first query while post boundary checks are still pending, then appends posts underneath', async () => {
    let resolveBoundary!: (outside: boolean) => void
    const boundary = new Promise<boolean>((resolve) => {
      resolveBoundary = resolve
    })
    vi.mocked(isCoordinateOutsideRestrictedArea).mockReturnValue(boundary)
    vi.mocked(getSuggestedRoads).mockResolvedValue({
      response: {
        numFound: 1,
        start: 0,
        maxScore: 1,
        numFoundExact: true,
        docs: [
          {
            id: 'weg-n270',
            weergavenaam: 'N270, Deurne',
            straatnaam: 'N270',
            centroide_ll: 'POINT(5.58953096 51.46621774)',
          },
        ],
      },
    })
    const { input } = renderSearch(async () => true)
    fireEvent.change(input, { target: { value: 'N270' } })
    await screen.findByRole('option', { name: 'N270, Deurne' })
    expect(
      screen.queryByRole('option', { name: 'Hectometerpaal A270-6.5' })
    ).not.toBeInTheDocument()
    await act(async () => resolveBoundary(false))
    await screen.findByRole('option', { name: 'Hectometerpaal A270-6.5' })
    expect(
      screen.getAllByRole('option').map((option) => option.textContent)
    ).toEqual(['N270, Deurne', 'Hectometerpaal A270-6.5'])
    expect(getSuggestedRoads).toHaveBeenCalledTimes(1)
    expect(getSuggestedHectometerPosts).toHaveBeenCalledTimes(1)
  })

  it('shows that the initial search is loading, then displays a street without typing again', async () => {
    let resolveRoads!: (
      value: Awaited<ReturnType<typeof getSuggestedRoads>>
    ) => void
    vi.mocked(getSuggestedRoads).mockReturnValue(
      new Promise((resolve) => {
        resolveRoads = resolve
      })
    )
    vi.mocked(getSuggestedHectometerPosts).mockResolvedValue({
      response: {
        numFound: 0,
        start: 0,
        maxScore: 1,
        numFoundExact: true,
        docs: [],
      },
    })
    const { input } = renderSearch(async () => true)
    fireEvent.change(input, { target: { value: 'Dorpsstraat' } })
    await screen.findByText('Loading...')
    expect(
      screen.queryByText('No roads, streets or hectometer posts found.')
    ).not.toBeInTheDocument()
    await waitFor(() => expect(getSuggestedRoads).toHaveBeenCalledTimes(1))
    await act(async () =>
      resolveRoads({
        response: {
          numFound: 1,
          start: 0,
          maxScore: 1,
          numFoundExact: true,
          docs: [
            {
              id: 'weg-dorpsstraat',
              weergavenaam: 'Dorpsstraat, Nuenen',
              straatnaam: 'Dorpsstraat',
              centroide_ll: 'POINT(5.54162224 51.45663389)',
            },
          ],
        },
      })
    )
    await screen.findByRole('option', { name: 'Dorpsstraat, Nuenen' })
    expect(input).toHaveValue('Dorpsstraat')
  })

  it('ignores road and post results from a superseded search', async () => {
    let resolveOldRoads!: (
      value: Awaited<ReturnType<typeof getSuggestedRoads>>
    ) => void
    let resolveOldBoundary!: (outside: boolean) => void
    vi.mocked(getSuggestedRoads)
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveOldRoads = resolve
        })
      )
      .mockResolvedValue({
        response: {
          numFound: 1,
          start: 0,
          maxScore: 1,
          numFoundExact: true,
          docs: [
            {
              id: 'weg-new',
              weergavenaam: 'Nieuwe straat',
              straatnaam: 'Nieuwe straat',
              centroide_ll: 'POINT(5.54162224 51.45663389)',
            },
          ],
        },
      })
    vi.mocked(isCoordinateOutsideRestrictedArea)
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveOldBoundary = resolve
        })
      )
      .mockResolvedValue(true)
    const { input } = renderSearch(async () => true)
    fireEvent.change(input, { target: { value: 'N270' } })
    await waitFor(() =>
      expect(isCoordinateOutsideRestrictedArea).toHaveBeenCalledTimes(1)
    )
    const firstSignal = vi.mocked(getSuggestedRoads).mock.calls[0][5]
    fireEvent.change(input, { target: { value: 'Nieuwe straat' } })
    await screen.findByRole('option', { name: 'Nieuwe straat' })
    expect(firstSignal?.aborted).toBe(true)
    await act(async () => {
      resolveOldRoads({
        response: {
          numFound: 1,
          start: 0,
          maxScore: 1,
          numFoundExact: true,
          docs: [
            {
              id: 'weg-old',
              weergavenaam: 'Oude weg',
              straatnaam: 'Oude weg',
              centroide_ll: 'POINT(5.54162224 51.45663389)',
            },
          ],
        },
      })
      resolveOldBoundary(false)
    })
    expect(
      screen.queryByRole('option', { name: 'Oude weg' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('option', { name: 'Hectometerpaal A270-6.5' })
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: 'Nieuwe straat' })
    ).toBeInTheDocument()
  })

  it('keeps road results alongside hectometer posts without applying the post boundary filter to roads', async () => {
    vi.mocked(getSuggestedRoads).mockResolvedValue({
      response: {
        numFound: 1,
        start: 0,
        maxScore: 1,
        numFoundExact: true,
        docs: [
          {
            id: 'weg-outside',
            weergavenaam: 'N270, Noord-Brabant',
            straatnaam: 'N270',
            centroide_ll: 'POINT(5.58953096 51.46621774)',
          },
        ],
      },
    })
    vi.mocked(isCoordinateOutsideRestrictedArea).mockImplementation(
      async (_config, lng) => lng === 5.58953096
    )
    await showSuggestions(async () => true)
    expect(
      screen.getByRole('option', { name: 'N270, Noord-Brabant' })
    ).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(2)
    expect(isCoordinateOutsideRestrictedArea).toHaveBeenCalledTimes(1)
    expect(getSuggestedRoads).toHaveBeenCalledWith(
      'A270 6.5',
      config.base.pdok_address_suggest.scope,
      config.base.pdok_address_suggest.organization,
      config.pdokUrlApi,
      { bounds: config.base.pdok_hectometer_suggest.bounds },
      expect.any(AbortSignal)
    )
  })

  it.each([true, false])(
    'selects a permitted road or only navigates to an outside road (permitted: %s)',
    async (permitted) => {
      vi.mocked(getSuggestedRoads).mockResolvedValue({
        response: {
          numFound: 1,
          start: 0,
          maxScore: 1,
          numFoundExact: true,
          docs: [
            {
              id: 'weg-result',
              weergavenaam: 'N270, Noord-Brabant',
              straatnaam: 'N270',
              centroide_ll: 'POINT(5.58953096 51.46621774)',
            },
          ],
        },
      })
      const { updatePosition } = await showSuggestions(async () => permitted)
      fireEvent.mouseDown(
        screen.getByRole('option', { name: 'N270, Noord-Brabant' }),
        { button: 0 }
      )
      await waitFor(() => {
        if (permitted) {
          expect(updatePosition).toHaveBeenCalledWith(51.46621774, 5.58953096)
          expect(useFormStore.getState().formState.address?.id).toBe(
            'weg-result'
          )
        } else {
          expect(updatePosition).toHaveBeenCalledWith(
            51.46621774,
            5.58953096,
            false
          )
          expect(useFormStore.getState().formState).toMatchObject({
            address: null,
            coordinates: [0, 0],
            selectedFeatures: [],
          })
          expect(
            screen.getByText(
              'This location is outside the allowed area. The map has zoomed to this result. Choose a location inside the allowed area to continue.'
            )
          ).toBeInTheDocument()
        }
      })
      expect(isValidForStep3(useFormStore.getState().formState)).toBe(permitted)
    }
  )

  it('filters posts outside the reporting boundary before displaying suggestions', async () => {
    const outsidePost = {
      ...post,
      id: 'hmp-outside',
      weergavenaam: 'Hectometerpaal N270-100',
      centroide_ll: 'POINT(5.58953096 51.46621774)',
    }
    vi.mocked(getSuggestedHectometerPosts).mockResolvedValue({
      response: {
        numFound: 2,
        start: 0,
        maxScore: 1,
        numFoundExact: true,
        docs: [post, outsidePost],
      },
    })
    vi.mocked(isCoordinateOutsideRestrictedArea).mockImplementation(
      async (_config, lng) => lng === 5.58953096
    )
    await showSuggestions(async () => true)
    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(
      screen.queryByText('Hectometerpaal N270-10.0')
    ).not.toBeInTheDocument()
  })

  it('keeps valid suggestions without boundary checks when restriction is disabled', async () => {
    await showSuggestions(async () => true, false)
    expect(isCoordinateOutsideRestrictedArea).not.toHaveBeenCalled()
    expect(
      screen.getByRole('option', { name: 'Hectometerpaal A270-6.5' })
    ).toBeInTheDocument()
  })

  it('shows a search error if the boundary cannot be checked before displaying results', async () => {
    vi.mocked(isCoordinateOutsideRestrictedArea).mockRejectedValue(
      new Error('Unavailable')
    )
    render(
      <RootMock>
        <ConfigProvider config={config as unknown as AppConfig}>
          <AddressCombobox searchType={SearchType.HectometerAndRoad} />
        </ConfigProvider>
      </RootMock>
    )
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'N270' },
    })
    await screen.findByText(
      'The search results could not be retrieved or checked. Please try again.'
    )
    expect(
      screen.queryByRole('option', { name: 'Hectometerpaal A270-6.5' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText('No roads, streets or hectometer posts found.')
    ).not.toBeInTheDocument()
  })

  it('clears the old location if a displayed post becomes restricted before it is clicked', async () => {
    const { updatePosition, input } = await choosePost(async () => false)
    await waitFor(() =>
      expect(updatePosition).toHaveBeenCalledWith(
        51.45663389,
        5.54162224,
        false
      )
    )
    await waitFor(() => expect(input).toHaveValue('Hectometerpaal A270-6.5'))
    expect(useFormStore.getState().formState).toMatchObject({
      address: null,
      coordinates: [0, 0],
      selectedFeatures: [],
    })
    expect(isValidForStep3(useFormStore.getState().formState)).toBe(false)
    expect(getSuggestedHectometerPosts).toHaveBeenCalledWith(
      'A270 65',
      config.pdokUrlApi,
      {
        bounds: config.base.pdok_hectometer_suggest.bounds,
        maxResults: 400,
        roadNumberPrefix: 'N',
        roadNumberExceptions: ['A270'],
      },
      expect.any(AbortSignal)
    )
  })

  it('selects a permitted post as the new report location', async () => {
    const { updatePosition } = await choosePost(async () => true)
    await waitFor(() =>
      expect(updatePosition).toHaveBeenCalledWith(51.45663389, 5.54162224)
    )
    expect(useFormStore.getState().formState).toMatchObject({
      address: { id: post.id },
      coordinates: [51.45663389, 5.54162224],
    })
    expect(isValidForStep3(useFormStore.getState().formState)).toBe(true)
  })

  it('blocks selection when the boundary cannot be checked', async () => {
    const { updatePosition } = await choosePost(async () => {
      throw new Error('Unavailable')
    })
    await screen.findByText(
      'This location could not be checked. Please try again.'
    )
    expect(updatePosition).not.toHaveBeenCalled()
    expect(isValidForStep3(useFormStore.getState().formState)).toBe(false)
  })

  it('ignores a late boundary response after another location has been chosen', async () => {
    let resolve!: (value: boolean) => void
    const pending = new Promise<boolean>((done) => {
      resolve = done
    })
    const { updatePosition } = await choosePost(() => pending)
    act(() =>
      useFormStore.getState().updateForm({
        ...useFormStore.getState().formState,
        coordinates: [51.4, 5.4],
      })
    )
    await act(async () => resolve(true))
    expect(updatePosition).not.toHaveBeenCalled()
    expect(useFormStore.getState().formState.coordinates).toEqual([51.4, 5.4])
  })
})
