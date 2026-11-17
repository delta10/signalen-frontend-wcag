import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import { ConfigProvider } from '@/contexts/ConfigContext'
import type { AppConfig } from '@/types/config'
import messages from '../../../../../translations/nl.json'
import { IncidentMapContent } from './IncidentMapContent'

const { map, api, getAddress } = vi.hoisted(() => ({
  map: {
    getBounds: () => ({
      getWest: () => 4.83,
      getSouth: () => 51.51,
      getEast: () => 4.85,
      getNorth: () => 51.53,
    }),
    on: vi.fn(),
    off: vi.fn(),
  },
  api: {
    v1PublicSignalsGeographyRetrieve: vi.fn(),
    v1PublicTermsCategoriesList: vi.fn(),
  },
  getAddress: vi.fn(),
}))

vi.mock('@/services/client/api-client', () => ({
  createSignalsClient: () => ({ v1: api }),
}))
vi.mock('react-map-gl/maplibre', () => ({
  useMap: () => ({ dialogMap: map }),
  Marker: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))
vi.mock('@/components/ui/Map', () => ({
  Map: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
vi.mock('@/components/ui/MapAttribution', () => ({
  MapAttribution: () => null,
}))
vi.mock('@/components/ui/AddressCombobox', () => ({
  AddressCombobox: () => null,
}))
vi.mock('@/hooks/useDarkMode', () => ({
  useDarkMode: () => ({ isDarkMode: false }),
}))
vi.mock('usehooks-ts', () => ({
  useIsClient: () => true,
  useMediaQuery: () => false,
  useWindowSize: () => ({ width: 1024 }),
}))
vi.mock('@/lib/utils/address', () => ({ getNewSelectedAddress: getAddress }))
vi.mock('@/lib/utils/map', () => ({ getMapStyleUrl: () => '/style.json' }))
vi.mock('@/routing/navigation', () => ({ stepToPath: { 1: '/incident' } }))
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
    className,
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  ),
}))

const response = <T,>(value: T) =>
  Object.assign(Promise.resolve(value), { cancel: vi.fn() })
const category = (
  name: string,
  slug: string,
  sub: string,
  showChildren: boolean
) => ({
  name,
  slug,
  is_public_accessible: true,
  configuration: { show_children_in_filter: showChildren },
  _links: { 'sia:icon': { href: `/${slug}.svg` } },
  sub_categories: [{ name: sub, slug: sub }],
})
const report = (name: string, slug: string, parent: string) => ({
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [4.838730985, 51.517607625] },
  properties: {
    category: { name, slug, parent: { slug: parent } },
    created_at: '2026-10-20T12:09:16.491757+00:00',
  },
})

const config = {
  baseUrlApi: 'https://example.test',
  base: {
    map: {
      center: [51.51, 4.83],
      default_zoom: 12,
      maxBounds: [
        [4, 51],
        [6, 53],
      ],
    },
  },
} as AppConfig

beforeEach(() => {
  vi.clearAllMocks()
  api.v1PublicSignalsGeographyRetrieve.mockReturnValue(
    response({
      features: [
        report('Openbare verlichting', 'verlichting', 'wegen'),
        report('Afval op straat', 'zwerfafval', 'afval'),
      ],
    })
  )
  api.v1PublicTermsCategoriesList.mockReturnValue(
    response({
      results: [
        category('Wegen', 'wegen', 'verlichting', true),
        category('Afval', 'afval', 'zwerfafval', false),
        {
          ...category('Intern', 'intern', 'intern', false),
          is_public_accessible: false,
        },
      ],
    })
  )
  getAddress.mockResolvedValue({ weergave_naam: 'Hectometerpaal N639-11.9' })
})

const renderMap = () =>
  render(
    <NextIntlClientProvider locale="nl" messages={messages}>
      <ConfigProvider config={config}>
        <IncidentMapContent />
      </ConfigProvider>
    </NextIntlClientProvider>
  )

it('keeps category filters on the incident map while using the shared reports and markers', async () => {
  renderMap()
  await screen.findByRole('button', {
    name: 'Bestaande melding: Openbare verlichting',
  })
  expect(
    await screen.findByRole('button', {
      name: 'Bestaande melding: Afval op straat',
    })
  ).toBeInTheDocument()
  expect(
    screen.queryByRole('checkbox', { name: 'Intern' })
  ).not.toBeInTheDocument()
  fireEvent.click(await screen.findByRole('checkbox', { name: 'Wegen' }))
  expect(
    screen.queryByRole('button', { name: 'Bestaande melding: Afval op straat' })
  ).not.toBeInTheDocument()
  expect(
    screen.getByRole('button', {
      name: 'Bestaande melding: Openbare verlichting',
    })
  ).toBeInTheDocument()
  fireEvent.click(screen.getByRole('checkbox', { name: 'Wegen' }))
  expect(
    screen.getByRole('button', { name: 'Bestaande melding: Afval op straat' })
  ).toBeInTheDocument()
  expect(api.v1PublicSignalsGeographyRetrieve).toHaveBeenCalledTimes(1)
  expect(api.v1PublicSignalsGeographyRetrieve).toHaveBeenCalledWith(
    '4.83,51.51,4.85,51.53'
  )
})

it('shows shared report details and the nearest address in the sidebar and restores filters when closed', async () => {
  renderMap()
  fireEvent.click(
    await screen.findByRole('button', {
      name: 'Bestaande melding: Openbare verlichting',
    })
  )
  expect(
    await screen.findByText('Hectometerpaal N639-11.9')
  ).toBeInTheDocument()
  expect(screen.getByText('20 oktober 2026')).toBeInTheDocument()
  expect(getAddress).toHaveBeenCalledWith(51.517607625, 4.838730985, config)
  const marker = screen.getByRole('button', {
    name: 'Bestaande melding: Openbare verlichting',
  })
  expect(marker.querySelector('img')).toHaveAttribute(
    'src',
    '/assets/images/feature-selected-marker.svg'
  )
  fireEvent.click(screen.getByRole('button', { name: /^Sluit$/ }))
  await waitFor(() =>
    expect(screen.getByRole('checkbox', { name: 'Wegen' })).toBeInTheDocument()
  )
  expect(screen.queryByText('Hectometerpaal N639-11.9')).not.toBeInTheDocument()
})

it('shows a report loading error on the incident map without a location-picker instruction', async () => {
  api.v1PublicSignalsGeographyRetrieve.mockReturnValue(
    Object.assign(Promise.reject(new Error('unavailable')), { cancel: vi.fn() })
  )
  renderMap()
  expect(await screen.findByRole('status')).toHaveTextContent(
    'De meldingen konden niet worden geladen.'
  )
  expect(screen.getByRole('status')).not.toHaveTextContent(
    'U kunt wel een locatie kiezen.'
  )
})
