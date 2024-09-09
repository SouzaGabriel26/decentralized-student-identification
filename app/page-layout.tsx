import { Header } from '@/app/ui/Header';
import { Sidebar } from '@/app/ui/Sidebar';
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
        minHeight: '100vh',
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
            width: '100%',
            height: '100%',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
