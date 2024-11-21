export type AppConfig = {
  base: {
    municipality: string
    assets_url: string
    style: {
      primaryColor: string
    }
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
