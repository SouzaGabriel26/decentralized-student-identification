'use client';

import { CopyToClipBoard } from '@/app/components/CopyToClipboard';
import { Button, Flash } from '@primer/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type InstructionsProps = {
  data: {
    message: string;
    privateKey: string;
  };
  type: 'register' | 'forgotPrivateKey';
};

export function Instructions({ data, type }: InstructionsProps) {
  const [isCopied, setIsCopied] = useState(false);
  const route = useRouter();

  return (
    <Flash
      sx={{
        maxWidth: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
      variant="warning"
      title={'Solicitação de matrícula enviada com sucesso!'}
    >
      <p>{data.message}</p>
      <p>
        Por enquanto, é muito importante que você guarde a sua chave privada em
        um local seguro. Importante também não mostrar para ninguém.
      </p>

      <CopyToClipBoard
        contentToCopy={data.privateKey}
        isCopied={isCopied}
        setIsCopied={setIsCopied}
      >
        Copiar chave privada
      </CopyToClipBoard>

      {type === 'register' ? (
        <Button
          onClick={() => {
            route.replace('/login');
            route.refresh();
          }}
          disabled={!isCopied}
          variant="primary"
          sx={{
            mt: 4,
            display: 'flex',
            width: '100%',
          }}
        >
          Logar na conta
        </Button>
      ) : (
        <Button
          onClick={() => {
            route.replace('/student-card/status');
            route.refresh();
          }}
          disabled={!isCopied}
          variant="primary"
          sx={{
            mt: 4,
            display: 'flex',
            width: '100%',
          }}
        >
          Ver status da solicitação
        </Button>
      )}
    </Flash>
  );
}
