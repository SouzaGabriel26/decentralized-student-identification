import { identity } from '@/utils/idendity';
import { redirect, RedirectType } from 'next/navigation';

export default async function Page() {
  const signedUser = await identity.isLoggedIn();
  if (!signedUser || signedUser.role !== 'ADMIN') {
    return redirect('/', RedirectType.replace);
  }

  return <p>Solicitações de emissão de carteira pendentes</p>;
}
