import { identity } from '@/utils/idendity';
import { Box, Text } from '@primer/react';
import Link from 'next/link';

export default async function Home() {
  const signedUser = await identity.getMe();

  return (
    <Box>
      <Text
        sx={{
          display: 'block',
          fontSize: 20,
          color: 'slategray',
        }}
      >
        Seja bem vindo ao site da Instituição X
      </Text>

      {!signedUser && (
        <Link style={{ color: '#539bf5' }} href="/register">
          Preencher matrícula
        </Link>
      )}

      {signedUser && signedUser.role === 'USER' && (
        <Link style={{ color: '#539bf5' }} href="/student-card">
          Ver carteira
        </Link>
      )}

      {signedUser && signedUser.role === 'ADMIN' && (
        <Link style={{ color: '#539bf5' }} href="/pending-cards">
          Verificar carteiras pendentes
        </Link>
      )}
    </Box>
  );
}
