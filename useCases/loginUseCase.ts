import { UserRepository } from '@/repositories/userRepository';
import { CryptographyService } from '@/services/cryptography';
import bcrypt from 'bcryptjs';
import { z, ZodIssue } from 'zod';

type LoginInput = {
  email: string;
  password: string;
};

export function createLoginUseCase(
  userRepository: UserRepository,
  cryptographyService: CryptographyService,
) {
  return Object.freeze({
    login,
  });

  async function login(input: LoginInput) {
    const validationResult = schema.safeParse(input);
    if (validationResult.error) {
      return {
        errors: validationResult.error.issues,
        data: null,
      };
    }

    const user = await userRepository.findByEmail(input.email, {
      withPassword: true,
    });
    if (!user) {
      return {
        errors: [
          {
            path: ['email', 'password'],
            message: 'Credenciais inválidas',
          },
        ] as ZodIssue[],
        data: null,
      };
    }

    const isPasswordValid = bcrypt.compareSync(input.password, user.password);
    if (!isPasswordValid) {
      return {
        errors: [
          {
            path: ['email', 'password'],
            message: 'Credenciais inválidas',
          },
        ] as ZodIssue[],
        data: null,
      };
    }

    const { token } = cryptographyService.generateToken({
      userId: user.id,
    });

    return {
      data: {
        token,
      },
      errors: null,
    };
  }
}

const schema = z.object({
  email: z
    .string({
      invalid_type_error: 'O campo email deve ser uma string',
      required_error: 'O campo email é obrigatório',
    })
    .email({
      message: 'Email inválido',
    }),
  password: z
    .string({
      invalid_type_error: 'O campo senha deve ser uma string',
      required_error: 'O campo senha é obrigatório',
    })
    .min(6, {
      message: 'O campo senha deve ter no mínimo 6 caracteres',
    }),
});
