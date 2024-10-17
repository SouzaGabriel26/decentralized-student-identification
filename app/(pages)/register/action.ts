'use server';

import { createUserRepository } from '@/repositories/userRepository';
import { cryptography as cryptographyService } from '@/services/cryptography';
import { lambda as lambdaService } from '@/services/lambda';
import {
  RegisterUserInput,
  registerUserUseCase,
} from '@/useCases/registerUserUseCase';

export async function tryToRegisterUserAction(
  _state: unknown,
  formData: FormData,
) {
  const data = Object.fromEntries(formData.entries()) as RegisterUserInput;

  const userRepository = createUserRepository();

  const resultFromTryToRegisterUser = await registerUserUseCase(
    userRepository,
    cryptographyService,
    lambdaService,
    data,
  );

  return resultFromTryToRegisterUser;
}
