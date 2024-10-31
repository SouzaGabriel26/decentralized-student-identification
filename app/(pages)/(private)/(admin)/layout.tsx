'use client';

import { useWeb3Context } from '@/app/contexts/Web3Context';
import { Box, Text } from '@primer/react';
import { Banner } from '@primer/react/drafts';
import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const { account, provider } = useWeb3Context();
  const userDoesNotHaveMetamask = !provider && !account;
  const userDidNotAcceptedAppInMetamask = provider === 'INJECTED' && !account;

  return (
    <>
      {userDoesNotHaveMetamask && <InstallMetaMaskAlert />}
      {userDidNotAcceptedAppInMetamask && <AcceptAppAlert />}
      {children}
    </>
  );
}

function AcceptAppAlert() {
  return (
    <Box sx={{ py: 2 }}>
      <Banner variant="warning">
        <Text>Usuário ADMIN deve aceitar a aplicação no MetaMask</Text>
      </Banner>
    </Box>
  );
}

function InstallMetaMaskAlert() {
  return (
    <Box sx={{ py: 2 }}>
      <Banner variant="warning">
        <Text>
          Usuário ADMIN deve possuir a extensão{' '}
          <Link
            style={{ color: '#539bf5' }}
            href="https://metamask.io/download/"
            target="_blank"
          >
            MetaMask
          </Link>{' '}
          instalada no navegador
        </Text>
      </Banner>
    </Box>
  );
}
