'use client';

import { Box, useTheme } from '@primer/react';
import Image from 'next/image';

export function Logo() {
  const { colorMode } = useTheme();

  return (
    <Box
      sx={{
        bg: colorMode === 'light' ? 'slategray' : 'canvas.default',
        px: 2,
        py: 1,
        borderRadius: 4,
      }}
    >
      <Image
        src="https://www.faesa.br/hubfs/site/logo-faesa-centro-universitario.png"
        alt="Logo Faesa"
        width={110}
        height={35}
        style={{
          objectFit: 'cover',
          fill: 'black',
        }}
      />
    </Box>
  );
}
