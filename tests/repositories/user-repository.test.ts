import { userRepository } from '@/app/repositories/userRepository';
import prismaClient from '@/lib/prismaClient';

import { randomBytes, randomUUID } from 'node:crypto';

beforeAll(async () => {
  await prismaClient.user.deleteMany();
});

describe('> User Repository', () => {
  it('should return a user by id', async () => {
    const name = randomBytes(6).toString('base64url');
    const email = name.concat('@mail.com');

    const createdUser = await prismaClient.user.create({
      data: {
        name,
        email,
        password: '123456',
        publicKey: randomUUID(),
        cryptedPrivateKey: randomUUID(),
      },
      select: {
        id: true,
      },
    });

    const userFoundById = await userRepository.findById(createdUser.id);

    expect(userFoundById?.id).toBe(createdUser.id);
  });

  it('should return a user by email', async () => {
    const name = randomBytes(6).toString('base64url');
    const email = name.concat('@mail.com');

    await prismaClient.user.create({
      data: {
        name,
        email,
        password: '123456asdadasda',
        publicKey: randomUUID(),
        cryptedPrivateKey: randomUUID(),
      },
    });

    const userFoundByEmail = await userRepository.findByEmail(email);

    expect(userFoundByEmail?.email).toStrictEqual(email);
  });

  it('should create a user and return his id, name and email', async () => {
    const input = {
      name: 'Gabriel',
      email: 'gabriel@mail.com',
      passwordHash: '123456asdsadsadas',
      publicKey: randomUUID(),
      cryptedPrivateKey: randomUUID(),
    };

    const createdUser = await userRepository.create(input);

    expect(createdUser).toStrictEqual({
      id: expect.any(String),
      name: input.name,
      email: input.email,
    });
  });
});
