import prismaClient from '@/lib/prismaClient';
import { createUserRepository } from '@/repositories/userRepository';
import { cryptography } from '@/services/cryptography';
import { LambdaService } from '@/services/lambda';
import {
  RegisterUserInput,
  registerUserUseCase,
} from '@/useCases/registerUserUseCase';

beforeAll(async () => {
  await prismaClient.user.deleteMany();
});

describe('> Register User Use Case', () => {
  const mockedLambdaService: LambdaService = {
    uploadFile: async (_file: File) => {
      return {
        file_url: '',
      };
    },
  };

  it('should return a error when send at least one invalid input field', async () => {
    const userRepository = createUserRepository();

    const input: RegisterUserInput = {
      email: 'invalid_email',
      password: '123456',
      confirm_password: '123456',
      address: 'Rua 1',
      name: 'John Doe',
      cep: '12345678',
      complement: 'Complement',
      course: 'ciencia-da-computacao',
      cpf: '12345678911',
      number: '123',
      photo: new File([], 'photo.jpg'),
    };

    const result = await registerUserUseCase(
      userRepository,
      cryptography,
      mockedLambdaService,
      input,
    );
    expect(result).toStrictEqual({
      data: null,
      errors: [
        {
          validation: 'email',
          code: 'invalid_string',
          message: 'O campo email deve ser um email válido',
          path: ['email'],
        },
      ],
    });
  });

  it('should create user and userPendingData returning a successfull message and privateKey', async () => {
    const userRepository = createUserRepository();

    const input: RegisterUserInput = {
      email: 'testejohndoe@mail.com',
      password: '123456',
      confirm_password: '123456',
      address: 'Rua 1',
      name: 'John Doe',
      cep: '12345678',
      complement: 'Complement',
      course: 'ciencia-da-computacao',
      cpf: '12345678911',
      number: '123',
      photo: new File([], 'photo.jpg'),
    };

    const result = await registerUserUseCase(
      userRepository,
      cryptography,
      mockedLambdaService,
      input,
    );
    expect(result).toStrictEqual({
      errors: null,
      data: {
        message: 'Usuário cadastrado com sucesso. Aprovação pendente!',
        privateKey: expect.any(String),
        userName: 'John Doe',
      },
    });

    expect(
      result.data?.privateKey.includes('BEGIN ENCRYPTED PRIVATE KEY'),
    ).toBe(true);
  });
});
