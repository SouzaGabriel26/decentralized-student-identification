'use client';

import { LoadingButton } from '@/app/components/LoadingButton';
import { useWeb3Context } from '@/app/contexts/Web3Context';
import { Box, Button, Dialog, Label, Text } from '@primer/react';
import { Divider } from '@primer/react/lib-esm/ActionList/Divider';
import { useState } from 'react';
import { updateUserStatusAction } from '../action';

type ForgotPrivateKeyFormProps = {
  ethAddress: string;
  userId: string;
};

export function ForgotPrivateKeyForm({
  ethAddress,
  userId,
}: ForgotPrivateKeyFormProps) {
  const [isForgotPrivateKeyModalOpen, setIsForgotPrivateKeyModalOpen] =
    useState(false);

  const { account, contract } = useWeb3Context();

  async function handleForgotPrivateKey() {
    if (!contract || !account) return;

    await contract.methods.invalidateCard(ethAddress).send({ from: account });

    updateUserStatusAction({ status: 'FORGOT_PK', userId });

    setIsForgotPrivateKeyModalOpen(false);
  }

  return (
    <Box>
      <Button
        variant="invisible"
        onClick={() => setIsForgotPrivateKeyModalOpen(true)}
      >
        Esqueci minha chave privada
      </Button>

      <Dialog
        isOpen={isForgotPrivateKeyModalOpen}
        onDismiss={() => setIsForgotPrivateKeyModalOpen(false)}
        sx={{
          width: 'fit-content',
        }}
      >
        <Dialog.Header>Esqueci minha chave privada</Dialog.Header>

        <Box
          sx={{
            p: 4,
          }}
        >
          <Text as="h4" sx={{ mt: 0 }}>
            Se você esqueceu sua chave privada, terá que pagar uma taxa para
            recuperá-la.
          </Text>

          <Text>
            A taxa é necessária pois teremos que refazer o processo de
            criptografia com novas chaves públicas e privadas.
          </Text>

          <Divider />

          <Text sx={{ display: 'block' }}>
            Passos realizados para geração de uma nova carteira:
          </Text>

          <ol>
            <li>
              Invalidação da carteira atual
              <Label variant="attention" sx={{ ml: 2 }}>
                Admin
              </Label>
            </li>

            <li>
              Geração de um novo par de chaves público/privado
              <Label variant="attention" sx={{ ml: 2 }}>
                User
              </Label>
            </li>

            <li>
              Preenchimento do formulário novamente com os dados
              <Label variant="attention" sx={{ ml: 2 }}>
                User
              </Label>
            </li>

            <li>
              Aprovação/Rejeição da carteira
              <Label variant="attention" sx={{ ml: 2 }}>
                Admin
              </Label>
            </li>
          </ol>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <Button
              variant="danger"
              onClick={() => setIsForgotPrivateKeyModalOpen(false)}
            >
              Cancelar
            </Button>
            <LoadingButton
              sx={{ mt: 0 }}
              variant="primary"
              onClick={handleForgotPrivateKey}
            >
              Proseguir
            </LoadingButton>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
