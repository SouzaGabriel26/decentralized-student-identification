import prismaClient from '@/lib/prismaClient';
import { createUserRepository } from '@/repositories/userRepository';

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
      },
      select: {
        id: true,
      },
    });

    const userRepository = createUserRepository();
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
      },
    });

    const userRepository = createUserRepository();
    const userFoundByEmail = await userRepository.findByEmail(email);

    expect(userFoundByEmail?.email).toStrictEqual(email);
  });

  it('should create a user and return his id, name and email', async () => {
    const input = {
      name: 'Gabriel',
      email: 'gabriel@mail.com',
      passwordHash: '123456asdsadsadas',
      publicKey: randomUUID(),
    };

    const userRepository = createUserRepository();
    const createdUser = await userRepository.create(input);

    expect(createdUser).toStrictEqual({
      id: expect.any(String),
      name: input.name,
      email: input.email,
    });
  });

  it('should create pending user data and return id, userId, name and email', async () => {
    const createdUser = await prismaClient.user.create({
      data: {
        name: 'Gabriel',
        email: 'test@mail.com',
        password: randomUUID(),
        publicKey: randomUUID(),
      },
    });

    const userId = createdUser.id;

    const input = {
      name: createdUser.name,
      email: createdUser.email,
      cpf: '12345678901',
      cep: '12345678',
      address: 'Rua Teste',
      number: '123',
      complement: 'Casa',
      course: 'Ciência da Computação',
      photoUrl: 'http://test.com/photo.jpg',
    };

    const userRepository = createUserRepository();
    const createdPendingData = await userRepository.createPendingData(
      userId,
      input,
    );

    expect(createdPendingData).toStrictEqual({
      id: expect.any(String),
      userId,
      name: input.name,
      email: input.email,
    });
  });
});
