import {
  CreatePendingDataInput,
  UserRepository,
} from '@/repositories/userRepository';
import { CryptographyService } from '@/services/cryptography';
import { LambdaService } from '@/services/lambda';
import bcrypt from 'bcryptjs';
import { z, ZodIssue } from 'zod';

type PendingDataProps = Omit<CreatePendingDataInput, 'photoUrl'> & {
  photo: File;
};

type ForgotPrivateKeyProps = {
  newData: PendingDataProps;
  userId: string;
  password: string;
};

export async function forgotPrivateKeyUseCase(
  userRepository: UserRepository,
  lambdaService: LambdaService,
  cryptographyService: CryptographyService,
  input: ForgotPrivateKeyProps,
) {
  const validationResult = schema.safeParse(input.newData);
  if (validationResult.error) {
    return {
      errors: validationResult.error.issues,
      data: null,
    };
  }

  const userFound = await userRepository.findById(input.userId, {
    withPassword: true,
  });
  if (!userFound) {
    return {
      data: null,
      errors: [
        {
          path: ['userId'],
          message: 'Usuário não encontrado',
        },
      ] as ZodIssue[],
    };
  }

  if (userFound.status !== 'FORGOT_PK') {
    return {
      data: null,
      errors: [
        {
          path: ['userStatus'],
          message: 'A ação não é válida para o status atual do usuário.',
        },
      ] as ZodIssue[],
    };
  }

  const isPasswordValid = bcrypt.compareSync(
    input.password,
    userFound.password,
  );

  if (!isPasswordValid) {
    return {
      data: null,
      errors: [
        {
          path: ['password'],
          message: 'Senha inválida',
        },
      ] as ZodIssue[],
    };
  }

  const foundPendingData = await userRepository.findPendingDataByUserId(
    input.userId,
  );
  if (foundPendingData) {
    return {
      data: null,
      errors: [
        {
          path: ['userId'],
          message: 'Já existe uma solicitação pendente para este usuário.',
        },
      ] as ZodIssue[],
    };
  }

  const { photo, ...data } = input.newData;
  const { file_url } = await lambdaService.uploadFile(photo);

  await userRepository.createPendingData(input.userId, {
    ...data,
    photoUrl: file_url,
  });

  const { privateKey, publicKey } = cryptographyService.generateKeyPairs({
    passphrase: input.password,
  });
  const userEthAddress = cryptographyService.generateEthAddress(publicKey);

  await userRepository.updatePublicKeys({
    userId: input.userId,
    ethAddress: userEthAddress,
    publicKey,
  });
  await userRepository.updateStatus(input.userId, 'PENDING');

  return {
    errors: null,
    data: {
      message:
        'Solicitação de recuperação de chave privada realizada com sucesso. Aguarde a aprovação.',
      privateKey,
    },
  };
}

const schema = z.object({
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
