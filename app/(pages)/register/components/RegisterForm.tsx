'use client';

import { tryToRegisterUserAction } from '@/app/(pages)/register/action';
import { CustomInput } from '@/app/components/CustomInput';
import { CustomSelect } from '@/app/components/CustomSelect';
import { Box, Button, Text } from '@primer/react';
import { useFormState } from 'react-dom';

export function RegisterForm() {
  const [state, action] = useFormState(tryToRegisterUserAction, null);

  function getErrorMessage(path: string) {
    return state?.errors.find((error) => error.path.includes(path))?.message;
  }

  return (
    <form
      action={action}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          '@media (max-width: 480px)': {
            flexDirection: 'column',
          },
        }}
      >
        <CustomInput
          label="Nome"
          name="name"
          required
          error={getErrorMessage('name')}
        />
        <CustomInput
          label="Email"
          type="email"
          name="email"
          required
          error={getErrorMessage('email')}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          '@media (max-width: 480px)': {
            flexDirection: 'column',
          },
        }}
      >
        <CustomInput
          label="Senha"
          name="password"
          type="password"
          required
          error={getErrorMessage('password')}
        />
        <CustomInput
          label="Confirmar Senha"
          name="confirm_password"
          type="password"
          required
          error={getErrorMessage('confirm_password')}
        />
      </Box>

      <Text
        sx={{
          mt: 2,
        }}
      >
        Sobre o aluno:
      </Text>

      <CustomInput
        label="CPF"
        name="cpf"
        type="number"
        required
        error={getErrorMessage('cpf')}
      />
      <CustomInput
        label="Cep"
        name="cep"
        type="number"
        required
        error={getErrorMessage('cep')}
      />
      <CustomInput
        label="Endereço"
        name="address"
        required
        error={getErrorMessage('address')}
      />
      <CustomInput
        label="Número"
        name="number"
        required
        error={getErrorMessage('number')}
      />
      <CustomInput
        label="Complemento"
        name="complement"
        error={getErrorMessage('complement')}
      />

      <label
        htmlFor="course"
        style={{ fontWeight: 'bold', cursor: 'pointer', fontSize: 14 }}
      >
        Curso desejado
      </label>
      <CustomSelect
        id="course"
        name="course"
        required
        options={[
          { value: '', label: '' },
          { value: 'ciencia-da-computacao', label: 'Ciência da Computação' },
          {
            value: 'engenharia-de-software',
            label: 'Engenharia de Software',
          },
          {
            value: 'sistemas-de-informacao',
            label: 'Sistemas de Informação',
          },
        ]}
      />

      <label
        htmlFor="photo"
        style={{ fontWeight: 'bold', cursor: 'pointer', fontSize: 14 }}
      >
        Foto do aluno
      </label>
      <input
        type="file"
        name="photo"
        id="photo"
        accept="image/png, image/jpg, image/jpeg"
        required
      />

      <Button
        variant="primary"
        type="submit"
        sx={{
          mt: 2,
        }}
      >
        Enviar solicitação de matrícula
      </Button>
    </form>
  );
}
