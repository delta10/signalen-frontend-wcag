export type AppConfig = {
  base: {
    municipality: string
    logo: string
    logo_dark_mode: string
    logo_alt_text: string
    municipality_display_name: string
    assets_url: string
    supportedLanguages: Array<{
      label: string
      lang: string
    }>
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
  }
}
