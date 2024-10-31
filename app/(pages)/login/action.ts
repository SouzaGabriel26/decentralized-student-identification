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
    cookies().set(constants.access_token_key, token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
      sameSite: 'strict',
    });

    redirect('/');
  }

  return resultFromTryToLogin;
}
