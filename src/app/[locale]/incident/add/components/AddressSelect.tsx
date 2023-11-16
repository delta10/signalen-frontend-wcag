import Select, {
  DropdownIndicatorProps,
  components,
  IndicatorSeparatorProps,
} from 'react-select'
import React from 'react'
import { TbSearch } from 'react-icons/tb'

const options = [
  { value: 'eikenboomstraat', label: 'eikenboomstraat' },
  { value: 'dennenboom', label: 'dennenboomstraat' },
  { value: 'beukenboomstraat', label: 'beukenboomstraat' },
  { value: 'sparrenboomstraat', label: 'sparrenboomstraat' },
  { value: 'acaciaboomstraat', label: 'acaciaboomstraat' },
]

const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      <TbSearch />
    </components.DropdownIndicator>
  )
}

const IndicatorSeparator = () => {
  return null
}

const AddressSelect = () => {
  return (
    <Select
      options={options}
      components={{ DropdownIndicator, IndicatorSeparator }}
      placeholder="Zoek naar adres"
      unstyled={true}
      classNames={{
        control: () => 'address__select',
        menu: () => 'address__select-menu',
        option: (state) =>
          `address__select-option ${
            state.isSelected && 'address__select-option__selected'
          } ${
            !state.isSelected &&
            state.isFocused &&
            'address__select-option__focused'
          }
          `,
      }}
    />
  )
}

export { AddressSelect }
