'use client';

import { CheckIcon, CopyIcon } from '@primer/octicons-react';
import { Button, ButtonProps } from '@primer/react';
import { ReactNode } from 'react';

type CopyToClipBoardProps = ButtonProps & {
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
  ...props
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
      {...props}
    >
      {isCopied ? <CheckIcon /> : <CopyIcon />}
      {isCopied ? 'Copiado!' : children}
    </Button>
  );
}
