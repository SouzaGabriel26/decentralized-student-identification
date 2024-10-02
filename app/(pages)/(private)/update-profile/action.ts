'use server';

import { createUserRepository } from '@/repositories/userRepository';
import { lambda } from '@/services/lambda';
import { createUpdatePendingDataUseCase } from '@/useCases/updatePendingDataUseCase';
import { revalidatePath } from 'next/cache';

export async function tryToUpdateUserPendingDataAction(
  _state: unknown,
  formData: FormData,
) {
  const userRepository = createUserRepository();
  const { updatePendingDataUseCase } =
    createUpdatePendingDataUseCase(userRepository);

  type FormData = {
    pendingDataId: string;
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

  const { userId, pendingDataId, ...data } = Object.fromEntries(
    formData.entries(),
  ) as FormData;

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
    id: pendingDataId,
    dataToUpdate,
  });

  if (response.data) {
    await userRepository.updateStatus(userId, 'PENDING');
  }

  revalidatePath('/update-profile');

  return response;
}
