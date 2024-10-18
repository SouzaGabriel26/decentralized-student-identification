import { createUserRepository } from '@/repositories/userRepository';
import { constants } from '@/utils/constants';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const identity = Object.freeze({
  isLoggedIn,
});

async function isLoggedIn() {
  const userId = await getUserIdFromJwtCookies();

  if (!userId) return null;

  const userRepository = createUserRepository();
  const user = await userRepository.findById(userId);

  if (!user) return null;

  return user;
}

async function getUserIdFromJwtCookies() {
  const accessToken = cookies().get(constants.access_token_key)?.value;
  if (!accessToken) return null;

  try {
    const secret = new TextEncoder().encode(constants.jwt_secret);
    const { payload } = await jwtVerify(accessToken, secret);
    const userId = payload.sub;
    if (!userId) return null;

    return userId;
  } catch {
    return null;
  }
}
