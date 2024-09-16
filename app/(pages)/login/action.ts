'use server';

import { createUserRepository } from '@/repositories/userRepository';
import { cryptography } from '@/services/cryptography';
import { createLoginUseCase, LoginInput } from '@/useCases/loginUseCase';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function tryToLoginAction(_state: unknown, formData: FormData) {
  const data = Object.fromEntries(formData.entries()) as LoginInput;

  const userRepository = createUserRepository();
  const { login } = createLoginUseCase(userRepository, cryptography);

  const resultFromTryToLogin = await login({
    email: data.email,
    password: data.password,
  });

  if (resultFromTryToLogin.data) {
    const { token } = resultFromTryToLogin.data;
    const sevenDaysInMilliseconds = 60 * 60 * 24 * 7 * 1000;
    cookies().set('access:token', token, {
      expires: new Date(Date.now() + sevenDaysInMilliseconds),
      httpOnly: true,
    });

    redirect('/');
  }

  return resultFromTryToLogin;
}
