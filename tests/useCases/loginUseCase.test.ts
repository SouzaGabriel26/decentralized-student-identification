import prismaClient from '@/lib/prismaClient';
import { createUserRepository } from '@/repositories/userRepository';
import { cryptography } from '@/services/cryptography';
import { loginUseCase } from '@/useCases/loginUseCase';

import bcrypt from 'bcryptjs';

beforeAll(async () => {
  await prismaClient.user.deleteMany();
});

describe('> useCases/loginUseCase', () => {
  it('should return an error if the email does not exist', async () => {
    const userRepository = createUserRepository();

    const result = await loginUseCase(userRepository, cryptography, {
      email: 'unexistent@email.com',
      password: '123456',
    });

    expect(result).toStrictEqual({
      errors: [
        {
          path: ['email', 'password'],
          message: 'Credenciais inválidas',
        },
      ],
      data: null,
    });
  });

  it('should return an error if the password does not match', async () => {
    const userRepository = createUserRepository();
    const hashedPassword = bcrypt.hashSync('123456', 2);

    const createdUser = await prismaClient.user.create({
      data: {
        name: 'test',
        email: 'testmail@mail.com',
        password: hashedPassword,
        publicKey: 'publicKey',
        ethAddress: 'ethAddress',
      },
    });

    const loginResult = await loginUseCase(userRepository, cryptography, {
      email: createdUser.email,
      password: 'wrongPassword',
    });

    expect(loginResult).toStrictEqual({
      data: null,
      errors: [
        {
          path: ['email', 'password'],
          message: 'Credenciais inválidas',
        },
      ],
    });
  });

  it('should return a token if the credentials are valid', async () => {
    const userRepository = createUserRepository();
    const hashedPassword = bcrypt.hashSync('123456', 2);

    const createdUser = await prismaClient.user.create({
      data: {
        name: 'success',
        email: 'sucessfultest@mail.com',
        password: hashedPassword,
        publicKey: 'daskjdsajdnasjkdnasjkdn',
        ethAddress: 'daskjdsajdnasjkdnasjkdn',
      },
    });

    const loginResult = await loginUseCase(userRepository, cryptography, {
      email: createdUser.email,
      password: '123456',
    });

    expect(loginResult).toStrictEqual({
      data: {
        token: expect.any(String),
      },
      errors: null,
    });
  });
});
