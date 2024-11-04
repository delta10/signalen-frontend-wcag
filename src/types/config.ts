export type AppConfig = {
  base: {
    municipality: string
    map: {
      center: [number, number]
      maxBounds: [[number, number], [number, number]]
    }
  }
}
