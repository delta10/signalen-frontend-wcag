"use client";

import * as Select from '@radix-ui/react-select';
import React from "react";

type SelectProps = {
  values: Array<string>,
  onSelectChange: (value: string) => void,
} & React.SelectHTMLAttributes<typeof HTMLSelectElement>

export default function S({ values, onSelectChange, disabled, ...props }: SelectProps) {
  return (
    <Select.Root onValueChange={onSelectChange} disabled={disabled}>
      <Select.Trigger>
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>

      <Select.Portal>
        <Select.Content>
          <Select.ScrollUpButton />
          <Select.Viewport>
            <Select.Group>
              {values.map((value) =>
                <Select.Item key={value} value={value}>{value}</Select.Item>
              )}
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton />
          <Select.Arrow />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

export { S as Select };
