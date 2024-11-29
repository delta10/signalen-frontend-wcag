export type AppConfig = {
  base: {
    municipality: string
    municipality_display_name: string
    assets_url: string
    supportedLanguages: Array<{
      label: string
      lang: string
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
      center: [number, number]
      maxBounds: [[number, number], [number, number]]
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
            opening_hours: string
          }
        }
      }
    }
  }
}
