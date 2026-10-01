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
import { isValidHectometerDisplayName } from '@/lib/utils/hectometer'
import { isCoordinateOutsideRestrictedArea } from '@/lib/utils/restrictedAreaUtils'

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

  if (!coordinates || !isValidHectometerDisplayName(item.weergavenaam)) {
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

const getHectometerSuggestionOptions = async (
  searchQuery: string,
  config: AppConfig,
  signal: AbortSignal
): Promise<Address[]> => {
  const normalizedSearchQuery = normalizeHectometerSearchQuery(searchQuery)
  const restrictToProvincialRoads =
    config.base.pdok_address_suggest.scope === PdokAddressSuggestScope.Provincie
  const options = {
    bounds: config.base.pdok_hectometer_suggest?.bounds,
    maxResults: config.base.pdok_hectometer_suggest?.maxResults,
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

  const suggestions = apiCall.response.docs.flatMap(
    mapHectometerSuggestDocToAddress
  )
  if (!config.restrictSelectionArea) return suggestions

  const outside = await Promise.all(
    suggestions.map(({ coordinates: [lng, lat] }) =>
      isCoordinateOutsideRestrictedArea(config, lng, lat)
    )
  )
  return suggestions.filter((_, index) => !outside[index])
}

const getSuggestionOptions = async (
  searchType: SearchType,
  searchQuery: string,
  config: AppConfig,
  signal: AbortSignal
): Promise<Address[]> => {
  if (searchType === SearchType.HectometerAndRoad) {
    const { scope, organization } = config.base.pdok_address_suggest
    const results = await Promise.allSettled([
      getHectometerSuggestionOptions(searchQuery, config, signal),
      getSuggestedRoads(
        searchQuery,
        scope,
        organization,
        config.pdokUrlApi,
        {
          bounds:
            config.base.pdok_hectometer_suggest?.bounds ??
            config.base.map.maxBounds,
        },
        signal
      ).then((response) =>
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
  const [searchError, setSearchError] = useState(false)
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
  const navigationSelection =
    searchSelection?.address === formState.address &&
    searchSelection?.coordinates === formState.coordinates
      ? searchSelection.result
      : null

  useEffect(
    () => () => {
      selectionRequest.current += 1
    },
    []
  )

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
      setSearchError(false)
      return
    }

    const abortController = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      setLoading(true)
      setSearchError(false)

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
          setSearchError(true)
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
    const isLocationSearch = searchType === SearchType.HectometerAndRoad

    // A new search choice replaces the previous location while its boundary is checked.
    if (selectedAddress && isLocationSearch) {
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
        if (isLocationSearch) {
          setSearchSelection({
            result: selectedAddress,
            address: currentState.address,
            coordinates: currentState.coordinates,
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
    updateForm({
      ...useFormStore.getState().formState,
      address: selectedAddress,
      ...(selectedAddress
        ? {
            coordinates: [
              selectedAddress.coordinates[1],
              selectedAddress.coordinates[0],
            ],
          }
        : {}),
    })

    if (selectedAddress) {
      updatePosition?.(
        selectedAddress.coordinates[1],
        selectedAddress.coordinates[0]
      )
      setIsMapSelected?.(true)
    }
  }

  return (
    <>
      <Combobox
        value={navigationSelection ?? formState.address}
        onChange={onChangeAddress}
      >
        <ComboboxInput
          aria-label={
            searchType === SearchType.HectometerAndRoad
              ? tMap('search_location_label')
              : tMap('search_address_label')
          }
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid || undefined}
          as={Textbox}
          displayValue={getDisplayValue}
          name={
            searchType === SearchType.HectometerAndRoad
              ? 'hectometer'
              : 'address'
          }
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
            className="z-[9999] overflow-y-auto [--anchor-max-height:16rem] [--utrecht-listbox-inline-size:var(--input-width)]"
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
                {searchError ? (
                  <AlertText>{tMap('location_search_failed')}</AlertText>
                ) : (
                  <StatusText>
                    {searchType === SearchType.HectometerAndRoad
                      ? tAddress('no_location_results')
                      : tAddress('no_results')}
                  </StatusText>
                )}
              </ComboboxOption>
            )}
          </ComboboxOptions>
        )}
      </Combobox>
      {selectionError && <AlertText>{tMap('location_search_error')}</AlertText>}
      {!selectionError && navigationSelection && (
        <StatusText>{tMap('search_result_outside_area')}</StatusText>
      )}
    </>
  )
}
