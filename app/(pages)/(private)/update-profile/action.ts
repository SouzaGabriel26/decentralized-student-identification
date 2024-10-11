'use server';

import { createUserRepository } from '@/repositories/userRepository';
import { lambda } from '@/services/lambda';
import { createUpdatePendingDataUseCase } from '@/useCases/updatePendingDataUseCase';
import { revalidatePath } from 'next/cache';

type EditUserRegisterFormProps = {
  pendingDataId?: string;
  userId: string;
  cpf: string;
  cep: string;
  address: string;
  number: string;
  complement: string;
  course: string;
  photoUrl: string;
  photo?: File;
};

export async function editUserRegisterFormAction(
  _state: unknown,
  formData: FormData,
) {
  const editRegisterInput = Object.fromEntries(
    formData.entries(),
  ) as EditUserRegisterFormProps;

  if (editRegisterInput.pendingDataId) {
    return await updateRejectedPendingDataAction(editRegisterInput);
  }

  return await forgotPrivateKeyAction(editRegisterInput);
}

async function updateRejectedPendingDataAction(
  input: EditUserRegisterFormProps,
) {
  const userRepository = createUserRepository();
  const { updatePendingDataUseCase } =
    createUpdatePendingDataUseCase(userRepository);

  const { userId, pendingDataId, ...data } = input;

  const dataToUpdate = {
    cpf: data.cpf,
    cep: data.cep,
    address: data.address,
    number: data.number,
    complement: data.complement,
    course: data.course,
    photoUrl: data.photoUrl,
  };

  if (data.photo && data.photo.size > 0) {
    const { file_url } = await lambda.uploadFile(data.photo);
    dataToUpdate.photoUrl = file_url;
  }

  const response = await updatePendingDataUseCase({
    id: pendingDataId!,
    dataToUpdate,
  });

  if (response.data) {
    await userRepository.updateStatus(userId, 'PENDING');
  }

  revalidatePath('/update-profile');

  return response;
}

async function forgotPrivateKeyAction(input: EditUserRegisterFormProps) {
  console.log(input);

  return {
    errors: null,
    data: {
      message: 'Alguma coisa',
    },
  };
}
