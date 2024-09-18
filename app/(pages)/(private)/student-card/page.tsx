import { identity } from '@/utils/idendity';
import { Box, Text } from '@primer/react';
import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';

export default async function Page() {
  const signedUser = await identity.isLoggedIn();
  if (!signedUser) return redirect('/', RedirectType.replace);

  if (signedUser.status !== 'APPROVED') {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          gap: 2,
        }}
      >
        <Text>Carteira de estudante não disponível.</Text>
        <Link href="/student-card/status">Ver status</Link>
      </Box>
    );
  }

  return <p>Carteira de estudante descriptografada</p>;
}
