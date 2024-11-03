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
          mb: 4,
        }}
      >
        Seja bem vindo ao site da Instituição X
      </Text>

      {!signedUser && <NotSignedLayout />}

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

function NotSignedLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Text>
        É novo por aqui?{' '}
        <Link style={{ color: '#539bf5' }} href="/register">
          Preencher matrícula
        </Link>
      </Text>

      <Text>
        Já possui cadastro?{' '}
        <Link style={{ color: '#539bf5', width: 'fit-content' }} href="/login">
          Fazer login
        </Link>
      </Text>
    </Box>
  );
}
