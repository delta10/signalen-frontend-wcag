export type AppConfig = {
  base: {
    municipality: string
    assets_url: string
    supportedLanguages: Array<{
      label: string
      lang: string
    }>
    /**
     * One or more class names for the NL Design System theme.
     */
    className?: string
    naam: string
    homepage: {
      url: string
      title: string
    }
    header: {
      logo: {
        /**
         * Text alternative for the logo image.
         */
        alt: string

        /**
         * Link to the homepage of the website.
         */
        url: string
      }
      title: string
    }
    contact: {
      /**
       * Phone number where visitors can get help.
       */
      tel: string
    }
    map: {
      find_address_in_distance: number
      minimal_zoom: number
      center: [number, number] | number[]
      maxBounds: any // TODO: [[number, number], [number, number]]
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
        'describe-report': {
          alert: {
            help_text: string
            opening_hours: string
          }
        }
      }
    }
  }
}
