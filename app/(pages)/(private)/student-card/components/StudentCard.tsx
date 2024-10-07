'use client';

import { CustomInput } from '@/app/components/CustomInput';
import { LoadingButton } from '@/app/components/LoadingButton';
import { useWeb3Context } from '@/app/contexts/Web3Context';
import { CheckCircleFillIcon, XCircleFillIcon } from '@primer/octicons-react';
import { Box, Button, Dialog, Label, Text, Textarea } from '@primer/react';
import { Banner } from '@primer/react/drafts';
import { UserPendingData } from '@prisma/client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ContractExecutionError } from 'web3';
import { decryptUserDataAction } from '../action';

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
  const [cardNotFoundError, setCardNotFoundError] = useState('');
  const [ethStudentCard, setEthStudentCard] = useState<Card | null>(null);
  const [decryptedStudentCard, setDecryptedStudentCard] =
    useState<UserPendingData | null>(null);

  const { contract } = useWeb3Context();

  useEffect(() => {
    getStudentCard();

    async function getStudentCard() {
      try {
        if (!contract) return;

        const studentCard = await contract.methods.getCard(ethAddress).call();
        if (studentCard) {
          setEthStudentCard({
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
          setCardNotFoundError(String(error.cause.errorArgs!.message));
        }
      }
    }
  }, [contract, ethAddress]);

  if (cardNotFoundError) {
    return (
      <Banner
        title={cardNotFoundError}
        variant="critical"
        description={
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
          fontSize: '12px',
        },
      }}
    >
      <Text
        as="h2"
        fontWeight="bold"
        sx={{ display: 'flex', gap: 2, alignItems: 'center' }}
      >
        {ethStudentCard && !decryptedStudentCard && (
          <>
            Carteira criptografada
            <XCircleFillIcon />
          </>
        )}

        {decryptedStudentCard && (
          <>
            Carteira descriptografada
            <CheckCircleFillIcon />
          </>
        )}
      </Text>

      {ethStudentCard && !decryptedStudentCard && (
        <>
          <EncryptedStudentCard {...ethStudentCard} />
          <DecryptStudentCardForm />
        </>
      )}

      {decryptedStudentCard && (
        <DecryptedStudentCard {...decryptedStudentCard} />
      )}
    </Box>
  );

  function DecryptStudentCardForm() {
    const [password, setPassword] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [invalidCredentialsError, setInvalidCredentialsError] = useState('');

    async function handleDecryptStudentCard(event: React.FormEvent) {
      event.preventDefault();

      const result = await decryptUserDataAction({
        encryptedData: ethStudentCard!.hashCard,
        privateKey,
        passphrase: password,
      });

      if (result.error) {
        setInvalidCredentialsError(result.error);
        return;
      }

      setDecryptedStudentCard(result.data);
    }

    return (
      <Box
        sx={{
          marginTop: 4,
        }}
      >
        <Button
          disabled={!ethStudentCard?.isValid}
          onClick={() => setIsDialogOpen(true)}
        >
          Descriptografar carteira
        </Button>

        <Dialog
          isOpen={isDialogOpen}
          onDismiss={() => setIsDialogOpen(false)}
          sx={{
            minHeight: '300px',
          }}
        >
          <form>
            <Dialog.Header id="header">Title</Dialog.Header>
            <Box
              sx={{
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <label htmlFor="private_key">Chave privada:</label>
              <Textarea
                id="private_key"
                sx={{ padding: '10px', borderRadius: '4px' }}
                onChange={(e) => setPrivateKey(e.target.value)}
              />

              <CustomInput
                label="Senha"
                name="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />

              {invalidCredentialsError && (
                <Banner title={invalidCredentialsError} variant="critical" />
              )}

              <LoadingButton onClick={handleDecryptStudentCard} type="submit">
                Descriptografar carteira
              </LoadingButton>
            </Box>
          </form>
        </Dialog>
      </Box>
    );
  }
}

function EncryptedStudentCard(ethStudentCard: Card) {
  return (
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
        Hash: {ethStudentCard.hashCard}
      </Text>
      <Text>
        Validade: {new Date(ethStudentCard.expDate).toLocaleDateString()}
      </Text>
      <Text>Chave pública: {ethStudentCard.studentPublicKey}</Text>
      <Box
        sx={{
          display: 'flex',
          alignContent: 'center',
          gap: 2,
        }}
      >
        <Text>Status: </Text>
        <Label
          size="large"
          variant={ethStudentCard.isValid ? 'success' : 'danger'}
        >
          {ethStudentCard.isValid ? 'Válida' : 'Inválida'}
        </Label>
      </Box>
    </Box>
  );
}

function DecryptedStudentCard(studentCard: UserPendingData) {
  // TODO: improve styles
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      <Text>Nome: {studentCard.name}</Text>
      <Text>Curso: {studentCard.course}</Text>
      <Text>CPF: {studentCard.cpf}</Text>
      <Text>Email: {studentCard.email}</Text>
      <Text>Endereço: {studentCard.address}</Text>
      <Text>
        CEP: {studentCard.cep}, Número: {studentCard.number}
      </Text>
      {studentCard.complement && (
        <Text>Complemento: {studentCard.complement}</Text>
      )}
      <Text>
        Curso:
        <Label variant="success">{studentCard.course}</Label>
      </Text>
      <Text>Matricula: {studentCard.registration}</Text>
      <Text>
        Data matrícula: {new Date(studentCard.createdAt).toLocaleString()}
      </Text>
      <Image
        src={studentCard.photoUrl}
        alt="Foto do aluno"
        width={200}
        height={200}
      />
    </Box>
  );
}
