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
