export type AppConfig = {
  base: {
    municipality: string
    style: {
      primaryColor: string
    }
    map: {
      find_address_in_distance: number
      center: [number, number]
      maxBounds: [[number, number], [number, number]]
    }
  }
}
