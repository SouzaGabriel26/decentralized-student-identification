'use client';

import { CopyToClipBoard } from '@/app/components/CopyToClipboard';
import { useWeb3Context } from '@/app/contexts/Web3Context';
import { Box, Label, Text } from '@primer/react';
import { useEffect, useState } from 'react';
import { EventLog } from 'web3';

type IssuedCardEvent = {
  blockHash: string;
  transactionHash: string;
  to: string;
  cardIssued: {
    expDate: number;
    studentPublicKey: string;
  };
};

export default function Page() {
  const [issuedCards, setIssuedCards] = useState<Array<IssuedCardEvent>>([]);
  const { web3Provider, contract } = useWeb3Context();

  useEffect(() => {
    getIssuedCards();

    async function getIssuedCards() {
      if (!web3Provider || !contract) return;

      const events = (await contract.getPastEvents('CardIssued', {
        fromBlock: 0,
        toBlock: 'latest',
      })) as EventLog[];

      setIssuedCards(
        events.map((event) => ({
          blockHash: event.blockHash!,
          transactionHash: event.transactionHash!,
          to: event.address!,
          cardIssued: {
            expDate: Number(event.returnValues._expDate),
            studentPublicKey: event.returnValues._studentPublicKey as string,
          },
        })),
      );
    }
  }, [web3Provider, contract]);

  if (!issuedCards.length) {
    return (
      <Text
        sx={{
          fontSize: 20,
          color: 'slategray',
        }}
      >
        Nenhuma carteira emitida!
      </Text>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
        gap: 4,
        placeItems: 'center',
      }}
    >
      {issuedCards.map((card) => (
        <Card card={card} key={card.cardIssued.studentPublicKey} />
      ))}
    </Box>
  );
}

type CardProps = {
  card: IssuedCardEvent;
};

function Card({ card }: CardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const formattedDate = new Date(card.cardIssued.expDate).toLocaleDateString();

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '500px',
        gap: 2,
        backgroundColor: 'canvas.inset',
        border: '1px solid',
        borderRadius: 2,
        padding: 2,
        '@media (max-width: 620px)': {
          fontSize: 10,
        },
        overflowX: 'auto',
      }}
    >
      <span>
        <Text sx={{ display: 'block' }}>Block Hash:</Text>
        <Label sx={{ backgroundColor: 'canvas.overlay', p: 2 }}>
          {card.blockHash}
        </Label>
      </span>

      <span>
        <Text sx={{ display: 'block' }}>Transaction Hash:</Text>
        <Label sx={{ backgroundColor: 'canvas.overlay', p: 2 }}>
          {card.transactionHash}
        </Label>
      </span>

      <span>
        <Text sx={{ display: 'block' }}>Expiration Date:</Text>
        <Text
          sx={{
            color: 'slategray',
          }}
        >
          {formattedDate}
        </Text>
      </span>

      <span>
        <Text sx={{ display: 'block' }}>Student public key:</Text>
        <Label sx={{ backgroundColor: 'canvas.overlay', p: 2 }}>
          {card.cardIssued.studentPublicKey}
        </Label>
      </span>

      <CopyToClipBoard
        sx={{
          position: 'absolute',
          bottom: 2,
          right: 2,
        }}
        contentToCopy={JSON.stringify(card)}
        isCopied={isCopied}
        setIsCopied={setIsCopied}
      />
    </Box>
  );
}
