'use client';

import { CustomInput } from '@/app/components/CustomInput';
import { LoadingButton } from '@/app/components/LoadingButton';
import { useWeb3Context } from '@/app/contexts/Web3Context';
import { CheckCircleFillIcon, XCircleFillIcon } from '@primer/octicons-react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  Label,
  Text,
  Textarea,
  TextProps,
} from '@primer/react';
import { Banner } from '@primer/react/drafts';
import { Divider } from '@primer/react/lib-esm/deprecated/ActionList/Divider';
import { UserPendingData } from '@prisma/client';
import Image from 'next/image';
import { ReactNode, useEffect, useState } from 'react';
import { ContractExecutionError } from 'web3';
import { decryptUserDataAction } from '../action';
import { ForgotPrivateKeyForm } from './ForgotPrivateKeyForm';

type StudentCardProps = {
  ethAddress: string;
  userId: string;
};

type Card = {
  hashCard: string;
  expDate: number;
  studentPublicKey: string;
  isValid: boolean;
};

export function StudentCard({ ethAddress, userId }: StudentCardProps) {
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
          'Pode ser que sua solicitação ainda não foi aceita, tente novamente mais tarde ou entre em contato com a administração.'
        }
      />
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        overflowWrap: 'break-word',
        paddingBottom: 4,
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mt: 4,
              '@media (max-width: 480px)': {
                flexDirection: 'column',
                alignItems: 'inherit',
              },
            }}
          >
            <DecryptStudentCardForm />
            <ForgotPrivateKeyForm ethAddress={ethAddress} userId={userId} />
          </Box>
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
    const [privateKeyMode, setPrivateKeyMode] = useState<'write' | 'file'>(
      'write',
    );

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
      <Box>
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
            <Dialog.Header id="header">Descriptografar carteira</Dialog.Header>
            <Box
              sx={{
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <label htmlFor="private-key-mode">
                  Habilitar upload de arquivo para chave privada
                </label>
                <Checkbox
                  sx={{
                    borderRadius: '50%',
                  }}
                  id="private-key-mode"
                  onChange={() => {
                    setPrivateKeyMode(
                      privateKeyMode === 'write' ? 'file' : 'write',
                    );
                  }}
                />
              </Box>

              {privateKeyMode === 'write' && (
                <>
                  <label htmlFor="private_key">Chave privada:</label>
                  <Textarea
                    id="private_key"
                    sx={{ padding: '10px', borderRadius: '4px' }}
                    onChange={(e) => setPrivateKey(e.target.value)}
                  />
                </>
              )}

              {privateKeyMode === 'file' && (
                <CustomInput
                  sx={{
                    padding: '10px',
                    borderRadius: '4px',
                  }}
                  label="Chave privada"
                  name="private_key"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setPrivateKey(e.target?.result as string);
                    };
                    reader.readAsText(file);
                  }}
                />
              )}

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
      <CustomText
        label="Chave pública: "
        value={ethStudentCard.studentPublicKey}
      />

      <Divider />

      <CustomText
        label="Validate da carteira: "
        value={new Date(ethStudentCard.expDate).toLocaleDateString()}
      />

      <Divider />

      <Box
        sx={{
          display: 'flex',
          alignContent: 'center',
          gap: 2,
        }}
      >
        <Text sx={{ fontWeight: 600 }}>Status: </Text>
        <Label
          size="large"
          variant={ethStudentCard.isValid ? 'success' : 'danger'}
        >
          {ethStudentCard.isValid ? 'Válida' : 'Inválida'}
        </Label>
      </Box>

      <Divider />

      <CustomText
        label="Dados da carteira criptografada: "
        value={ethStudentCard.hashCard}
        sx={{
          overflowWrap: 'break-word',
          maxWidth: '60%',
        }}
      />
    </Box>
  );
}

function DecryptedStudentCard(studentCard: UserPendingData) {
  // TODO: improve styles
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingBottom: 4,
          gap: 4,
          '@media (max-width: 600px)': {
            flexDirection: 'column',
            alignItems: 'inherit',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <CustomText label="Nome: " value={studentCard.name} />
          <CustomText label="Email: " value={studentCard.email} />
          <CustomText label="CPF: " value={studentCard.cpf} />
          <Label
            size="large"
            variant="accent"
            sx={{
              width: 'fit-content',
            }}
          >
            {studentCard.course}
          </Label>
        </Box>

        <Box
          sx={{
            position: 'relative',
            height: '150px',
            width: '150px',
          }}
        >
          <Image
            src={studentCard.photoUrl}
            alt="Foto do aluno"
            fill
            sizes="100%"
            style={{
              objectFit: 'cover',
            }}
          />
        </Box>
      </Box>

      <Divider />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Text as="h3" sx={{ mt: 0 }}>
          Metadados:
        </Text>

        <CustomText
          label="Data de criação da carteira: "
          value={new Date(studentCard.createdAt).toLocaleDateString()}
        />
        <CustomText label="Curso: " value={studentCard.course} />
        <CustomText label="Matrícula: " value={studentCard.registration} />

        <Divider />

        <Text as="h3" sx={{ mt: 0 }}>
          Endereço:
        </Text>

        <CustomText label="CEP: " value={studentCard.cep} />
        <CustomText label="Endereço: " value={studentCard.address} />
        <CustomText label="Número: " value={studentCard.number} />
        <CustomText
          label="Complemento: "
          value={studentCard.complement ?? 'Não informado'}
        />
      </Box>
    </>
  );
}

type CustomTextProps = TextProps & {
  label: string;
  value: ReactNode;
};

function CustomText({ label, value, ...props }: CustomTextProps) {
  return (
    <Box>
      <Text sx={{ fontWeight: 600 }}>{label}</Text>
      <Text {...props}>{value}</Text>
    </Box>
  );
}
