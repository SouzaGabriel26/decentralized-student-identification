import { cryptography } from '@/services/cryptography';

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

  test('Invoking "decryptData" with wrong passphrase', () => {
    const data = { name: 'Jane Doe', age: 25 };
    const passphrase = 'password';

    const { privateKey, publicKey } = cryptography.generateKeyPairs({
      passphrase,
    });

    const { encryptedData } = cryptography.encryptData({
      data,
      publicKey,
    });

    const result = cryptography.decryptData({
      encryptedData,
      privateKey,
      passphrase: 'wrong-password',
    });

    expect(result).toStrictEqual({
      error: 'Senha inválida para chave privada.',
    });
  });

  test('Invoking "generateToken" with userId', () => {
    const { token } = cryptography.generateToken({
      userId: '123',
    });

    expect(token.split('.').length).toBe(3);
  });

  test('Invoking "verifyToken" with a invalid token', () => {
    const { token } = cryptography.generateToken({
      userId: '123',
    });

    const result = cryptography.verifyToken(token.concat('invalid'));
    console.log(result);
    expect(result).toStrictEqual({
      error: 'Token inválido ou expirado.',
    });
  });

  test('Invoking "verifyToken" with valid token', () => {
    const { token } = cryptography.generateToken({
      userId: '123',
    });

    const result = cryptography.verifyToken(token);
    expect(result).toStrictEqual({
      decoded: {
        userId: '123',
        iat: expect.any(Number),
        exp: expect.any(Number),
      },
    });
  });
});
