'use client';

import { CustomInput } from '@/app/components/CustomInput';
import { CustomSelect } from '@/app/components/CustomSelect';
import { Instructions } from '@/app/components/Instructions';
import { LoadingButton } from '@/app/components/LoadingButton';
import { Avatar, Box, Label, Text } from '@primer/react';
import { UserPendingData } from '@prisma/client';
import { useFormState } from 'react-dom';
import { editUserRegisterFormAction } from '../action';

type EditUserRegisterFormProps = {
  userPendingData: UserPendingData | null;
  user: {
    id: string;
    name: string;
    email: string;
    status: 'FORGOT_PK' | 'REJECTED';
  };
};

export function EditUserRegisterForm({
  userPendingData,
  user,
}: EditUserRegisterFormProps) {
  const [state, action] = useFormState(editUserRegisterFormAction, null);

  function getErrorMessage(path: string) {
    return state?.errors?.find((error) => error.path.includes(path))?.message;
  }

  if (state?.data?.privateKey) {
    return (
      <Instructions
        data={{
          message: state.data.message,
          privateKey: state.data.privateKey,
          userName: user.name,
        }}
        type="forgotPrivateKey"
      />
    );
  }

  return (
    <>
      <Text as="h2">
        {user.status === 'FORGOT_PK'
          ? 'Preencha o formulário para realizar o processo de criação de uma nova carteira'
          : 'Preencha o formulário para atualizar seus dados e solicitar a matrícula novamente'}
      </Text>

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
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Text
              sx={{
                display: 'block',
              }}
            >
              Aluno(a): {userPendingData?.name ?? user.name}
              <br />
              Email: {userPendingData?.email ?? user.email}
            </Text>

            <Label
              size="large"
              variant={user.status === 'FORGOT_PK' ? 'attention' : 'danger'}
            >
              {user.status === 'FORGOT_PK' && 'Esqueceu a chave privada'}
              {user.status === 'REJECTED' && 'Solicitação rejeitada'}
            </Label>
          </Box>

          {userPendingData?.photoUrl && (
            <Avatar
              src={userPendingData.photoUrl}
              alt="Foto do aluno"
              sx={{ width: 70, height: 70, objectFit: 'cover' }}
            />
          )}
        </Box>

        <input name="name" type="hidden" defaultValue={user.name} />
        <input name="email" type="hidden" defaultValue={user.email} />
        <input name="userStatus" type="hidden" defaultValue={user.status} />

        <input
          name="pendingDataId"
          type="hidden"
          defaultValue={userPendingData?.id}
        />

        <input
          name="userId"
          type="hidden"
          defaultValue={userPendingData?.userId ?? user.id}
        />
        <input
          name="photoUrl"
          type="hidden"
          defaultValue={userPendingData?.photoUrl}
        />

        {user.status == 'FORGOT_PK' && (
          <CustomInput
            label="Senha"
            name="password"
            type="password"
            required
            error={getErrorMessage('password')}
          />
        )}

        <CustomInput
          label="CPF"
          name="cpf"
          type="number"
          required
          defaultValue={userPendingData?.cpf}
          error={getErrorMessage('cpf')}
        />
        <CustomInput
          label="Cep"
          name="cep"
          type="number"
          required
          defaultValue={userPendingData?.cep}
          error={getErrorMessage('cep')}
        />
        <CustomInput
          label="Endereço"
          name="address"
          required
          defaultValue={userPendingData?.address}
          error={getErrorMessage('address')}
        />
        <CustomInput
          label="Número"
          name="number"
          type="number"
          required
          defaultValue={userPendingData?.number}
          error={getErrorMessage('number')}
        />
        <CustomInput
          label="Complemento"
          name="complement"
          defaultValue={userPendingData?.complement ?? ''}
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
          defaultValue={userPendingData?.course}
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
          required={user.status === 'FORGOT_PK'}
          type="file"
          name="photo"
          id="photo"
          accept="image/png, image/jpg, image/jpeg"
        />

        <LoadingButton>
          Atualizar dados e solicitar matrícula novamente
        </LoadingButton>
      </form>
    </>
  );
}
