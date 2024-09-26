'use client';

import { abi } from '@/contract/smart-contract-abi';
import { constants } from '@/utils/constants';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Contract, Web3 } from 'web3';

const GANACHE_URL = 'http://localhost:8545' as const;

type Web3ContextType = {
  web3Provider: Web3 | null;
  account: string | null;
  provider: 'GANACHE' | 'INJECTED' | null;
  isLoadingProvider: boolean;
  contract: Contract<typeof abi> | null;
};

export const Web3Context = createContext({} as Web3ContextType);

export default function Web3Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [provider, setProvider] = useState<'GANACHE' | 'INJECTED' | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isLoadingProvider, setIsLoadingProvider] = useState(false);

  const web3 = useMemo(() => {
    if (!provider) return null;

    return provider === 'INJECTED'
      ? new Web3(window.ethereum)
      : new Web3(GANACHE_URL);
  }, [provider]);

  const contract = useMemo(() => {
    if (!web3) return null;

    return new web3.eth.Contract(abi, constants.smart_contract_address);
  }, [web3]);

  useEffect(() => {
    checkGanacheStatus();

    async function checkGanacheStatus() {
      setIsLoadingProvider(true);
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
        setIsLoadingProvider(false);
      }
    }
  }, []);

  useEffect(() => {
    getAccounts();

    async function getAccounts() {
      if (!web3) return;

      try {
        const accounts = await web3.eth.getAccounts();
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

  const value = useMemo(
    () => ({
      web3Provider: web3,
      account,
      provider,
      isLoadingProvider,
      contract,
    }),
    [web3, account, provider, isLoadingProvider, contract],
  );

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3Context() {
  return useContext(Web3Context);
}
