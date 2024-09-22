import { createUserRepository } from '@/repositories/userRepository';
import { identity } from '@/utils/idendity';
import { Box, Text } from '@primer/react';
import { redirect, RedirectType } from 'next/navigation';
import { PendingTable } from './components/PendingTable';
import Web3Connection from './components/Web3Connection';

export default async function Page() {
  const signedUser = await identity.isLoggedIn();
  if (!signedUser || signedUser.role !== 'ADMIN') {
    return redirect('/', RedirectType.replace);
  }

  const userRepository = createUserRepository();
  const pendingCards = await userRepository.findPendingUsers();

  if (pendingCards.length === 0) {
    return <Text>Nenhuma solicitação de emissão de carteira pendente</Text>;
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowY: 'auto',
      }}
    >
      <Web3Connection />
      <PendingTable pendingCards={pendingCards} />
    </Box>
  );
}
