'use client';

import { contractAddress } from '@/contract/contract-address';
import { abi } from '@/contract/smart-contract-abi';
import { constants } from '@/utils/constants';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Contract, Web3 } from 'web3';

const IS_PRODUCTION_ENVIRONMENT = process.env.NODE_ENV === 'production';

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

    if (provider === 'INJECTED') {
      return new Web3(window.ethereum);
    }

    return new Web3(constants.ganache_url);
  }, [provider]);

  const contract = useMemo(() => {
    if (!web3 || !provider) return null;

    if (provider === 'GANACHE') {
      return new web3.eth.Contract(abi, contractAddress);
    }

    return new web3.eth.Contract(abi, constants.smart_contract_address);
  }, [web3, provider]);

  useEffect(() => {
    if (IS_PRODUCTION_ENVIRONMENT) {
      setProvider(window.ethereum ? 'INJECTED' : null);
      return;
    }

    setProvider('GANACHE');
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
