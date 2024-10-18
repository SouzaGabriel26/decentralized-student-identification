import { identity } from '@/utils/idendity';
import { redirect, RedirectType } from 'next/navigation';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};
export default async function Layout({ children }: Props) {
  const signedUser = await identity.getMe();
  if (!signedUser || signedUser.role !== 'ADMIN') {
    return redirect('/', RedirectType.replace);
  }

  return children;
}
