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

  console.log({ required });

  return (
    <FormControl
      id={inputId}
      sx={{
        width: '100%',
      }}
      required={required}
    >
      <FormControl.Label>{label}</FormControl.Label>
      <TextInput name={name} block {...props} />
      {error && (
        <FormControl.Validation variant="error">{error}</FormControl.Validation>
      )}
    </FormControl>
  );
}
