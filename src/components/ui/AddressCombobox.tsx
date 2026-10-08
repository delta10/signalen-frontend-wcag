import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'
import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
  useRef,
} from 'react'
import { useConfig } from '@/contexts/ConfigContext'
import {
  getSuggestedAddresses,
  getSuggestedHectometerPosts,
  getSuggestedProvincialHectometerPosts,
  getSuggestedRoads,
} from '@/services/location/address'
import {
  AlertText,
  Listbox,
  ListboxOption,
  StatusText,
  Textbox,
} from '@/components/index'
// Import the Select Combobox component for the side-effects of injecting CSS
// for related components, such as Textbox and Listbox.
import '@utrecht/select-combobox-react/dist/css'
import { useFormStore } from '@/store/form_store'
import { Address } from '@/types/form'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils/style'
import {
  AddressSuggestDoc,
  HectometerSuggestDoc,
  RoadSuggestDoc,
} from '@/types/pdok'
import { AppConfig, PdokAddressSuggestScope } from '@/types/config'
import { getPointCoordinates } from '@/lib/utils/map'
import {
  formatHectometerDisplayName,
  normalizeHectometerSearchQuery,
} from '@/lib/utils/address'

export enum SearchType {
  Address = 'address',
  HectometerAndRoad = 'hectometer-and-road',
}

type AddressComboboxProps = {
  updatePosition?: (lat: number, lng: number, selectPosition?: boolean) => void
  setIsMapSelected?: Dispatch<SetStateAction<boolean | null>>
  mobileView?: boolean
  id?: string
  ariaDescribedBy?: string
  ariaInvalid?: boolean
  searchType?: SearchType
  validateSelection?: (selectedAddress: Address) => boolean | Promise<boolean>
  placeholder?: string
  className?: string
}

const normalizeQuery = (str: string) => str.trim().replace(/\s+/g, ' ')
const SEARCH_DEBOUNCE_MS = 250

const mapAddressSuggestDocToAddress = (item: AddressSuggestDoc): Address[] => {
  const coordinates = getPointCoordinates(item.centroide_ll)

  if (!coordinates) {
    return []
  }

  return [
    {
      coordinates,
      id: item.id,
      postcode: item.postcode,
      huisnummer: item.huis_nlt,
      woonplaats: item.woonplaatsnaam,
      openbare_ruimte: item.straatnaam,
      weergave_naam: item.weergavenaam,
    },
  ]
}

const mapHectometerSuggestDocToAddress = (
  item: HectometerSuggestDoc
): Address[] => {
  const coordinates = getPointCoordinates(item.centroide_ll)

  const displayName = formatHectometerDisplayName(item.weergavenaam)

  if (!coordinates) {
    return []
  }

  return [
    {
      coordinates,
      id: item.id,
      postcode: '',
      huisnummer: '',
      woonplaats: '',
      openbare_ruimte: displayName,
      weergave_naam: displayName,
    },
  ]
}

const mapRoadSuggestDocToAddress = (item: RoadSuggestDoc): Address[] => {
  const coordinates = getPointCoordinates(item.centroide_ll)

  if (!coordinates) {
    return []
  }

  return [
    {
      coordinates,
      id: item.id,
      postcode: '',
      huisnummer: '',
      woonplaats: '',
      openbare_ruimte: item.straatnaam,
      weergave_naam: item.weergavenaam,
    },
  ]
}

const getLocationSearchBounds = (config: AppConfig) =>
  config.base.pdok_hectometer_suggest?.bounds ?? config.base.map.maxBounds

const getHectometerSourceLayerId = (config: AppConfig) => {
  const sourceLayerId = config.base.pdok_hectometer_suggest?.sourceLayerId

  if (!sourceLayerId) {
    return undefined
  }

  const hasGeoJsonSource = config.base.map.layers?.some(
    (layer) =>
      layer.id === sourceLayerId &&
      layer.source.type === 'geojson' &&
      typeof layer.source.data === 'string'
  )

  return hasGeoJsonSource ? sourceLayerId : undefined
}

const getHectometerSuggestionOptions = async (
  searchQuery: string,
  config: AppConfig,
  signal: AbortSignal
): Promise<Address[]> => {
  const normalizedSearchQuery = normalizeHectometerSearchQuery(searchQuery)
  const provincialSourceLayerId = getHectometerSourceLayerId(config)

  if (provincialSourceLayerId) {
    return getSuggestedProvincialHectometerPosts(
      normalizedSearchQuery,
      provincialSourceLayerId,
      config.base.pdok_hectometer_suggest?.maxResults,
      signal
    )
  }

  const restrictToProvincialRoads =
    config.base.pdok_address_suggest.scope === PdokAddressSuggestScope.Provincie
  const options = {
    bounds: getLocationSearchBounds(config),
    roadNumberPrefix: restrictToProvincialRoads ? 'N' : undefined,
    roadNumberExceptions: restrictToProvincialRoads
      ? config.base.pdok_hectometer_suggest?.roadNumberExceptions
      : undefined,
  }

  const apiCall = await getSuggestedHectometerPosts(
    normalizedSearchQuery,
    config.pdokUrlApi,
    options,
    signal
  )

  return apiCall.response.docs.flatMap(mapHectometerSuggestDocToAddress)
}

const getSuggestionOptions = async (
  searchType: SearchType,
  searchQuery: string,
  config: AppConfig,
  signal: AbortSignal
): Promise<Address[]> => {
  if (searchType === SearchType.HectometerAndRoad) {
    const { scope, organization } = config.base.pdok_address_suggest
    const roadRequest = getSuggestedRoads(
      searchQuery,
      scope,
      organization,
      config.pdokUrlApi,
      { bounds: getLocationSearchBounds(config) },
      signal
    )

    const results = await Promise.allSettled([
      getHectometerSuggestionOptions(searchQuery, config, signal),
      roadRequest.then((response) =>
        response.response.docs.flatMap(mapRoadSuggestDocToAddress)
      ),
    ])

    if (results.every((result) => result.status === 'rejected')) {
      throw new Error('Could not fetch location suggestions.')
    }

    return results.flatMap((result) =>
      result.status === 'fulfilled' ? result.value : []
    )
  }

  const { scope, organization } = config.base.pdok_address_suggest
  const apiCall = await getSuggestedAddresses(
    searchQuery,
    scope,
    organization,
    config.pdokUrlApi,
    signal
  )

  return apiCall.response.docs.flatMap(mapAddressSuggestDocToAddress)
}

export const AddressCombobox = ({
  updatePosition,
  setIsMapSelected,
  mobileView = false,
  id,
  ariaDescribedBy,
  ariaInvalid,
  searchType = SearchType.Address,
  validateSelection,
  placeholder,
  className,
}: AddressComboboxProps) => {
  const [query, setQuery] = useState('')
  const config = useConfig()
  const [addressOptions, setAddressOptions] = useState<Address[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [searchSelection, setSearchSelection] = useState<{
    result: Address
    address: Address | null
    coordinates: number[]
  } | null>(null)
  const [selectionError, setSelectionError] = useState(false)
  const selectionRequest = useRef(0)
  const { formState, updateForm } = useFormStore()
  const tAddress = useTranslations('describe_add.address')
  const tMap = useTranslations('describe_add.map')

  useEffect(
    () => () => {
      selectionRequest.current += 1
    },
    []
  )

  const navigationSelection =
    searchSelection?.address === formState.address &&
    searchSelection?.coordinates === formState.coordinates
      ? searchSelection.result
      : null

  const getDisplayValue = (address: Address | null) => {
    if (!address) {
      return ''
    }

    if (searchType === SearchType.HectometerAndRoad) {
      return address.weergave_naam ?? ''
    }

    return address.id.startsWith('hmp-') ? '' : (address.weergave_naam ?? '')
  }

  useEffect(() => {
    const normalizedQuery = normalizeQuery(query)

    if (normalizedQuery.length < 1) {
      setAddressOptions([])
      setLoading(false)
      return
    }

    const abortController = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      setLoading(true)

      try {
        const options = await getSuggestionOptions(
          searchType,
          normalizedQuery,
          config,
          abortController.signal
        )
        if (!abortController.signal.aborted) setAddressOptions(options)
      } catch {
        if (!abortController.signal.aborted) {
          setAddressOptions([])
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timeoutId)
      abortController.abort()
    }
  }, [config, query, searchType])

  const onChangeAddress = async (selectedAddress: Address | null) => {
    const requestId = ++selectionRequest.current
    setSelectionError(false)

    // A new search choice replaces the previous location, even while checking
    // its boundary. Navigation-only results must never leave a valid old pin.
    if (selectedAddress && searchType === SearchType.HectometerAndRoad) {
      updateForm({
        ...useFormStore.getState().formState,
        address: null,
        coordinates: [0, 0],
        selectedFeatures: [],
      })
      setIsMapSelected?.(false)
    }

    const selectionState = useFormStore.getState().formState
    if (selectedAddress && validateSelection) {
      let canSelect: boolean
      try {
        canSelect = await validateSelection(selectedAddress)
      } catch {
        if (requestId === selectionRequest.current) setSelectionError(true)
        return
      }
      const currentState = useFormStore.getState().formState
      if (
        requestId !== selectionRequest.current ||
        currentState.address !== selectionState.address ||
        currentState.coordinates !== selectionState.coordinates
      )
        return

      if (!canSelect) {
        if (searchType === SearchType.HectometerAndRoad) {
          setSearchSelection({
            result: selectedAddress,
            address: useFormStore.getState().formState.address,
            coordinates: useFormStore.getState().formState.coordinates,
          })
          updatePosition?.(
            selectedAddress.coordinates[1],
            selectedAddress.coordinates[0],
            false
          )
        }
        return
      }
    }

    setSearchSelection(null)

    if (selectedAddress) {
      updateForm({
        ...useFormStore.getState().formState,
        address: selectedAddress,
        coordinates: [
          selectedAddress.coordinates[1],
          selectedAddress.coordinates[0],
        ],
      })
    } else {
      updateForm({
        ...useFormStore.getState().formState,
        address: selectedAddress,
      })
    }

    if (selectedAddress && updatePosition) {
      updatePosition(
        selectedAddress.coordinates[1],
        selectedAddress.coordinates[0],
        true
      )
    }

    if (selectedAddress && setIsMapSelected) {
      setIsMapSelected(true)
    }
  }

  const inputLabel =
    searchType === SearchType.HectometerAndRoad
      ? tMap('search_location_label')
      : tMap('search_address_label')

  return (
    <>
      <Combobox
        value={navigationSelection ?? formState.address}
        onChange={onChangeAddress}
      >
        <ComboboxInput
          aria-label={inputLabel}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid || undefined}
          as={Textbox}
          displayValue={getDisplayValue}
          name={searchType === SearchType.Address ? 'address' : 'hectometer'}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          id={id}
          placeholder={placeholder}
          className={cn(className, { mobile: mobileView })}
        />
        {!loading && (
          <ComboboxOptions
            as={Listbox}
            anchor="bottom"
            className={cn(
              'z-[9999] [--utrecht-listbox-inline-size:var(--input-width)]',
              {
                'map-location-search-options':
                  searchType === SearchType.HectometerAndRoad,
              }
            )}
          >
            {addressOptions.length > 0 ? (
              addressOptions.map((address) => (
                <ComboboxOption as={Fragment} key={address.id} value={address}>
                  {({ focus }) => (
                    <ListboxOption active={focus}>
                      {address.weergave_naam}
                    </ListboxOption>
                  )}
                </ComboboxOption>
              ))
            ) : (
              <ComboboxOption value={null} as={ListboxOption} disabled>
                <StatusText>
                  {searchType === SearchType.HectometerAndRoad
                    ? tAddress('no_location_results')
                    : tAddress('no_results')}
                </StatusText>
              </ComboboxOption>
            )}
          </ComboboxOptions>
        )}
      </Combobox>
      {selectionError && (
        <AlertText>{tMap('search_selection_error')}</AlertText>
      )}
      {!selectionError && navigationSelection && (
        <StatusText>{tMap('search_result_outside_area')}</StatusText>
      )}
    </>
  )
}
