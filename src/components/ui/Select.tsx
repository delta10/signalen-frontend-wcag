'use client'

import * as Select from '@radix-ui/react-select'
import React from 'react'
import { TbChevronDown } from 'react-icons/tb'

type SelectProps = {
  value: string
  values: Array<string>
  onSelectChange: (value: string) => void
} & React.SelectHTMLAttributes<typeof HTMLSelectElement>

export default function S({
  value,
  values,
  onSelectChange,
  disabled,
  ...props
}: SelectProps) {
  // TODO: Add error / invalid state to Select Trigger
  return (
    <Select.Root onValueChange={onSelectChange} disabled={disabled}>
      <Select.Trigger
        aria-label="language switch"
        className={`flex transition duration-100 items-center gap-4 bg-white p-3 justify-between min-w-[150px] ring-1 ring-border hover:ring-2 hover:bg-hover focus:ring-2 focus:ring-focus outline-none focus-visible:outline-dashed focus-visible:outline-focus_visible ${
          disabled ? 'bg-hover text-border' : ''
        }`}
      >
        {value}
        <Select.Value />
        <Select.Icon>
          <TbChevronDown />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="bg-white mt-[1px] -ml-[1px] border-r border-b border-l border-border"
          position="popper"
        >
          <Select.Viewport className="h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]">
            <Select.Group>
              {values.map((value) => (
                <Select.Item
                  className="px-3 py-1 outline-none hover:bg-hover focus:bg-hover border-t-[0.5px] border-border first:border-t-0"
                  key={value}
                  value={value}
                >
                  {value}
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

export { S as Select }
