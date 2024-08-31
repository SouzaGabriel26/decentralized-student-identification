import { cryptography } from '@/app/models/cryptography';

describe('> models/cryptography', () => {
  test('Invoking "generateKeyPairs"', () => {
    const passphrase = '123456';
    const result = cryptography.generateKeyPairs({
      passphrase,
    });

    expect(result).toHaveProperty('privateKey');
    expect(result).toHaveProperty('publicKey');
  });

  test('Invoking "encryptData"', () => {
    const data = { name: 'Jane Doe', age: 25 };
    const { publicKey } = cryptography.generateKeyPairs({
      passphrase: 'secret',
    });

    const result = cryptography.encryptData({
      data,
      publicKey,
    });

    expect(result).toStrictEqual({
      encryptedData: expect.any(String),
    });
  });

  test('Invoking "decryptData"', () => {
    const data = { name: 'Jane Doe', age: 25 };
    const passphrase = 'password123';
    const { privateKey, publicKey } = cryptography.generateKeyPairs({
      passphrase,
    });

    const { encryptedData } = cryptography.encryptData({
      data,
      publicKey,
    });

    expect(typeof encryptedData).toBe('string');

    const result = cryptography.decryptData({
      encryptedData,
      privateKey,
      passphrase,
    });

    expect(result).toStrictEqual({
      decryptedData: data,
    });
  });
});
