'use client';

import { LoadingButton } from '@/app/components/LoadingButton';
import { useWeb3Context } from '@/app/contexts/Web3Context';
import { PendingUsersOutput } from '@/repositories/userRepository';
import { KebabHorizontalIcon } from '@primer/octicons-react';
import {
  ActionList,
  ActionMenu,
  Avatar,
  Box,
  Dialog,
  Text,
  Textarea,
} from '@primer/react';
import { Banner, DataTable, Table } from '@primer/react/drafts';
import { UserPendingData } from '@prisma/client';
import Image from 'next/image';
import { useState } from 'react';
import {
  deleteUserPendingDataAction,
  encryptUserPendingDataAction,
  resetOldEthAddressAction,
  updateUserAction,
  updateUserRejectionReasonAction,
} from '../action';

type PendingTableProps = {
  pendingCards: PendingUsersOutput;
};

export function PendingTable({ pendingCards }: PendingTableProps) {
  const { account, provider } = useWeb3Context();
  const [isUserImageModalOpen, setIsUserImageModalOpen] = useState(false);
  const [userFocused, setUserFocused] = useState<UserPendingData | null>(null);

  function handleOpenImageModal(pendingData: UserPendingData) {
    setUserFocused(pendingData);
    setIsUserImageModalOpen(true);
  }

  function handleCloseImageModal() {
    setUserFocused(null);
    setIsUserImageModalOpen(false);
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          gap: 2,
          marginBottom: 4,
          textWrap: 'nowrap',
          overflowX: 'hidden',
          '@media (max-width: 700px)': {
            fontSize: 10,
            maxWidth: '200px',
          },
        }}
      >
        <Text>Account connected: {account}</Text>
        <Text>
          Provider:{' '}
          {provider === 'INJECTED'
            ? 'injected provider (metamask)'
            : 'ganache local blockchain'}
        </Text>
      </Box>

      <Table.Container>
        <Table.Title as="h1" id="pending-cards">
          Solicitações pendentes
        </Table.Title>
        <Table.Subtitle as="h3" id="pending-cards-subtitle">
          Carteiras de estudante pendentes de emissão
        </Table.Subtitle>
        <DataTable
          aria-labelledby="pending-cards"
          aria-describedby="pending-cards-subtitle"
          data={pendingCards}
          columns={[
            {
              header: 'Foto',
              field: 'photoUrl',
              maxWidth: '80px',
              renderCell: (pendingData) => {
                return (
                  <Avatar
                    sx={{
                      ':hover': {
                        cursor: 'pointer',
                      },
                      width: 30,
                      height: 30,
                    }}
                    onClick={() => handleOpenImageModal(pendingData)}
                    src={pendingData.photoUrl}
                    alt={`foto de ${pendingData.name}`}
                  />
                );
              },
            },
            {
              header: 'Name',
              field: 'name',
            },
            {
              header: 'Tipo solicitação',
              field: 'user.oldEthAddress',
              renderCell: (pendingData) => {
                if (pendingData.user.oldEthAddress) {
                  return '2° via';
                }

                return '1° via';
              },
            },
            {
              header: 'Email',
              field: 'email',
            },
            {
              header: 'CPF',
              field: 'cpf',
            },
            {
              header: 'CEP',
              field: 'cep',
            },
            {
              header: 'Endereço',
              field: 'address',
            },
            {
              header: 'Número',
              field: 'number',
            },
            {
              header: 'Complemento',
              field: 'complement',
              renderCell: (pendingData) => {
                return pendingData.complement || 'Nenhum';
              },
            },
            {
              header: 'Curso',
              field: 'course',
            },
            {
              header: 'Data de solicitação',
              field: 'createdAt',
              renderCell: (pendingData) => {
                return new Date(pendingData.createdAt).toLocaleDateString(
                  'pt-BR',
                );
              },
              align: 'end',
            },
            {
              header: 'Ações',
              field: 'id',
              renderCell: (pendingData) => {
                return (
                  <Table.Actions>
                    <Actions userPendingData={pendingData} />
                  </Table.Actions>
                );
              },
            },
          ]}
        />
      </Table.Container>

      <Dialog
        isOpen={isUserImageModalOpen && !!userFocused}
        onDismiss={() => handleCloseImageModal()}
      >
        <Dialog.Header id="header">Foto de {userFocused?.name}</Dialog.Header>

        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              height: '350px',
              width: '300px',
            }}
          >
            <Image
              src={userFocused?.photoUrl ?? ''}
              alt="Foto do aluno"
              fill
              sizes="100%"
              style={{
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

type ActionsProps = {
  userPendingData: PendingUsersOutput[0];
};

function Actions({ userPendingData }: ActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { web3Provider, account, contract } = useWeb3Context();

  async function handleIssueCard() {
    if (!web3Provider || !contract || !account) return;

    const { data, error } = await encryptUserPendingDataAction(userPendingData);

    if (!data) {
      setErrorMessage(error);
      setIsDialogOpen(true);
      return;
    }

    if (userPendingData.user.oldEthAddress) {
      // Invalidates old student card if it exists
      await contract.methods
        .invalidateCard(userPendingData.user.oldEthAddress)
        .send({
          from: account,
        });

      await resetOldEthAddressAction(userPendingData.userId);
    }

    const currentDate = new Date();
    const expirationDateInTimestamp = new Date(
      currentDate.setMonth(currentDate.getMonth() + 6),
    ).getTime();

    try {
      await contract.methods
        .issueCard(
          data.encryptedData,
          expirationDateInTimestamp,
          data.userEthAddress,
        )
        .send({
          from: account,
          gas: '3000000',
          gasPrice: web3Provider.utils.toWei('10', 'gwei'),
        })
        .on('transactionHash', async (hash) => {
          const actionsPromises = Promise.all([
            updateUserAction(userPendingData.userId, {
              status: 'APPROVED',
              transactionHash: hash,
            }),
            deleteUserPendingDataAction(userPendingData.id),
          ]);

          await actionsPromises;
        });

      console.log({
        hashCard: data.encryptedData,
        expDate: expirationDateInTimestamp,
        studentPublicKey: data.userEthAddress,
      });
    } catch (error) {
      // TODO: handle error
      console.error(error);
    }
  }

  async function handleRejectCard(userPendingData: UserPendingData) {
    if (!rejectionReason) {
      setErrorMessage('Por favor, informe o motivo da rejeição');
      return;
    }

    await updateUserRejectionReasonAction(userPendingData.id, rejectionReason);
    await updateUserAction(userPendingData.userId, {
      status: 'REJECTED',
      transactionHash: '',
    });
  }

  return (
    <>
      <ActionMenu>
        <ActionMenu.Button>
          <KebabHorizontalIcon />
        </ActionMenu.Button>
        <ActionMenu.Overlay
          width="small"
          sx={{
            width: 'fit-content',
          }}
        >
          <ActionList>
            <ActionList.Item
              onClick={async () => {
                await handleIssueCard();
              }}
            >
              Aprovar
            </ActionList.Item>

            <ActionList.Item
              onClick={() => {
                setIsDialogOpen(true);
              }}
            >
              Rejeitar
            </ActionList.Item>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>

      <Dialog
        isOpen={isDialogOpen}
        onDismiss={() => setIsDialogOpen(false)}
        sx={{
          minHeight: '300px',
        }}
      >
        <Dialog.Header id="header">
          Rejeitar solicitação de: {userPendingData.name}
        </Dialog.Header>
        <Box
          sx={{
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <label htmlFor="rejection_reason">Motivo da rejeição:</label>
          <Textarea
            id="rejection_reason"
            sx={{ padding: '10px', borderRadius: '4px' }}
            onChange={(e) => setRejectionReason(e.target.value)}
          />

          {errorMessage && <Banner variant="critical" title={errorMessage} />}

          <LoadingButton
            onClick={async () => handleRejectCard(userPendingData)}
          >
            Rejeitar solicitação de {userPendingData.name}
          </LoadingButton>
        </Box>
      </Dialog>
    </>
  );
}
