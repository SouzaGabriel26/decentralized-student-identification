'use client';

import { Box, Text } from '@primer/react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Web3 } from 'web3';

declare global {
  interface Window {
    ethereum: any;
  }
}
const GANACHE_URL = 'http://localhost:8545';

export default function Web3Connection() {
  const [provider, setProvider] = useState<'GANACHE' | 'INJECTED' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    async function checkGanache() {
      try {
        const response = await fetch(GANACHE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'web3_clientVersion',
            params: [],
            id: 1,
          }),
        });

        if (response.ok) {
          console.warn('DEVELOPMENT MODE: Ganache is running');
          setProvider('GANACHE');
        } else {
          setProvider(window.ethereum ? 'INJECTED' : null);
        }
      } catch (error) {
        setProvider(window.ethereum ? 'INJECTED' : null);
      } finally {
        setIsLoading(false);
      }
    }

    checkGanache();
  }, []);

  const web3 = useMemo(() => {
    if (!provider) return null;

    return provider === 'INJECTED'
      ? new Web3(window.ethereum)
      : new Web3(GANACHE_URL);
  }, [provider]);

  useEffect(() => {
    if (web3) {
      getAccounts();
    }

    async function getAccounts() {
      try {
        const accounts = await web3?.eth.getAccounts();
        console.log(accounts);

        if (!accounts || accounts.length === 0) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          return window.location.reload();
        }

        setAccount(accounts[0]);
      } catch (error) {
        console.error('Failed to load accounts', error);
      }
    }
  }, [web3]);

  if (isLoading) {
    return <p>...</p>;
  }

  if (!provider && !isLoading) {
    return (
      <div>
        <h2>Instale uma carteira crypto.</h2>
        <br />
        <span>
          Ex:{' '}
          <Link href="https://metamask.io/" target="_blank">
            Metamask
          </Link>
        </span>
      </div>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        mb: 3,
        p: 2,
        '@media (max-width: 768px)': {
          fontSize: 10,
        },
      }}
    >
      <Text as="h3">Conexão estabelecida</Text>
      <p>
        Provider: {provider === 'INJECTED' ? 'Carteira Metamask' : provider}
      </p>
      <p>Conta conectada: {account}</p>
    </Box>
  );
}
