'use server';

import { createUserRepository } from '@/repositories/userRepository';
import { cryptography } from '@/services/cryptography';
import { lambda } from '@/services/lambda';
import { forgotPrivateKeyUseCase } from '@/useCases/forgotPrivateKeyUseCase';
import { updatePendingDataUseCase } from '@/useCases/updatePendingDataUseCase';
import { revalidatePath } from 'next/cache';
import { ZodIssue } from 'zod';

type EditUserRegisterFormProps = {
  pendingDataId?: string;
  password?: string;
  userStatus: 'REJECTED' | 'FORGOT_PK';
  userId: string;
  cpf: string;
  cep: string;
  address: string;
  number: string;
  complement: string;
  course: string;
  photoUrl: string;
  photo?: File;
  name: string;
  email: string;
};

type ActionResponse = {
  data: {
    message: string;
    privateKey?: string;
  } | null;
  errors: ZodIssue[] | null;
};

export async function editUserRegisterFormAction(
  _state: unknown,
  formData: FormData,
): Promise<ActionResponse> {
  const editRegisterInput = Object.fromEntries(
    formData.entries(),
  ) as EditUserRegisterFormProps;

  if (editRegisterInput.userStatus === 'REJECTED') {
    return await updateRejectedPendingDataAction(editRegisterInput);
  }

  return await forgotPrivateKeyAction(editRegisterInput);
}

async function updateRejectedPendingDataAction(
  input: EditUserRegisterFormProps,
) {
  const userRepository = createUserRepository();

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

  const response = await updatePendingDataUseCase(userRepository, {
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
  const userRepository = createUserRepository();

  const result = await forgotPrivateKeyUseCase(
    userRepository,
    lambda,
    cryptography,
    {
      userId: input.userId,
      password: input.password!,
      newData: {
        address: input.address,
        cep: input.cep,
        complement: input.complement,
        cpf: input.cpf,
        course: input.course,
        number: input.number,
        photo: input.photo!,
        email: input.email,
        name: input.name,
      },
    },
  );

  return result;
}
