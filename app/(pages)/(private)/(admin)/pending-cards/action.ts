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

  const { encryptedData } = cryptography.encryptData({
    data: userPendingData,
    publicKey: user.publicKey,
  });

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

export async function updateUserStatusAction(id: string, status: UserStatus) {
  const userRepository = createUserRepository();
  await userRepository.updateStatus(id, status);

  return revalidatePath('/pending-cards');
}
