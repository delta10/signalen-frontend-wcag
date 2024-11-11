export type AppConfig = {
  base: {
    municipality: string
    className?: string
    URL: string
    naam: string
    header: {
      logo: {
        alt: string
        url: string
      }
      title: string
    }
    style?: {
      primaryColor?: string
    }
    map: {
      find_address_in_distance: number
      center: [number, number]
      maxBounds: [[number, number], [number, number]]
    }
  }
}
