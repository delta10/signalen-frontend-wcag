export type AppConfig = {
  base: {
    municipality: string
    assets_url: string
    style: {
      primaryColor: string
    }
    map: {
      find_address_in_distance: number
      minimal_zoom: number
      center: [number, number]
      maxBounds: [[number, number], [number, number]]
    }
  }
}
