export type AppConfig = {
  base: {
    municipality: string
    style: {
      primaryColor: string
    }
    map: {
      center: [number, number]
      maxBounds: [[number, number], [number, number]]
    }
  }
}
