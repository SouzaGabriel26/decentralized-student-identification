'use client';

import { FormControl, TextInput, TextInputProps } from '@primer/react';

type CustomInputProps = TextInputProps & {
  name: string;
  label: string;
  error?: string;
};

export function CustomInput({
  name,
  label,
  id,
  required,
  error,
  ...props
}: CustomInputProps) {
  const inputId = id || name;

  return (
    <FormControl
      id={inputId}
      sx={{
        width: '100%',
        '@media (max-width: 480px)': {
          height: 50,
        },
      }}
      required={required}
    >
      <FormControl.Label
        sx={{
          '@media (max-width: 480px)': {
            fontSize: 12,
          },
        }}
      >
        {label}
      </FormControl.Label>
      <TextInput name={name} block {...props} />
      {error && (
        <FormControl.Validation variant="error">{error}</FormControl.Validation>
      )}
    </FormControl>
  );
}
