'use client';

import { Box, Text, useTheme } from '@primer/react';
import Image from 'next/image';

export function Logo() {
  const { colorMode } = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        cursor: 'pointer',
        alignItems: 'center',
      }}
    >
      <Image
        src="./logo-faesa.svg"
        alt="Logo Faesa"
        width={40}
        height={40}
        style={{
          objectFit: 'cover',
          fill: 'black',
        }}
      />
      <Text
        as={'h1'}
        sx={{
          fontSize: 22,
          color: colorMode === 'light' ? 'black' : 'white',
          '@media (max-width: 480px)': {
            display: 'none',
          },
        }}
      >
        Faesa
      </Text>
    </Box>
  );
}
