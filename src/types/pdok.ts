export type AddressSuggestResponse = {
  response: {
    numFound: number
    start: number
    maxScore: number
    numFoundExact: boolean
    docs: Array<AddressSuggestDoc>
  }
}

export type AddressSuggestDoc = {
  woonplaatsnaam: string
  huis_nlt: string
  weergavenaam: string
  id: string
  centroide_ll: string
  straatnaam: string
}

export type AddressCoordinateResponse = {
  response: {
    numFound: number
    start: number
    maxScore: number
    numFoundExact: boolean
    docs: Array<AddressCoordinateDoc>
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
}
