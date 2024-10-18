import Web3Provider from '@/app/contexts/Web3Context';
import { identity } from '@/utils/idendity';
import { Box, Text } from '@primer/react';
import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';
import { StudentCard } from './components/StudentCard';

export default async function Page() {
  const signedUser = await identity.getMe();
  if (!signedUser || signedUser.role === 'ADMIN') {
    return redirect('/', RedirectType.replace);
  }

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

  return (
    <Web3Provider>
      <Link
        target={process.env.NODE_ENV === 'production' ? '_blank' : '_self'}
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
        href={
          process.env.NODE_ENV === 'production'
            ? `https://sepolia.etherscan.io/tx/${signedUser.transactionHash}`
            : '#'
        }
      >
        Ver transação na blockchain
      </Link>
      <StudentCard ethAddress={signedUser.ethAddress} userId={signedUser.id} />
    </Web3Provider>
  );
}
