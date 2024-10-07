'use server';

import { cryptography, DecryptDataProps } from '@/services/cryptography';
import { UserPendingData } from '@prisma/client';

export async function decryptUserDataAction(props: DecryptDataProps) {
  const encryptedHashes = props.encryptedData.split(':');

  let originalUserPendingData = {} as UserPendingData;

  for (const hash of encryptedHashes) {
    const { decryptedData } = cryptography.decryptData({
      encryptedData: hash,
      passphrase: props.passphrase,
      privateKey: props.privateKey,
    });

    originalUserPendingData = { ...originalUserPendingData, ...decryptedData };
  }

  return {
    data: originalUserPendingData,
    error: null,
  };
}
