/** PDOK Locatieserver suggest: `gemeentenaam` vs `provincienaam` filter. */
export type PdokAddressSuggestScope = 'gemeente' | 'provincie'

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
     * PDOK suggest: restrict address hits to `gemeentenaam` (default) or `provincienaam`.
     */
    pdok_address_suggest_scope?: PdokAddressSuggestScope
    /**
     * Optional exact PDOK filter value for the selected suggest scope.
     * Falls back to `municipality`, then `municipality_display_name`.
     */
    pdok_address_suggest_organization?: string
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
        dark_mode_url?: string
        caption: string
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
      maxBounds: number[][]
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
