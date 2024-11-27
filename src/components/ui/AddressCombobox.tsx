import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useConfig } from '@/hooks/useConfig'
import { getSuggestedAddresses } from '@/services/location/address'

// Import the Select Combobox component for the side-effects of injecting CSS
// for related components, such as Textbox and Listbox.
import '@utrecht/select-combobox-react/dist/css'
import { useFormStore } from '@/store/form_store'
import { Address } from '@/types/form'

type AddressComboboxProps = {
  updatePosition?: (lat: number, lng: number, flyTo?: boolean) => void
  setIsMapSelected?: Dispatch<SetStateAction<boolean>>
}

export const AddressCombobox = ({
  updatePosition,
  setIsMapSelected,
}: AddressComboboxProps) => {
  const [query, setQuery] = useState('')
  const { config } = useConfig()
  const [addressOptions, setAddressOptions] = useState<any[]>([])
  const { formState, updateForm } = useFormStore()

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

        return
      }

      setAddressOptions([])
    }

    getAddressOptions()
  }, [query])

  const onChangeAddress = (selectedAddress: Address) => {
    if (selectedAddress && updatePosition) {
      updatePosition(
        selectedAddress.coordinates[1],
        selectedAddress.coordinates[0]
      )
    }

    updateForm({
      ...formState,
      address: selectedAddress,
      coordinates: [
        selectedAddress.coordinates[1],
        selectedAddress.coordinates[0],
      ],
    })

    if (setIsMapSelected) {
      setIsMapSelected(true)
    }
  }

  return (
    <Combobox
      value={formState.address}
      onChange={onChangeAddress}
      onClose={() => setQuery('')}
    >
      <ComboboxInput
        aria-label="Adres"
        displayValue={(address: any) => address?.weergave_naam}
        onChange={(event) => setQuery(event.target.value)}
        className={'utrecht-textbox utrecht-textbox--html'}
        autoComplete={'off'}
      />
      <ComboboxOptions
        anchor="bottom"
        className="utrecht-listbox utrecht-listbox--html-div z-[1000]"
      >
        <div className={'utrecht-listbox__list'}>
          {addressOptions.map((address) => (
            <ComboboxOption
              key={address.id}
              value={address}
              className="utrecht-listbox__option data-[focus]:bg-blue-100"
            >
              {address.weergave_naam}
            </ComboboxOption>
          ))}
        </div>
      </ComboboxOptions>
    </Combobox>
  )
}
