'use client';

import { useWeb3Context } from '@/app/contexts/Web3Context';
import { Box, Text } from '@primer/react';
import { Banner } from '@primer/react/drafts';
import { useEffect, useState } from 'react';
import { ContractExecutionError } from 'web3';

type StudentCardProps = {
  ethAddress: string;
};

type Card = {
  hashCard: string;
  expDate: number;
  studentPublicKey: string;
  isValid: boolean;
};

export function StudentCard({ ethAddress }: StudentCardProps) {
  const [errorMessage, setErrorMessage] = useState('');
  const [studentCard, setStudentCard] = useState<Card | null>(null);
  const { contract } = useWeb3Context();

  useEffect(() => {
    getStudentCard();

    async function getStudentCard() {
      try {
        if (!contract) return;

        const studentCard = await contract.methods.getCard(ethAddress).call();
        if (studentCard) {
          setStudentCard({
            expDate: Number(studentCard.expDate),
            hashCard: studentCard.hashCard,
            studentPublicKey: studentCard.studentPublicKey,
            isValid: studentCard.isValid,
          });
        }
      } catch (error) {
        console.log(error);
        if (error instanceof ContractExecutionError) {
          process.env.NODE_ENV === 'development' && console.error(error);
          setErrorMessage(String(error.cause.errorArgs!.message));
        }
      }
    }
  }, [contract, ethAddress]);

  if (errorMessage) {
    return (
      <Banner
        title={errorMessage}
        variant="critical"
        description={
          errorMessage === 'Carteira nao encontrada.' &&
          'Pode ser que sua solicitação ainda não foi aceita, tente novamente mais tarde.'
        }
      />
    );
  }

  return (
    <Box
      sx={{
        width: '500px',
        overflowWrap: 'break-word',
        '@media (max-width: 480px)': {
          width: '300px',
        },
      }}
    >
      <Text as="h2" fontSize={2} fontWeight="bold">
        Carteira
      </Text>
      {studentCard ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <Text
            sx={{
              overflowWrap: 'break-word',
            }}
          >
            Hash: {studentCard.hashCard}
          </Text>
          <Text>
            Validade: {new Date(studentCard.expDate).toLocaleDateString()}
          </Text>
          <Text>Chave pública: {studentCard.studentPublicKey}</Text>
          <Text>Estado: {studentCard.isValid ? 'Válida' : 'Inválida'}</Text>
        </Box>
      ) : (
        <Text>Carregando...</Text>
      )}
    </Box>
  );
}
