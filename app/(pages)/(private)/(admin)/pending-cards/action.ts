'use server';

import { createUserRepository } from '@/repositories/userRepository';
import { cryptography } from '@/services/cryptography';
import { UserPendingData, UserStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function encryptUserPendingDataAction(
  userPendingData: UserPendingData,
) {
  const userRepository = createUserRepository();
  const user = await userRepository.findById(userPendingData.userId);
  if (!user)
    return {
      data: null,
      error: 'Falha ao encontrar usuário',
    };

  // if data is too big for unique encryption, split it in two parts
  const stringfiedData = JSON.stringify(userPendingData);
  if (stringfiedData.length >= 470) {
    const {
      id,
      userId,
      name,
      email,
      cpf,
      cep,
      address,
      complement,
      course,
      createdAt,
      number,
      photoUrl,
      registration,
      rejection_reason,
    } = userPendingData;

    const firstPart = cryptography.encryptData({
      data: { id, userId, name, email, cpf, cep, address },
      publicKey: user.publicKey,
    });

    if (firstPart.error) {
      return {
        data: null,
        error: firstPart.error,
      };
    }

    const secondPart = cryptography.encryptData({
      data: {
        complement,
        course,
        createdAt,
        number,
        photoUrl,
        registration,
        rejection_reason,
      },
      publicKey: user.publicKey,
    });

    if (secondPart.error) {
      return {
        data: null,
        error: secondPart.error,
      };
    }

    return {
      error: null,
      data: {
        encryptedData: `${firstPart.encryptedData}:${secondPart.encryptedData}`,
        userEthAddress: user.ethAddress,
      },
    };
  }

  const { encryptedData, error } = cryptography.encryptData({
    data: userPendingData,
    publicKey: user.publicKey,
  });

  if (error) return { data: null, error };

  return {
    data: { encryptedData, userEthAddress: user.ethAddress },
    error: null,
  };
}

export async function deleteUserPendingDataAction(id: string) {
  const userRepository = createUserRepository();
  await userRepository.deletePendingData(id);

  return revalidatePath('/pending-cards');
}

type UpdateUserInput = {
  status: UserStatus;
  transactionHash: string;
};

export async function updateUserAction(id: string, input: UpdateUserInput) {
  const userRepository = createUserRepository();

  const updatePromises = Promise.all([
    userRepository.updateStatus(id, input.status),
    userRepository.updateTransactionHash(id, input.transactionHash),
  ]);

  await updatePromises;

  return revalidatePath('/pending-cards');
}

export async function updateUserRejectionReasonAction(
  id: string,
  rejection_reason: string,
) {
  const userRepository = createUserRepository();
  await userRepository.updatePendingData({
    id,
    dataToUpdate: {
      rejection_reason,
    },
  });
}
