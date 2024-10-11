'use server';

import { createUserRepository } from '@/repositories/userRepository';
import { cryptography, DecryptDataProps } from '@/services/cryptography';
import { UserPendingData, UserStatus } from '@prisma/client';
import { redirect } from 'next/navigation';

export async function decryptUserDataAction({
  encryptedData,
  passphrase,
  privateKey,
}: DecryptDataProps) {
  const encryptedHashes = encryptedData.split(':');

  let originalUserPendingData = {} as UserPendingData;

  for (const hash of encryptedHashes) {
    const { decryptedData, error } = cryptography.decryptData({
      encryptedData: hash,
      passphrase,
      privateKey,
    });

    if (error) {
      return {
        data: null,
        error,
      };
    }

    originalUserPendingData = { ...originalUserPendingData, ...decryptedData };
  }

  return {
    data: originalUserPendingData,
    error: null,
  };
}

export async function updateUserStatusAction(payload: {
  userId: string;
  status: UserStatus;
}) {
  const userRepository = createUserRepository();

  await userRepository.updateStatus(payload.userId, payload.status);
  return redirect('/student-card/status');
}
