'use client';

import { CheckIcon, CopyIcon } from '@primer/octicons-react';
import { Button } from '@primer/react';
import { ReactNode } from 'react';

type CopyToClipBoardProps = {
  contentToCopy: string;
  setIsCopied: (value: boolean) => void;
  isCopied: boolean;
  children?: ReactNode;
};

export function CopyToClipBoard({
  contentToCopy,
  isCopied,
  setIsCopied,
  children,
}: CopyToClipBoardProps) {
  function handleCopyToClipBoard() {
    navigator.clipboard.writeText(contentToCopy);
    setIsCopied(true);
  }

  return (
    <Button
      sx={{
        width: 'fit-content',
        margin: 'auto',
      }}
      title="Copiar"
      onClick={handleCopyToClipBoard}
    >
      {isCopied ? <CheckIcon /> : <CopyIcon />}
      {isCopied ? 'Copiado!' : children}
    </Button>
  );
}
