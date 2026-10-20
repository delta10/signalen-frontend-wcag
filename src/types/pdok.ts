export type SuggestResponse<T> = {
  response: {
    numFound: number
    start: number
    maxScore: number
    numFoundExact: boolean
    docs: Array<T>
  }
}

export type AddressSuggestDoc = {
  woonplaatsnaam: string
  huis_nlt: string
  weergavenaam: string
  id: string
  centroide_ll: string
  straatnaam: string
  postcode: string
}

export type HectometerSuggestDoc = {
  id: string
  identificatie: string
  weergavenaam: string
  centroide_ll: string
  wegnummer: string
  hectometernummer: string
  hectometerletter?: string
}

export type CoordinateResponse<T> = {
  response: {
    numFound: number
    start: number
    maxScore: number
    numFoundExact: boolean
    docs: Array<T>
  }
}

export type AddressCoordinateDoc = {
  afstand: number
  id: string
  score: number
  type: string
  weergavenaam: string
  postcode: string
  huis_nlt: string | number
  woonplaatsnaam: string
  straatnaam: string
  centroide_ll: string
}

export type HectometerCoordinateDoc = {
  afstand: number
  id: string
  score: number
  type: string
  weergavenaam: string
  centroide_ll: string
}
