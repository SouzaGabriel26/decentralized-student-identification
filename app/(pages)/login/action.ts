'use server';

import { createUserRepository } from '@/repositories/userRepository';
import { cryptography } from '@/services/cryptography';
import { LoginInput, loginUseCase } from '@/useCases/loginUseCase';
import { constants } from '@/utils/constants';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function tryToLoginAction(_state: unknown, formData: FormData) {
  const data = Object.fromEntries(formData.entries()) as LoginInput;

  const userRepository = createUserRepository();

  const resultFromTryToLogin = await loginUseCase(
    userRepository,
    cryptography,
    {
      email: data.email,
      password: data.password,
    },
  );

  if (resultFromTryToLogin.data) {
    const { token } = resultFromTryToLogin.data;
    const sevenDaysInMilliseconds = 60 * 60 * 24 * 7 * 1000;
    cookies().set(constants.access_token_key, token, {
      expires: new Date(Date.now() + sevenDaysInMilliseconds),
      httpOnly: true,
    });

    redirect('/');
  }

  return resultFromTryToLogin;
}
