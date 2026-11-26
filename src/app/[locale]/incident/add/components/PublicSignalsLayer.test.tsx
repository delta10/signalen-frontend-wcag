import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import { ConfigProvider } from '@/contexts/ConfigContext'
import { useFormStore } from '@/store/form_store'
import type { AppConfig } from '@/types/config'
import messages from '../../../../../../translations/nl.json'
import { PublicSignalsLayer } from './PublicSignalsLayer'
import { MapDialog } from './MapDialog'

const { map, api } = vi.hoisted(() => ({
  map: {
    getBounds: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  },
  api: {
    v1PublicSignalsGeographyRetrieve: vi.fn(),
    v1PublicTermsCategoriesList: vi.fn(),
  },
}))

vi.mock('@/services/client/api-client', () => ({
  createSignalsClient: () => ({ v1: api }),
}))

vi.mock('react-map-gl/maplibre', () => ({
  useMap: () => ({ current: map }),
  Marker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="public-marker">{children}</div>
  ),
  Popup: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className: string
  }) => (
    <div data-testid="public-popup" className={className}>
      {children}
    </div>
  ),
}))

vi.mock('usehooks-ts', () => ({ useMediaQuery: () => false }))
vi.mock('@/app/[locale]/incident/add/components/MapDialogContent', () => ({
  default: () => <PublicSignalsLayer />,
}))
vi.mock(
  '@/app/[locale]/incident/add/components/MapDialogMobileContent',
  () => ({
    default: () => <PublicSignalsLayer />,
  })
)

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} />
  ),
}))

const report = {
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [4.838730985, 51.517607625] },
  properties: {
    category: {
      name: 'Openbare verlichting',
      slug: 'openbare-verlichting',
      parent: { slug: 'wegen-verkeer-en-straatmeubilair' },
    },
    created_at: '2026-10-20T12:09:16.491757+00:00',
  },
}

const roadsCategory = {
  slug: 'wegen-verkeer-en-straatmeubilair',
  is_public_accessible: true,
  configuration: { show_children_in_filter: true },
  _links: { 'sia:icon': { href: '/parent.svg' } },
  sub_categories: [
    {
      slug: 'openbare-verlichting',
      is_public_accessible: true,
      _links: { 'sia:icon': { href: '/lighting.svg' } },
    },
    { slug: 'onderhoud-weg', is_public_accessible: true },
    { slug: 'intern', is_public_accessible: false },
  ],
}

const categoryResults = {
  results: [
    roadsCategory,
    {
      slug: 'ander-domein',
      is_public_accessible: true,
      sub_categories: [
        { slug: 'openbare-verlichting', is_public_accessible: true },
      ],
    },
  ],
}

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: Error) => void
  const request = Object.assign(
    new Promise<T>((res, rej) => {
      resolve = res
      reject = rej
    }),
    { cancel: vi.fn() }
  )
  return { request, resolve, reject }
}

const response = <T,>(value: T) =>
  Object.assign(Promise.resolve(value), { cancel: vi.fn() })

const bounds = (west = 4.83) => ({
  getWest: () => west,
  getSouth: () => 51.51,
  getEast: () => 4.85,
  getNorth: () => 51.53,
})

const selectCategory = (mainCategory: string, subCategory: string) => {
  const store = useFormStore.getState()
  store.updateForm({
    ...store.formState,
    main_category: mainCategory,
    sub_category: subCategory,
  })
}

const emit = async (eventName: string) => {
  await act(async () => {
    for (const [name, handler] of map.on.mock.calls) {
      if (name === eventName) await handler()
    }
  })
}

const renderLayer = (onClick = vi.fn(), onKeyDown = vi.fn()) =>
  render(
    <NextIntlClientProvider locale="nl" messages={messages}>
      <ConfigProvider
        config={{ baseUrlApi: 'https://example.test' } as AppConfig}
      >
        <form>
          <div onClick={onClick} onKeyDown={onKeyDown}>
            <PublicSignalsLayer />
          </div>
        </form>
      </ConfigProvider>
    </NextIntlClientProvider>
  )

beforeEach(() => {
  vi.clearAllMocks()
  selectCategory('wegen-verkeer-en-straatmeubilair', 'openbare-verlichting')
  map.getBounds.mockReturnValue(bounds())
  api.v1PublicSignalsGeographyRetrieve.mockReturnValue(
    response({ features: [report] })
  )
  api.v1PublicTermsCategoriesList.mockReturnValue(response(categoryResults))
})

it('loads reports for the initial bounds, including an already loaded map, and uses category icons', async () => {
  renderLayer()
  const marker = await screen.findByRole('button', {
    name: 'Bestaande melding: Openbare verlichting',
  })
  expect(api.v1PublicSignalsGeographyRetrieve).toHaveBeenCalledWith(
    '4.83,51.51,4.85,51.53',
    ['openbare-verlichting'],
    undefined,
    undefined,
    ['wegen-verkeer-en-straatmeubilair']
  )
  await waitFor(() => {
    expect(marker.querySelector('img')).toHaveAttribute('src', '/lighting.svg')
  })
  await emit('load')
  expect(api.v1PublicSignalsGeographyRetrieve).toHaveBeenCalledTimes(1)
})

it('shows details by mouse and keyboard without choosing a location, selecting an asset, or submitting the form', async () => {
  const onMapClick = vi.fn()
  const onMapKeyDown = vi.fn()
  const formState = useFormStore.getState().formState
  const { container } = renderLayer(onMapClick, onMapKeyDown)
  const onSubmit = vi.fn((event: Event) => event.preventDefault())
  container.querySelector('form')!.addEventListener('submit', onSubmit)
  const marker = await screen.findByRole('button', {
    name: 'Bestaande melding: Openbare verlichting',
  })
  fireEvent.keyDown(marker, { key: 'Enter' })
  fireEvent.click(marker)
  expect(screen.getByTestId('public-popup')).toHaveTextContent(
    '20 oktober 2026'
  )
  fireEvent.click(screen.getByText('Datum melding'))
  fireEvent.click(screen.getByRole('button', { name: 'Sluit' }))
  expect(screen.queryByTestId('public-popup')).not.toBeInTheDocument()
  expect(marker).toHaveFocus()
  fireEvent.click(marker)
  fireEvent.keyDown(screen.getByTestId('public-popup').firstElementChild!, {
    key: 'Escape',
  })
  expect(screen.queryByTestId('public-popup')).not.toBeInTheDocument()
  expect(onMapClick).not.toHaveBeenCalled()
  expect(onMapKeyDown).not.toHaveBeenCalled()
  expect(onSubmit).not.toHaveBeenCalled()
  expect(useFormStore.getState().formState).toBe(formState)
})

it('closes report details with Escape before closing the surrounding location dialog', async () => {
  render(
    <NextIntlClientProvider locale="nl" messages={messages}>
      <ConfigProvider
        config={{ baseUrlApi: 'https://example.test' } as AppConfig}
      >
        <MapDialog trigger={<button type="button">Kies locatie</button>} />
      </ConfigProvider>
    </NextIntlClientProvider>
  )
  fireEvent.click(screen.getByRole('button', { name: 'Kies locatie' }))
  const marker = await screen.findByRole('button', {
    name: 'Bestaande melding: Openbare verlichting',
  })
  fireEvent.click(marker)
  fireEvent.keyDown(screen.getByRole('button', { name: /^Sluit$/ }), {
    key: 'Escape',
  })
  expect(screen.queryByTestId('public-popup')).not.toBeInTheDocument()
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  fireEvent.keyDown(marker, { key: 'Escape' })
  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  )
})

it('updates after moving the map and ignores an older response even when cancellation is too late', async () => {
  const old = deferred<{ features: (typeof report)[] }>()
  const latest = deferred<{ features: (typeof report)[] }>()
  api.v1PublicSignalsGeographyRetrieve
    .mockReturnValueOnce(old.request)
    .mockReturnValueOnce(latest.request)
  const { unmount } = renderLayer()
  await waitFor(() =>
    expect(api.v1PublicSignalsGeographyRetrieve).toHaveBeenCalledTimes(1)
  )
  map.getBounds.mockReturnValue(bounds(4.84))
  // Do not await the pending network request from the event handler.
  act(() => {
    map.on.mock.calls.find(([name]) => name === 'moveend')![1]()
  })
  const newReport = {
    ...report,
    properties: {
      ...report.properties,
      category: {
        ...report.properties.category,
        name: 'Nieuwe melding verlichting',
      },
    },
  }
  await act(async () => latest.resolve({ features: [newReport] }))
  expect(
    await screen.findByRole('button', {
      name: 'Bestaande melding: Nieuwe melding verlichting',
    })
  ).toBeInTheDocument()
  await act(async () => old.resolve({ features: [report] }))
  expect(
    screen.queryByRole('button', {
      name: 'Bestaande melding: Openbare verlichting',
    })
  ).not.toBeInTheDocument()
  expect(old.request.cancel).toHaveBeenCalled()
  expect(api.v1PublicSignalsGeographyRetrieve).toHaveBeenLastCalledWith(
    '4.84,51.51,4.85,51.53',
    ['openbare-verlichting'],
    undefined,
    undefined,
    ['wegen-verkeer-en-straatmeubilair']
  )
  unmount()
  expect(latest.request.cancel).toHaveBeenCalled()
  expect(map.off.mock.calls.map(([name]) => name)).toEqual(['load', 'moveend'])
})

it('filters invalid and duplicate reports and keeps a fallback marker if the subcategory has no icon', async () => {
  api.v1PublicTermsCategoriesList.mockReturnValue(
    response({
      results: [
        {
          ...roadsCategory,
          sub_categories: [
            { slug: 'openbare-verlichting', is_public_accessible: true },
          ],
        },
      ],
    })
  )
  api.v1PublicSignalsGeographyRetrieve.mockReturnValue(
    response({
      features: [
        report,
        report,
        { geometry: null },
        { ...report, geometry: { type: 'Point', coordinates: [NaN, 51] } },
      ],
    })
  )
  renderLayer()
  expect(await screen.findAllByTestId('public-marker')).toHaveLength(1)
  expect(
    screen
      .getByRole('button', { name: 'Bestaande melding: Openbare verlichting' })
      .querySelector('svg')
  ).toBeInTheDocument()
})

it('reports a loading failure and retries the same bounds without blocking location selection', async () => {
  const failed = deferred<never>()
  api.v1PublicSignalsGeographyRetrieve.mockReturnValueOnce(failed.request)
  renderLayer()
  await waitFor(() =>
    expect(api.v1PublicSignalsGeographyRetrieve).toHaveBeenCalledTimes(1)
  )
  await act(async () => failed.reject(new Error('unavailable')))
  expect(screen.getByRole('status')).toHaveTextContent(
    'U kunt wel een locatie kiezen.'
  )
  await emit('moveend')
  expect(
    await screen.findByRole('button', {
      name: 'Bestaande melding: Openbare verlichting',
    })
  ).toBeInTheDocument()
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
})

it('shows only reports matching both the chosen main category and subcategory', async () => {
  const otherSubcategory = {
    ...report,
    properties: {
      ...report.properties,
      category: {
        ...report.properties.category,
        name: 'Wegonderhoud',
        slug: 'onderhoud-weg',
      },
    },
  }
  const otherMainCategory = {
    ...report,
    properties: {
      ...report.properties,
      category: {
        ...report.properties.category,
        name: 'Verlichting ander domein',
        parent: { slug: 'ander-domein' },
      },
    },
  }
  api.v1PublicSignalsGeographyRetrieve.mockReturnValue(
    response({ features: [report, otherSubcategory, otherMainCategory] })
  )
  renderLayer()
  await screen.findByRole('button', {
    name: 'Bestaande melding: Openbare verlichting',
  })
  expect(screen.getAllByTestId('public-marker')).toHaveLength(1)
  expect(
    screen.queryByRole('button', { name: 'Bestaande melding: Wegonderhoud' })
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {
      name: 'Bestaande melding: Verlichting ander domein',
    })
  ).not.toBeInTheDocument()
})

it.each([
  {
    mainCategory: 'wegen-verkeer-en-straatmeubilair',
    subCategory: 'onderhoud-weg',
  },
  { mainCategory: 'ander-domein', subCategory: 'openbare-verlichting' },
])(
  'refreshes unchanged map bounds when the chosen category changes to $mainCategory / $subCategory',
  async ({ mainCategory, subCategory }) => {
    renderLayer()
    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Bestaande melding: Openbare verlichting',
      })
    )
    const next = deferred<{ features: (typeof report)[] }>()
    api.v1PublicSignalsGeographyRetrieve.mockReturnValueOnce(next.request)
    act(() => selectCategory(mainCategory, subCategory))
    expect(screen.queryByTestId('public-marker')).not.toBeInTheDocument()
    expect(screen.queryByTestId('public-popup')).not.toBeInTheDocument()
    expect(api.v1PublicSignalsGeographyRetrieve).toHaveBeenLastCalledWith(
      '4.83,51.51,4.85,51.53',
      [subCategory],
      undefined,
      undefined,
      [mainCategory]
    )
    const nextReport = {
      ...report,
      properties: {
        ...report.properties,
        category: {
          name: 'Nieuwe categorie',
          slug: subCategory,
          parent: { slug: mainCategory },
        },
      },
    }
    await act(async () => next.resolve({ features: [report, nextReport] }))
    expect(
      await screen.findByRole('button', {
        name: 'Bestaande melding: Nieuwe categorie',
      })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', {
        name: 'Bestaande melding: Openbare verlichting',
      })
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('public-popup')).not.toBeInTheDocument()
  }
)

it('ignores a late response from a previously chosen category', async () => {
  const previous = deferred<{ features: (typeof report)[] }>()
  const current = deferred<{ features: (typeof report)[] }>()
  api.v1PublicSignalsGeographyRetrieve
    .mockReturnValueOnce(previous.request)
    .mockReturnValueOnce(current.request)
  renderLayer()
  await waitFor(() =>
    expect(api.v1PublicSignalsGeographyRetrieve).toHaveBeenCalledTimes(1)
  )
  act(() => selectCategory('wegen-verkeer-en-straatmeubilair', 'onderhoud-weg'))
  const currentReport = {
    ...report,
    properties: {
      ...report.properties,
      category: {
        ...report.properties.category,
        name: 'Wegonderhoud',
        slug: 'onderhoud-weg',
      },
    },
  }
  await act(async () => current.resolve({ features: [currentReport] }))
  await act(async () => previous.resolve({ features: [report] }))
  expect(previous.request.cancel).toHaveBeenCalled()
  expect(
    screen.getByRole('button', { name: 'Bestaande melding: Wegonderhoud' })
  ).toBeInTheDocument()
  expect(
    screen.queryByRole('button', {
      name: 'Bestaande melding: Openbare verlichting',
    })
  ).not.toBeInTheDocument()
})

it.each([
  { mainCategory: '', subCategory: 'openbare-verlichting' },
  { mainCategory: 'wegen-verkeer-en-straatmeubilair', subCategory: '' },
])(
  'does not request unfiltered reports when a category is missing: $mainCategory / $subCategory',
  async ({ mainCategory, subCategory }) => {
    selectCategory(mainCategory, subCategory)
    renderLayer()
    await waitFor(() =>
      expect(api.v1PublicTermsCategoriesList).toHaveBeenCalled()
    )
    expect(api.v1PublicSignalsGeographyRetrieve).not.toHaveBeenCalled()
    expect(screen.queryByTestId('public-marker')).not.toBeInTheDocument()
  }
)

it('skips reports for a non-public subcategory under a public main category', async () => {
  const categories = deferred<typeof categoryResults>()
  api.v1PublicTermsCategoriesList.mockReturnValue(categories.request)
  selectCategory(roadsCategory.slug, 'intern')
  renderLayer()
  expect(api.v1PublicSignalsGeographyRetrieve).not.toHaveBeenCalled()

  await act(async () => categories.resolve(categoryResults))
  await emit('moveend')
  expect(api.v1PublicSignalsGeographyRetrieve).not.toHaveBeenCalled()
  expect(screen.queryByRole('status')).not.toBeInTheDocument()

  act(() => selectCategory(roadsCategory.slug, 'openbare-verlichting'))
  fireEvent.click(
    await screen.findByRole('button', {
      name: 'Bestaande melding: Openbare verlichting',
    })
  )
  expect(screen.getByTestId('public-popup')).toBeInTheDocument()

  act(() => selectCategory(roadsCategory.slug, 'intern'))
  expect(api.v1PublicSignalsGeographyRetrieve).toHaveBeenCalledTimes(1)
  expect(screen.queryByTestId('public-marker')).not.toBeInTheDocument()
  expect(screen.queryByTestId('public-popup')).not.toBeInTheDocument()
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
})

it('waits for category metadata before requesting reports even when the subcategory is public', async () => {
  const categories = deferred<typeof categoryResults>()
  api.v1PublicTermsCategoriesList.mockReturnValue(categories.request)
  renderLayer()
  expect(api.v1PublicSignalsGeographyRetrieve).not.toHaveBeenCalled()

  await act(async () => categories.resolve(categoryResults))
  expect(api.v1PublicSignalsGeographyRetrieve).toHaveBeenCalledTimes(1)
  expect(screen.getByTestId('public-marker')).toBeInTheDocument()
})
