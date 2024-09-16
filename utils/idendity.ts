import { createUserRepository } from '@/repositories/userRepository';
import { headers } from 'next/headers';

export const identity = Object.freeze({
  isLoggedIn,
});

async function isLoggedIn() {
  const userId = headers().get('x-user-id');

  if (!userId) return null;

  const userRepository = createUserRepository();
  const user = await userRepository.findById(userId);

  if (!user) return null;

  return user;
}
