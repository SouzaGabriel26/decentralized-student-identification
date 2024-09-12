'use client';

import { Button, ButtonProps } from '@primer/react';
import { useFormStatus } from 'react-dom';

type LoadingButtonProps = ButtonProps;

export function LoadingButton({ ...props }: LoadingButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      loading={pending}
      variant="primary"
      type="submit"
      sx={{
        mt: 2,
        width: '100%',
      }}
      {...props}
    />
  );
}
