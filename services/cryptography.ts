import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export type CryptographyService = typeof cryptography;

export const cryptography = Object.freeze({
  generateKeyPairs,
  encryptData,
  decryptData,
  generateToken,
  verifyToken,
});

type GenerateKeyPairsProps = {
  passphrase: string;
};

function generateKeyPairs({ passphrase }: GenerateKeyPairsProps) {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: passphrase,
    },
  });

  return { privateKey, publicKey };
}

type EncryptDataProps<T> = {
  data: T;
  publicKey: string;
};

function encryptData<Data>({ data, publicKey }: EncryptDataProps<Data>) {
  const bufferData = Buffer.from(JSON.stringify(data), 'utf8');
  const encryptedData = crypto.publicEncrypt(publicKey, bufferData);
  return { encryptedData: encryptedData.toString('base64') };
}

type DecryptDataProps = {
  encryptedData: string;
  privateKey: string;
  passphrase: string;
};

function decryptData({
  encryptedData,
  privateKey,
  passphrase,
}: DecryptDataProps) {
  try {
    const bufferData = Buffer.from(encryptedData, 'base64');
    const decryptedData = crypto.privateDecrypt(
      { key: privateKey, passphrase },
      bufferData,
    );

    return { decryptedData: JSON.parse(decryptedData.toString('utf8')) };
  } catch {
    return {
      error: 'Senha inválida para chave privada.',
    };
  }
}

type GenerateTokenProps = {
  userId: string;
};

function generateToken({ userId }: GenerateTokenProps) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  });
  return { token };
}

function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as GenerateTokenProps;
    return { decoded };
  } catch {
    return {
      error: 'Token inválido ou expirado.',
    };
  }
}
