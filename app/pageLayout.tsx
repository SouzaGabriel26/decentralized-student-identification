import { Header } from '@/app/ui/Header';
import { Sidebar } from '@/app/ui/Sidebar';
import { identity } from '@/utils/idendity';
import { Box } from '@primer/react';
import { ReactNode } from 'react';
import Web3Provider from './contexts/Web3Context';

type Props = {
  children: ReactNode;
};

export async function PageLayout({ children }: Props) {
  const userSigned = await identity.isLoggedIn();

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
          }}
        >
          {userSigned && userSigned.role === 'ADMIN' ? (
            <Web3Provider>{children}</Web3Provider>
          ) : (
            children
          )}
        </Box>
      </Box>
    </Box>
  );
}
