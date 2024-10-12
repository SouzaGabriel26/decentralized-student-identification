import { createUserRepository } from '@/repositories/userRepository';
import { cryptography } from '@/services/cryptography';
import { LambdaService } from '@/services/lambda';
import { forgotPrivateKeyUseCase } from '@/useCases/forgotPrivateKeyUseCase';
import bcrypt from 'bcryptjs';
import { randomBytes, randomUUID } from 'crypto';

describe('> Forgot Private Key Use Case', () => {
  const userRepository = createUserRepository();
  const lambdaService: LambdaService = {
    uploadFile: async (_file: File) => {
      return {
        file_url: '',
      };
    },
  };

  const defaultPassword = '123456';
  const SALT_ROUNDS = 2;
  const defaultHashedPassword = bcrypt.hashSync(defaultPassword, SALT_ROUNDS);

  it('should return an error when at least one "newData" property is undefined', async () => {
    const email = randomBytes(8).toString('hex') + '@mail.com';
    const name = randomBytes(8).toString('hex');

    const createdUser = await userRepository.create({
      email,
      name,
      publicKey: randomUUID(),
      ethAddress: randomUUID(),
      passwordHash: defaultHashedPassword,
    });

    const result = await forgotPrivateKeyUseCase(
      userRepository,
      lambdaService,
      cryptography,
      {
        userId: createdUser.id,
        password: defaultPassword,
        newData: {
          address: undefined as unknown as string,
          cep: '12345678',
          course: 'ciencia-da-computacao',
          cpf: '12345678901',
          number: '123',
          complement: 'Test complement',
          email,
          name,
          photo: new File([''], 'test.jpg'),
        },
      },
    );

    expect(result).toStrictEqual({
      data: null,
      errors: [
        {
          path: ['address'],
          message: 'O campo endereço é obrigatório',
          received: 'undefined',
          expected: 'string',
          code: 'invalid_type',
        },
      ],
    });
  });

  it('should return an error when at least one "newData" property is invalid type', async () => {
    const email = randomBytes(8).toString('hex') + '@mail.com';
    const name = randomBytes(8).toString('hex');

    const createdUser = await userRepository.create({
      email,
      name,
      publicKey: randomUUID(),
      ethAddress: randomUUID(),
      passwordHash: defaultHashedPassword,
    });

    const result = await forgotPrivateKeyUseCase(
      userRepository,
      lambdaService,
      cryptography,
      {
        userId: createdUser.id,
        password: defaultPassword,
        newData: {
          address: 1 as unknown as string,
          cep: '12345678',
          course: 'ciencia-da-computacao',
          cpf: '12345678901',
          number: '123',
          complement: 'Test complement',
          email,
          name,
          photo: new File([''], 'test.jpg'),
        },
      },
    );

    expect(result).toStrictEqual({
      data: null,
      errors: [
        {
          path: ['address'],
          message: 'O campo endereço deve ser uma string',
          received: 'number',
          expected: 'string',
          code: 'invalid_type',
        },
      ],
    });
  });

  it('should return an error when userStatus is not "FORGOT_PK"', async () => {
    const email = randomBytes(8).toString('hex') + '@mail.com';
    const name = randomBytes(8).toString('hex');

    // user default status is "PENDING"
    const createdUser = await userRepository.create({
      email,
      name,
      publicKey: randomUUID(),
      ethAddress: randomUUID(),
      passwordHash: defaultHashedPassword,
    });

    const result = await forgotPrivateKeyUseCase(
      userRepository,
      lambdaService,
      cryptography,
      {
        userId: createdUser.id,
        password: defaultPassword,
        newData: {
          address: 'Test address',
          cep: '12345678',
          course: 'ciencia-da-computacao',
          cpf: '12345678901',
          number: '123',
          complement: 'Test complement',
          email,
          name,
          photo: new File([''], 'test.jpg'),
        },
      },
    );

    expect(result).toStrictEqual({
      data: null,
      errors: [
        {
          path: ['userStatus'],
          message: 'A ação não é válida para o status atual do usuário.',
        },
      ],
    });
  });

  it('should return an error when userId does not exists', async () => {
    const email = randomBytes(8).toString('hex') + '@mail.com';
    const name = randomBytes(8).toString('hex');

    const result = await forgotPrivateKeyUseCase(
      userRepository,
      lambdaService,
      cryptography,
      {
        userId: randomUUID(),
        password: defaultPassword,
        newData: {
          address: 'Test address',
          cep: '12345678',
          course: 'ciencia-da-computacao',
          cpf: '12345678901',
          number: '123',
          complement: 'Test complement',
          email,
          name,
          photo: new File([''], 'test.jpg'),
        },
      },
    );

    expect(result).toStrictEqual({
      data: null,
      errors: [
        {
          path: ['userId'],
          message: 'Usuário não encontrado',
        },
      ],
    });
  });

  it('should return an error when password is invalid', async () => {
    const email = randomBytes(8).toString('hex') + '@mail.com';
    const name = randomBytes(8).toString('hex');

    const createdUser = await userRepository.create({
      email,
      name,
      publicKey: randomUUID(),
      ethAddress: randomUUID(),
      passwordHash: defaultHashedPassword,
    });

    await userRepository.updateStatus(createdUser.id, 'FORGOT_PK');

    const result = await forgotPrivateKeyUseCase(
      userRepository,
      lambdaService,
      cryptography,
      {
        userId: createdUser.id,
        password: 'invalidPassword',
        newData: {
          address: 'Test address',
          cep: '12345678',
          course: 'ciencia-da-computacao',
          cpf: '12345678901',
          number: '123',
          complement: 'Test complement',
          email,
          name,
          photo: new File([''], 'test.jpg'),
        },
      },
    );

    expect(result).toStrictEqual({
      data: null,
      errors: [
        {
          path: ['password'],
          message: 'Senha inválida',
        },
      ],
    });
  });

  it('should return an error when user already has a pending data', async () => {
    const email = randomBytes(8).toString('hex') + '@mail.com';
    const name = randomBytes(8).toString('hex');

    const createdUser = await userRepository.create({
      email,
      name,
      publicKey: randomUUID(),
      ethAddress: randomUUID(),
      passwordHash: defaultHashedPassword,
    });

    await userRepository.updateStatus(createdUser.id, 'FORGOT_PK');

    const pendinDataInput = {
      address: 'Test address',
      cep: '12345678',
      course: 'ciencia-da-computacao',
      cpf: '12345678901',
      number: '123',
      complement: 'Test complement',
      email,
      name,
    };

    await userRepository.createPendingData(createdUser.id, {
      ...pendinDataInput,
      photoUrl: 'http://test.com/photo.jpg',
    });

    const result = await forgotPrivateKeyUseCase(
      userRepository,
      lambdaService,
      cryptography,
      {
        userId: createdUser.id,
        password: defaultPassword,
        newData: {
          ...pendinDataInput,
          photo: new File([''], 'test.jpg'),
        },
      },
    );

    expect(result).toStrictEqual({
      data: null,
      errors: [
        {
          path: ['userId'],
          message: 'Já existe uma solicitação pendente para este usuário.',
        },
      ],
    });
  });

  it('should return a success message and new privateKey when all data is valid', async () => {
    const email = randomBytes(8).toString('hex') + '@mail.com';
    const name = randomBytes(8).toString('hex');

    const createdUser = await userRepository.create({
      email,
      name,
      publicKey: randomUUID(),
      ethAddress: randomUUID(),
      passwordHash: defaultHashedPassword,
    });

    await userRepository.updateStatus(createdUser.id, 'FORGOT_PK');

    const pendingDataInput = {
      address: 'Test address',
      cep: '12345678',
      course: 'ciencia-da-computacao',
      cpf: '12345678901',
      number: '123',
      complement: 'Test complement',
      email,
      name,
      photo: new File([''], 'test.jpg'),
    };

    const userBeforeUpdate = await userRepository.findById(createdUser.id);

    const result = await forgotPrivateKeyUseCase(
      userRepository,
      lambdaService,
      cryptography,
      {
        userId: createdUser.id,
        password: defaultPassword,
        newData: pendingDataInput,
      },
    );

    const userAfterUpdate = await userRepository.findById(createdUser.id);

    expect(userBeforeUpdate!.publicKey).not.equal(userAfterUpdate!.publicKey);
    expect(userBeforeUpdate!.ethAddress).not.equal(userAfterUpdate!.ethAddress);

    const pendingDataFound = await userRepository.findPendingDataByUserId(
      createdUser.id,
    );
    expect(pendingDataFound).toStrictEqual({
      id: expect.any(String),
      userId: expect.any(String),
      name,
      email,
      cpf: pendingDataInput.cpf,
      cep: pendingDataInput.cep,
      address: pendingDataInput.address,
      number: pendingDataInput.number,
      registration: expect.any(Number),
      complement: pendingDataInput.complement,
      course: pendingDataInput.course,
      photoUrl: '',
      rejection_reason: null,
      createdAt: expect.any(Date),
    });

    expect(result).toStrictEqual({
      errors: null,
      data: {
        message:
          'Solicitação de recuperação de chave privada realizada com sucesso. Aguarde a aprovação.',
        privateKey: expect.any(String),
      },
    });
  });
});
