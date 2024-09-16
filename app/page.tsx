import { identity } from '@/utils/idendity';
import { Box, Text } from '@primer/react';
import Link from 'next/link';

export default async function Home() {
  const signedUser = await identity.isLoggedIn();

  return (
    <Box>
      <Text
        sx={{
          display: 'block',
        }}
      >
        Seja bem vindo ao site da Instituição X
      </Text>

      {!signedUser && (
        <Link style={{ color: '#539bf5' }} href="/register">
          Preencher matrícula
        </Link>
      )}

      {signedUser && (
        <Link style={{ color: '#539bf5' }} href="/student-card">
          Ver carteira
        </Link>
      )}
    </Box>
  );
}
