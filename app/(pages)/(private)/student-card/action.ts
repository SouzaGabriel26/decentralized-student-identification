'use server';

import { cryptography, DecryptDataProps } from '@/services/cryptography';
import { UserPendingData } from '@prisma/client';

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

export async function forgotPrivateKeyAction(
  _state: unknown,
  userEthAddress: string,
) {
  console.log({ userEthAddress });
}
