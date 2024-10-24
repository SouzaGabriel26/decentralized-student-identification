'use client';

import { CopyToClipBoard } from '@/app/components/CopyToClipboard';
import { DownloadIcon } from '@primer/octicons-react';
import { Button, Flash } from '@primer/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type InstructionsProps = {
  data: {
    message: string;
    privateKey: string;
    userName: string;
  };
  type: 'register' | 'forgotPrivateKey';
};

export function Instructions({ data, type }: InstructionsProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const route = useRouter();

  function downloadPrivateKey(privateKey: string, fileName: string) {
    const blob = new Blob([privateKey]);

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.concat('.txt');
    link.click();
    URL.revokeObjectURL(url);
  }

  const fileName = 'chave-privada-'.concat(data.userName);

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

      <Button
        title="Baixar chave privada em arquivo .txt"
        sx={{
          width: 'fit-content',
          marginX: 'auto',
        }}
        onClick={() => {
          downloadPrivateKey(data.privateKey, fileName);
          setIsDownloaded(true);
        }}
      >
        <DownloadIcon />
        Baixar chave privada
      </Button>

      {type === 'register' ? (
        <Button
          onClick={() => {
            route.replace('/login');
            route.refresh();
          }}
          disabled={!isCopied && !isDownloaded}
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
          disabled={!isCopied && !isDownloaded}
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
