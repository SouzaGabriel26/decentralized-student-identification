import { Header } from '@/ui/Header';
import { Sidebar } from '@/ui/Sidebar';
import { Box } from '@primer/react';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function PageLayout({ children }: Props) {
  return (
    <Box
      sx={{
        bg: 'canvas.default',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
        }}
      >
        <Sidebar />

        <Box
          sx={{
            px: 4,
            py: 2,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
