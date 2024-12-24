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
import { useConfig } from '@/hooks/useConfig'
import { getSuggestedAddresses } from '@/services/location/address'
import { Listbox, ListboxOption, StatusText, Textbox } from '@/components/index'
// Import the Select Combobox component for the side-effects of injecting CSS
// for related components, such as Textbox and Listbox.
import '@utrecht/select-combobox-react/dist/css'
import { useFormStore } from '@/store/form_store'
import { Address } from '@/types/form'
import { useTranslations } from 'next-intl'

type AddressComboboxProps = {
  updatePosition?: (lat: number, lng: number, flyTo?: boolean) => void
  setIsMapSelected?: Dispatch<SetStateAction<boolean | null>>
}

export const AddressCombobox = ({
  updatePosition,
  setIsMapSelected,
}: AddressComboboxProps) => {
  const [query, setQuery] = useState('')
  const { config } = useConfig()
  const [addressOptions, setAddressOptions] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { formState, updateForm } = useFormStore()
  const t = useTranslations('describe_add.address')

  const parsePoint = (str: string): [number, number] | undefined => {
    const match = /POINT\((\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\)/i.exec(str)

    if (match) {
      return [parseFloat(match[1]), parseFloat(match[2])]
    }
  }

  const normalizeQuery = (str: string) => str.trim().replace(/\s+/, ' ')

  useEffect(() => {
    const municipality = config ? config.base.municipality : ''
    const normalizedQuery = normalizeQuery(query)

    const getAddressOptions = async () => {
      if (query.length >= 1) {
        setLoading(true)
        const apiCall = await getSuggestedAddresses(
          normalizedQuery,
          municipality
        )

        const options = apiCall.response.docs.map((item) => ({
          coordinates: parsePoint(item.centroide_ll),
          id: item.id,
          postcode: item.postcode,
          huisnummer: item.huis_nlt,
          woonplaats: item.woonplaatsnaam,
          openbare_ruimte: item.straatnaam,
          weergave_naam: item.weergavenaam,
        }))

        setAddressOptions(options)
        setLoading(false)
        return
      }

      setAddressOptions([])
    }

    getAddressOptions()
  }, [config, query])

  const onChangeAddress = (selectedAddress: Address) => {
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
        aria-label="Adres"
        as={Textbox}
        displayValue={(address: any) => address?.weergave_naam}
        name="address"
        onChange={(event) => setQuery(event.target.value)}
        autoComplete="off"
      />
      {!loading && (
        <ComboboxOptions as={Listbox} anchor="bottom" className="z-[9999]">
          <div>
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
              <ComboboxOption value="" as={ListboxOption} disabled>
                <StatusText>{t('no_results')}</StatusText>
              </ComboboxOption>
            )}
          </div>
        </ComboboxOptions>
      )}
    </Combobox>
  )
}
