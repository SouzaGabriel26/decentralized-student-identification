'use client';

import { Select, SelectProps } from '@primer/react';

type CustomSelectProps = SelectProps & {
  options: Array<{
    value: string;
    label: string;
  }>;
};

export function CustomSelect({ options, ...props }: CustomSelectProps) {
  return (
    <Select {...props}>
      {options.map((option) => (
        <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>
      ))}
    </Select>
  );
}
