import { Box, Text } from '@primer/react';
import Link from 'next/link';

export default function Home() {
  return (
    <Box>
      <Text
        sx={{
          display: 'block',
        }}
      >
        Seja bem vindo ao site da Instituição X
      </Text>

      <Link style={{ color: '#539bf5' }} href="/register">
        Preencher matrícula
      </Link>
    </Box>
  );
}
