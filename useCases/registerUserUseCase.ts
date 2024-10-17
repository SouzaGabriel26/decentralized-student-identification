import { UserRepository } from '@/repositories/userRepository';
import { CryptographyService } from '@/services/cryptography';
import { LambdaService } from '@/services/lambda';
import bcrypt from 'bcryptjs';
import { z, ZodIssue } from 'zod';

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  cpf: string;
  cep: string;
  address: string;
  number: string;
  complement: string;
  course: string;
  photo: File;
};

export async function registerUserUseCase(
  userRepository: UserRepository,
  cryptographyService: CryptographyService,
  lambdaService: LambdaService,
  input: RegisterUserInput,
) {
  const validationResult = schema.safeParse(input);
  if (validationResult.error) {
    return {
      errors: validationResult.error.issues,
      data: null,
    };
  }

  if (input.password !== input.confirm_password) {
    return {
      errors: [
        {
          path: ['password', 'confirm_password'],
          message: 'As senhas não coincidem',
        } as ZodIssue,
      ],
      data: null,
    };
  }

  const emailAlreadyExists = await userRepository.findByEmail(input.email);
  if (emailAlreadyExists) {
    return {
      data: null,
      errors: [
        {
          path: ['email'],
          message: 'O email já está cadastrado',
        } as ZodIssue,
      ],
    };
  }

  // TODO: handle cryptography passphrase differently from website password
  const { privateKey, publicKey } = cryptographyService.generateKeyPairs({
    passphrase: input.password,
  });

  const ethAddress = cryptographyService.generateEthAddress(publicKey);

  const SALT_ROUNDS = 8;
  const hashedPassword = bcrypt.hashSync(input.password, SALT_ROUNDS);

  const { id: createdUserId } = await userRepository.create({
    email: input.email,
    name: input.name,
    passwordHash: hashedPassword,
    publicKey,
    ethAddress,
  });

  const { file_url } = await lambdaService.uploadFile(input.photo);

  // TODO: delete this information after admin approval
  await userRepository.createPendingData(createdUserId, {
    address: input.address,
    cep: input.cep,
    complement: input.complement,
    course: input.course,
    cpf: input.cpf,
    number: input.number,
    email: input.email,
    name: input.name,
    photoUrl: file_url,
  });

  // show privateKey just once
  return {
    errors: null,
    data: {
      message: 'Usuário cadastrado com sucesso. Aprovação pendente!',
      privateKey,
    },
  };
}

const schema = z.object({
  name: z
    .string({
      invalid_type_error: 'O campo nome deve ser uma string',
      required_error: 'O campo nome é obrigatório',
    })
    .min(3, {
      message: 'O campo nome deve ter no mínimo 3 caracteres',
    }),
  email: z
    .string({
      invalid_type_error: 'O campo email deve ser uma string',
      required_error: 'O campo email é obrigatório',
    })
    .email({
      message: 'O campo email deve ser um email válido',
    }),
  password: z
    .string({
      invalid_type_error: 'O campo senha deve ser uma string',
      required_error: 'O campo senha é obrigatório',
    })
    .min(6, {
      message: 'O campo senha deve ter no mínimo 6 caracteres',
    }),
  confirm_password: z
    .string({
      invalid_type_error: 'O campo confirmar senha deve ser uma string',
      required_error: 'O campo confirmar senha é obrigatório',
    })
    .min(6, {
      message: 'O campo confirmar senha deve ter no mínimo 6 caracteres',
    }),
  cpf: z
    .string({
      invalid_type_error: 'O campo cpf deve ser uma string',
      required_error: 'O campo cpf é obrigatório',
    })
    .length(11, {
      message: 'O campo cpf deve ter 11 caracteres',
    })
    .regex(/^\d+$/, {
      message: 'O campo cpf deve conter apenas números',
    }),
  cep: z
    .string({
      invalid_type_error: 'O campo cep deve ser uma string',
      required_error: 'O campo cep é obrigatório',
    })
    .length(8, {
      message: 'O campo cep deve ter 8 caracteres',
    })
    .regex(/^\d+$/, {
      message: 'O campo cep deve conter apenas números',
    }),
  address: z
    .string({
      invalid_type_error: 'O campo endereço deve ser uma string',
      required_error: 'O campo endereço é obrigatório',
    })
    .min(3, {
      message: 'O campo endereço deve ter no mínimo 3 caracteres',
    }),
  number: z
    .string({
      invalid_type_error: 'O campo número deve ser uma string',
      required_error: 'O campo número é obrigatório',
    })
    .regex(/^\d+$/, {
      message: 'O campo número deve conter apenas números',
    }),
  complement: z
    .string({
      invalid_type_error: 'O campo complemento deve ser uma string',
    })
    .optional(),
  course: z
    .string({
      invalid_type_error: 'O campo curso deve ser uma string',
      required_error: 'O campo curso é obrigatório',
    })
    .refine(
      (value) =>
        [
          'ciencia-da-computacao',
          'engenharia-de-software',
          'sistemas-de-informacao',
        ].includes(value),
      {
        message: 'O campo curso deve ser uma das opções disponíveis',
      },
    ),
});
