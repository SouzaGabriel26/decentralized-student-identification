'use client';

import { CopyToClipBoard } from '@/app/components/CopyToClipboard';
import { LoadingButton } from '@/app/components/LoadingButton';
import { useWeb3Context } from '@/app/contexts/Web3Context';
import { ClockFillIcon, XCircleFillIcon } from '@primer/octicons-react';
import { Box, Button, Dialog, Label, Text } from '@primer/react';
import { Banner } from '@primer/react/drafts';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { EventLog, TransactionRevertWithCustomError } from 'web3';

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
  const { contract } = useWeb3Context();

  useEffect(() => {
    getIssuedCards();

    async function getIssuedCards() {
      if (!contract) return;

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
  }, [contract]);

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
  const [isCardValid, setIsCardValid] = useState(true);
  const [isInvalidateCardModalOpen, setIsInvalidateCardModalOpen] =
    useState(false);
  const [isExtendCardExpTimeModalOpen, setIsExtendCardExpTimeModalOpen] =
    useState(false);
  const [newExpirationTime, setNewExpirationTime] = useState<string | null>(
    null,
  );
  const [extendCardExpTimeError, setExtendExpTimeError] = useState<
    string | null
  >();

  const { contract, account } = useWeb3Context();

  const formattedDate = new Date(card.cardIssued.expDate).toLocaleDateString();

  async function handleInvalidateCard() {
    if (!contract || !account) return;

    await contract.methods
      .invalidateCard(card.cardIssued.studentPublicKey)
      .send({
        from: account,
      });

    setIsCardValid(false);
    setIsInvalidateCardModalOpen(false);
  }

  async function handleExtendCardExpirationTime() {
    if (!contract || !account) return;

    const currentExpirationTime = new Date(card.cardIssued.expDate);

    const newExpirationDate = new Date(
      currentExpirationTime.setMonth(currentExpirationTime.getMonth() + 6),
    );

    try {
      await contract.methods
        .extendCardExpiration(
          card.cardIssued.studentPublicKey,
          newExpirationDate.getTime(),
        )
        .send({
          from: account,
          gas: '3000000',
        });

      setNewExpirationTime(newExpirationDate.toLocaleDateString());
      setIsExtendCardExpTimeModalOpen(false);
    } catch (error) {
      console.error(error);
      if (error instanceof TransactionRevertWithCustomError) {
        const { message } = error.customErrorArguments;
        setExtendExpTimeError(String(message));
      }
    }
  }

  useEffect(() => {
    getCardStatus();

    async function getCardStatus() {
      if (!contract) return;

      const studentCard = await contract.methods
        .getCard(card.cardIssued.studentPublicKey)
        .call();

      if (new Date(Number(studentCard.expDate)) < new Date()) {
        setIsCardValid(false);
        return;
      }

      if (Number(studentCard.expDate) !== card.cardIssued.expDate) {
        const newExpTimeInTimestamp = Number(studentCard.expDate);
        setNewExpirationTime(
          new Date(newExpTimeInTimestamp).toLocaleDateString(),
        );
      }

      setIsCardValid(studentCard.isValid);
    }
  }, [contract, card]);

  return (
    <>
      <Box
        title={
          isCardValid ? 'Carteira válida' : 'Carteira inválida ou expirada'
        }
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
          borderColor: isCardValid ? 'green' : 'red',
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
          <Link
            style={{
              color: 'inherit',
              textDecoration: 'none',
            }}
            href={
              process.env.NODE_ENV === 'production'
                ? `https://sepolia.etherscan.io/tx/${card.transactionHash}`
                : '#'
            }
            target={process.env.NODE_ENV === 'production' ? '_blank' : '_self'}
          >
            Transaction Hash:
          </Link>
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
            {newExpirationTime ? newExpirationTime : formattedDate}
          </Text>
        </span>

        <span>
          <Text sx={{ display: 'block' }}>Student public key:</Text>
          <Label sx={{ backgroundColor: 'canvas.overlay', p: 2 }}>
            {card.cardIssued.studentPublicKey}
          </Label>
        </span>

        <Box
          sx={{
            position: 'absolute',
            bottom: 2,
            right: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <CopyToClipBoard
            contentToCopy={JSON.stringify(card)}
            isCopied={isCopied}
            setIsCopied={setIsCopied}
          />

          <Button
            disabled={!isCardValid}
            title="Invalidar carteira"
            onClick={() => setIsInvalidateCardModalOpen(true)}
          >
            <XCircleFillIcon />
          </Button>

          <Button
            disabled={!isCardValid}
            title="Estender tempo de expiração da carteira"
            onClick={() => setIsExtendCardExpTimeModalOpen(true)}
          >
            <ClockFillIcon />
          </Button>
        </Box>
      </Box>

      <InvalidateCard />
      <ExtendCardExpirationTime />
    </>
  );

  function InvalidateCard() {
    return (
      <Dialog
        isOpen={isInvalidateCardModalOpen}
        onDismiss={() => setIsInvalidateCardModalOpen(false)}
        sx={{
          '@media (max-width: 600px)': {
            maxHeight: '200px',
          },
        }}
      >
        <Dialog.Header>Confirmação</Dialog.Header>

        <Box
          sx={{
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Text sx={{ textAlign: 'center' }}>
            Tem certeza que deseja invalidar a carteira?
          </Text>

          <LoadingButton onClick={handleInvalidateCard}>
            Confirmar
          </LoadingButton>
        </Box>
      </Dialog>
    );
  }

  function ExtendCardExpirationTime() {
    return (
      <Dialog
        isOpen={isExtendCardExpTimeModalOpen}
        onDismiss={() => setIsExtendCardExpTimeModalOpen(false)}
        sx={{
          '@media (max-width: 600px)': {
            maxHeight: '200px',
          },
        }}
      >
        <Dialog.Header>Confirmação</Dialog.Header>

        <Box
          sx={{
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Text sx={{ textAlign: 'center' }}>
            Tem certeza que deseja aumentar o tempo de expiração da carteira em
            6 mêses?
          </Text>

          {extendCardExpTimeError && (
            <Banner variant="critical" title={extendCardExpTimeError} />
          )}
          <LoadingButton
            disabled={!!extendCardExpTimeError}
            onClick={handleExtendCardExpirationTime}
          >
            Confirmar
          </LoadingButton>
        </Box>
      </Dialog>
    );
  }
}
