import {
  UpdatePendingDataInput,
  UserRepository,
} from '@/repositories/userRepository';
import { z } from 'zod';

export function createUpdatePendingDataUseCase(userRepository: UserRepository) {
  return Object.freeze({
    updatePendingDataUseCase,
  });

  async function updatePendingDataUseCase(input: UpdatePendingDataInput) {
    const validationResult = schema.safeParse({
      ...input.dataToUpdate,
    });
    if (validationResult.error) {
      return {
        errors: validationResult.error.issues,
        data: null,
      };
    }

    const { id: pendingDataId } = input;
    await userRepository.updatePendingData({
      id: pendingDataId,
      dataToUpdate: validationResult.data,
    });

    return {
      errors: null,
      data: {
        message: 'Dados atualizados com sucesso.',
      },
    };
  }
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
  photoUrl: z.string({
    invalid_type_error: 'O campo foto_url deve ser uma string',
    required_error: 'O campo foto é obrigatório',
  }),
});
