'use client';

import { tryToLoginAction } from '@/app/(pages)/login/action';
import { CustomInput } from '@/app/components/CustomInput';
import { LoadingButton } from '@/app/components/LoadingButton';
import { useFormState } from 'react-dom';

export function LoginForm() {
  const [state, action] = useFormState(tryToLoginAction, null);

  function getErrorMessage(path: string) {
    return state?.errors?.find((error) => error.path.includes(path))?.message;
  }

  return (
    <form
      action={action}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxWidth: 400,
        width: '100%',
      }}
    >
      <CustomInput
        label="Email"
        name="email"
        type="email"
        error={getErrorMessage('email')}
      />
      <CustomInput
        label="Senha"
        name="password"
        type="password"
        error={getErrorMessage('password')}
      />

      <LoadingButton>Entrar</LoadingButton>
    </form>
  );
}
