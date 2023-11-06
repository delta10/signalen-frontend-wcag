"use client";

import * as Select from '@radix-ui/react-select';
import React from "react";

type SelectProps = {
  values: Array<string>
} & React.SelectHTMLAttributes<typeof HTMLSelectElement>

export default function S({ values, ...props }: SelectProps) {
  return (
    <Select.Root>
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
