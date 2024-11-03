'use server';

import { constants } from '@/utils/constants';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signOutAction() {
  cookies().delete(constants.access_token_key);
  return redirect('/login');
}
