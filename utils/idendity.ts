import { createUserRepository } from '@/repositories/userRepository';
import { constants } from '@/utils/constants';
import { headers } from 'next/headers';

export const identity = Object.freeze({
  isLoggedIn,
});

async function isLoggedIn() {
  const userId = headers().get(constants.user_id_header_key);

  if (!userId) return null;

  const userRepository = createUserRepository();
  const user = await userRepository.findById(userId);

  if (!user) return null;

  return user;
}
