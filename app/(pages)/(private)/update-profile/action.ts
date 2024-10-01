'use server';

import { createUserRepository } from '@/repositories/userRepository';
import { lambda as lambdaService } from '@/services/lambda';
import {
  createEditPendingDataUseCase,
  EditPendingDataUseCaseInput,
} from '@/useCases/editPendingDataUseCase';
import { revalidatePath } from 'next/cache';

export async function tryToUpdateUserPendingDataAction(
  _state: unknown,
  formData: FormData,
) {
  const userRepository = createUserRepository();
  const { editPendingDataUseCase } = createEditPendingDataUseCase(
    lambdaService,
    userRepository,
  );

  const data = Object.fromEntries(
    formData.entries(),
  ) as EditPendingDataUseCaseInput & {
    userId: string;
  };

  const response = await editPendingDataUseCase(data);
  if (response.data) {
    await userRepository.updateStatus(data.userId, 'PENDING');
  }

  revalidatePath('/update-profile');

  return response;
}
