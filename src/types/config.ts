import type { CoordinateBounds } from '@/lib/utils/map'

/** PDOK Locatieserver suggest: `gemeentenaam` vs `provincienaam` filter. */
export enum PdokAddressSuggestScope {
  Gemeente = 'gemeente',
  Provincie = 'provincie',
}

export const pdokAddressSuggestFields: Record<PdokAddressSuggestScope, string> =
  {
    [PdokAddressSuggestScope.Gemeente]: 'gemeentenaam',
    [PdokAddressSuggestScope.Provincie]: 'provincienaam',
  }

type MapLayerStyleValue =
  | string
  | number
  | boolean
  | null
  | MapLayerStyleValue[]
  | { [key: string]: MapLayerStyleValue }

export type MapLayerConfiguration = {
  id: string
  source: {
    type: 'geojson' | 'vector'
    url?: string
    data?: string | { [key: string]: MapLayerStyleValue }
    promoteId?: string
    tolerance?: number
  }
  icons?: Array<{
    id: string
    url: string
    width?: number
    height?: number
  }>
  layers: Array<{
    id: string
    type: 'symbol' | 'circle' | 'line' | 'fill' | 'background'
    sourceLayer?: string
    minzoom?: number
    maxzoom?: number
    filter?: MapLayerStyleValue[]
    layout?: { [key: string]: MapLayerStyleValue }
    paint?: { [key: string]: MapLayerStyleValue }
  }>
}

export type AppConfig = {
  maptilerApiKey: string
  maptilerMap: string
  maptilerMapDarkMode: string
  maptilerOutOfBoundsSelectionArea?: string
  maptilerOutOfBoundsLayerId?: string
  restrictSelectionArea: boolean
  pdokUrlApi: string
  frontendUrl: string
  baseUrlApi: string
  base: {
    municipality: string
    /**
     * Theme folder name under /public/assets/organizations/<theme>/theme.css
     * Falls back to `municipality` when omitted.
     */
    theme?: string
    municipality_display_name: string
    /**
     * PDOK suggest: restrict address hits to an explicit municipality or province.
     */
    pdok_address_suggest: {
      scope: PdokAddressSuggestScope
      organization: string
    }
    pdok_hectometer_suggest?: {
      enabled: boolean
      bounds?: CoordinateBounds
    }
    fonts?: {
      /** Optional Google Fonts stylesheet URL to load in the document head. */
      googleStylesheetUrl?: string
    }
    assets_url: string
    supportedLanguages: Array<{
      label: string
      lang: string
      name: string
    }>
    /**
     * One or more class names for the NL Design System theme.
     */
    naam: string
    header: {
      logo: {
        alt: string
        url: string
        width?: number
        height?: number
        dark_mode_url?: string
      }
    }
    contact: {
      tel: string
    }
    map: {
      find_address_in_distance: number
      minimal_zoom: number
      default_zoom: number
      center: number[]
      maxBounds: CoordinateBounds
      layers?: MapLayerConfiguration[]
    }
    links: {
      about: string
      accessibility: string
      help: string
      home: string
      privacy: string
    }
    i18n: {
      [index: string]: {
        describe_report: {
          alert: {
            help_text: string
          }
        }
      }
    }
  }
}
