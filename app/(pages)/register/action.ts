'use server';

import z, { ZodIssue } from 'zod';

export async function tryToRegisterUserAction(
  _state: unknown,
  formData: FormData,
) {
  type RawData = {
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

  const { photo, ...data } = Object.fromEntries(formData.entries()) as RawData;

  const validationResult = schema.safeParse(data);

  if (validationResult.error) {
    return {
      errors: validationResult.error.issues,
    };
  }

  if (data.password !== data.confirm_password) {
    return {
      errors: [
        {
          path: ['password', 'confirm_password'],
          message: 'As senhas não coincidem',
        } as ZodIssue,
      ],
    };
  }

  return {
    errors: [],
  };

  /* TODO
    X 1. Validate input
    X 2. If error, return error. If success, continue
    3. generate cryptography key pairs
    4. show private key just once to user
    5. create user (save name, email, hashedPassword and publicKey)
    6. create userPendingData:
      6.1 save userId, name, email, cpf, cep, address, number, complement, course, photoUrl
  */
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
