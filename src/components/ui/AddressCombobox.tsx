import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useConfig } from '@/hooks/useConfig'
import { getSuggestedAddresses } from '@/services/location/address'
import { AddressComboboxValue } from '@/types/map'

type AddressComboboxProps = {
  address: AddressComboboxValue
  setSelectedAddress: Dispatch<SetStateAction<AddressComboboxValue>>
}

export const AddressCombobox = ({
  address,
  setSelectedAddress,
}: AddressComboboxProps) => {
  const [query, setQuery] = useState('')
  const { config } = useConfig()
  const [addressOptions, setAddressOptions] = useState<any[]>([])

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
          name: item.weergavenaam,
          coordinates: parsePoint(item.centroide_ll),
          id: item.id,
        }))

        setAddressOptions(options)

        return
      }

      setAddressOptions([])
    }

    getAddressOptions()
  }, [query])

  return (
    <Combobox
      value={address}
      onChange={setSelectedAddress}
      onClose={() => setQuery('')}
    >
      <ComboboxInput
        aria-label="Adres"
        displayValue={(address: any) => address?.name}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ComboboxOptions
        anchor="bottom"
        className="border empty:invisible z-[1000]"
      >
        {addressOptions.map((address) => (
          <ComboboxOption
            key={address.id}
            value={address}
            className="group flex gap-2 bg-white data-[focus]:bg-blue-100"
          >
            {address.name}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  )
}
