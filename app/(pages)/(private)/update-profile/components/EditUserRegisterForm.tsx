'use client';

import { CustomInput } from '@/app/components/CustomInput';
import { CustomSelect } from '@/app/components/CustomSelect';
import { LoadingButton } from '@/app/components/LoadingButton';
import { Avatar, Text } from '@primer/react';
import { UserPendingData } from '@prisma/client';
import { useFormState } from 'react-dom';
import { tryToUpdateUserPendingDataAction } from '../action';

type EditUserRegisterFormProps = {
  userPendingData: UserPendingData | null;
};

export function EditUserRegisterForm({
  userPendingData,
}: EditUserRegisterFormProps) {
  const [state, action] = useFormState(tryToUpdateUserPendingDataAction, null);

  function getErrorMessage(path: string) {
    return state?.errors?.find((error) => error.path.includes(path))?.message;
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
      {userPendingData?.photoUrl && (
        <Avatar
          sx={{
            width: 50,
            height: 50,
          }}
          src={userPendingData.photoUrl}
          alt="Foto do aluno"
        />
      )}
      <Text
        sx={{
          mb: 2,
        }}
      >
        Sobre o aluno: {userPendingData?.name}
        <br />
        email: {userPendingData?.email}
      </Text>

      <input
        name="pendingDataId"
        type="hidden"
        defaultValue={userPendingData!.id}
      />
      <input
        name="userId"
        type="hidden"
        defaultValue={userPendingData!.userId}
      />
      <input
        name="photoUrl"
        type="hidden"
        defaultValue={userPendingData!.photoUrl}
      />

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
        type="file"
        name="photo"
        id="photo"
        accept="image/png, image/jpg, image/jpeg"
      />

      <LoadingButton>
        Atualizar dados e solicitar matrícula novamente
      </LoadingButton>
    </form>
  );
}
