'use client';

import { tryToRegisterUserAction } from '@/app/(pages)/register/action';
import { CustomInput } from '@/app/components/CustomInput';
import { CustomSelect } from '@/app/components/CustomSelect';
import { CopyIcon } from '@primer/octicons-react';
import { Box, Button, Flash, Text } from '@primer/react';
import { useFormState, useFormStatus } from 'react-dom';

export function RegisterForm() {
  const [state, action] = useFormState(tryToRegisterUserAction, null);
  const { pending } = useFormStatus();

  function getErrorMessage(path: string) {
    return state?.errors?.find((error) => error.path.includes(path))?.message;
  }

  if (state?.data) {
    // TODO: improve this message and add functionality
    return (
      <Flash
        sx={{
          maxWidth: 500,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        variant="warning"
        title={'Solicitação de matrícula enviada com sucesso!'}
      >
        <p>{state.data.message}</p>
        <p>
          Por enquanto, é muito importante que você guarde a sua chave privada
          em um local seguro. Importante também não mostrar para ninguém.
        </p>
        <span>
          Clique aqui <CopyIcon /> para copiar sua chave privada.
        </span>
        <Button
          variant="primary"
          sx={{
            mt: 4,
            display: 'flex',
            width: '100%',
          }}
        >
          Logar na conta
        </Button>
      </Flash>
    );
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
        type="number"
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
        disabled={pending}
        loading={pending}
        variant="primary"
        type="submit"
        sx={{
          mt: 2,
          width: '100%',
        }}
      >
        Enviar solicitação de matrícula
      </Button>
    </form>
  );
}
