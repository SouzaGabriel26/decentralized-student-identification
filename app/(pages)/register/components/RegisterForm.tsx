'use client';

import { tryToRegisterUserAction } from '@/app/(pages)/register/action';
import { CustomInput } from '@/app/components/CustomInput';
import { CustomSelect } from '@/app/components/CustomSelect';
import { LoadingButton } from '@/app/components/LoadingButton';
import { courses } from '@/utils/courses';
import { Box, Text } from '@primer/react';
import { useFormState } from 'react-dom';
import { Instructions } from '../../../components/Instructions';

export function RegisterForm() {
  const [state, action] = useFormState(tryToRegisterUserAction, null);

  function getErrorMessage(path: string) {
    return state?.errors?.find((error) => error.path.includes(path))?.message;
  }

  if (state?.data) {
    return <Instructions data={state.data} type="register" />;
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
        overflowY: 'auto',
        paddingTop: 16,
        paddingBottom: 16,
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
          mt: 2,
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

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mt: 2,
        }}
      >
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

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Text
            as="label"
            htmlFor="course"
            sx={{
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: 14,
              '@media (max-width: 480px)': {
                fontSize: 12,
              },
            }}
          >
            Curso desejado
          </Text>
          <CustomSelect id="course" name="course" required options={courses} />
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Text
            as="label"
            htmlFor="photo"
            sx={{
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: 14,
              '@media (max-width: 480px)': {
                fontSize: 12,
              },
            }}
          >
            Foto do aluno
          </Text>
          <input
            type="file"
            name="photo"
            id="photo"
            accept="image/png, image/jpg, image/jpeg"
            required
          />
        </Box>
      </Box>

      <LoadingButton>Solicitar Matrícula</LoadingButton>
    </form>
  );
}
