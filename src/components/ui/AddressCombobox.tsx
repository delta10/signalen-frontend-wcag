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
} from 'react'
import { useConfig } from '@/contexts/ConfigContext'
import {
  getSuggestedAddresses,
  getSuggestedHectometerPosts,
} from '@/services/location/address'
import { Listbox, ListboxOption, StatusText, Textbox } from '@/components/index'
// Import the Select Combobox component for the side-effects of injecting CSS
// for related components, such as Textbox and Listbox.
import '@utrecht/select-combobox-react/dist/css'
import { useFormStore } from '@/store/form_store'
import { Address } from '@/types/form'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils/style'
import { AddressSuggestDoc, HectometerSuggestDoc } from '@/types/pdok'
import { AppConfig } from '@/types/config'
import { getPointCoordinates } from '@/lib/utils/map'

export enum SearchType {
  Address = 'address',
  Hectometer = 'hectometer',
}

type AddressComboboxProps = {
  updatePosition?: (lat: number, lng: number, flyTo?: boolean) => void
  setIsMapSelected?: Dispatch<SetStateAction<boolean | null>>
  mobileView?: boolean
  id?: string
  searchType?: SearchType
  validateSelection?: (selectedAddress: Address) => boolean | Promise<boolean>
}

const normalizeQuery = (str: string) => str.trim().replace(/\s+/g, ' ')

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
      openbare_ruimte: item.wegnummer,
      weergave_naam: item.weergavenaam,
    },
  ]
}

const getHectometerBounds = (config: AppConfig) =>
  config.base.pdok_hectometer_suggest?.bounds ?? config.base.map.maxBounds

const getSuggestionOptions = async (
  searchType: SearchType,
  searchQuery: string,
  config: AppConfig
): Promise<Address[]> => {
  if (searchType === SearchType.Hectometer) {
    const apiCall = await getSuggestedHectometerPosts(
      searchQuery,
      config.pdokUrlApi,
      getHectometerBounds(config)
    )

    return apiCall.response.docs.flatMap(mapHectometerSuggestDocToAddress)
  }

  const { scope, organization } = config.base.pdok_address_suggest
  const apiCall = await getSuggestedAddresses(
    searchQuery,
    scope,
    organization,
    config.pdokUrlApi
  )

  return apiCall.response.docs.flatMap(mapAddressSuggestDocToAddress)
}

export const AddressCombobox = ({
  updatePosition,
  setIsMapSelected,
  mobileView = false,
  id,
  searchType = SearchType.Address,
  validateSelection,
}: AddressComboboxProps) => {
  const [query, setQuery] = useState('')
  const config = useConfig()
  const [addressOptions, setAddressOptions] = useState<Address[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { formState, updateForm } = useFormStore()
  const tAddress = useTranslations('describe_add.address')
  const tMap = useTranslations('describe_add.map')

  const getDisplayValue = (address: Address | null) => {
    if (!address) {
      return ''
    }

    if (searchType === SearchType.Hectometer) {
      return address.id.startsWith('hmp-') ? (address.weergave_naam ?? '') : ''
    }

    return address.id.startsWith('hmp-') ? '' : (address.weergave_naam ?? '')
  }

  useEffect(() => {
    const normalizedQuery = normalizeQuery(query)

    const getAddressOptions = async () => {
      if (normalizedQuery.length < 1) {
        setAddressOptions([])
        return
      }

      setLoading(true)

      try {
        const options = await getSuggestionOptions(
          searchType,
          normalizedQuery,
          config
        )
        setAddressOptions(options)
      } catch {
        setAddressOptions([])
      } finally {
        setLoading(false)
      }
    }

    getAddressOptions()
  }, [config, query, searchType])

  const onChangeAddress = async (selectedAddress: Address | null) => {
    if (
      selectedAddress &&
      validateSelection &&
      !(await validateSelection(selectedAddress))
    ) {
      return
    }

    if (selectedAddress) {
      updateForm({
        ...formState,
        address: selectedAddress,
        coordinates: selectedAddress && [
          selectedAddress.coordinates[1],
          selectedAddress.coordinates[0],
        ],
      })
    } else {
      updateForm({
        ...formState,
        address: selectedAddress,
      })
    }

    if (selectedAddress && updatePosition) {
      updatePosition(
        selectedAddress.coordinates[1],
        selectedAddress.coordinates[0]
      )
    }

    if (setIsMapSelected) {
      setIsMapSelected(true)
    }
  }

  return (
    <Combobox value={formState.address} onChange={onChangeAddress}>
      <ComboboxInput
        aria-label={
          searchType === SearchType.Hectometer
            ? tMap('search_hectometer_label')
            : 'Adres'
        }
        as={Textbox}
        displayValue={getDisplayValue}
        name={searchType === SearchType.Hectometer ? 'hectometer' : 'address'}
        onChange={(event) => setQuery(event.target.value)}
        autoComplete="off"
        id={id}
        className={cn({
          mobile: mobileView,
        })}
      />
      {!loading && (
        <ComboboxOptions
          as={Listbox}
          anchor="bottom"
          className="z-[9999] [--utrecht-listbox-inline-size:var(--input-width)]"
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
                {searchType === SearchType.Hectometer
                  ? tAddress('no_hectometer_results')
                  : tAddress('no_results')}
              </StatusText>
            </ComboboxOption>
          )}
        </ComboboxOptions>
      )}
    </Combobox>
  )
}
