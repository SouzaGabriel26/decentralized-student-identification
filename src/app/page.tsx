import { Button } from '@primer/react';
import { cryptography } from './models/cryptography';

export default function Home() {
  const { publicKey, privateKey } = cryptography.generateKeyPairs({
    passphrase: '1234',
  });

  const encryptedData = cryptography.encryptData({
    data: {
      name: 'Gabriel',
    },
    publicKey,
  });

  console.log({ encryptedData });

  const decryptedData = cryptography.decryptData({
    encryptedData,
    privateKey,
    passphrase: '1234',
  });

  console.log({ decryptedData });

  return (
    <main>
      <h1>Identificação Estudantil</h1>
      <Button variant='primary'>Teste Primer</Button>
    </main>
  );
}
