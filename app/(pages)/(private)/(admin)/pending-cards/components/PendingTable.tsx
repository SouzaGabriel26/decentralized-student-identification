'use client';

import { LoadingButton } from '@/app/components/LoadingButton';
import { useWeb3Context } from '@/app/contexts/Web3Context';
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
import { useState } from 'react';
import {
  deleteUserPendingDataAction,
  encryptUserPendingDataAction,
  updateUserRejectionReasonAction,
  updateUserStatusAction,
} from '../action';

type PendingTableProps = {
  pendingCards: UserPendingData[];
};

export function PendingTable({ pendingCards }: PendingTableProps) {
  const { account, provider } = useWeb3Context();

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
              renderCell: (row) => {
                return (
                  <Avatar src={row.photoUrl} alt={`foto de ${row.name}`} />
                );
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
              renderCell: (row) => {
                return row.complement || 'Nenhum';
              },
            },
            {
              header: 'Curso',
              field: 'course',
            },
            {
              header: 'Data de solicitação',
              field: 'createdAt',
              renderCell: (row) => {
                return new Date(row.createdAt).toLocaleDateString('pt-BR');
              },
              align: 'end',
            },
            {
              header: 'Ações',
              field: 'id',
              renderCell: (row) => {
                return (
                  <Table.Actions>
                    <Actions userPendingData={row} />
                  </Table.Actions>
                );
              },
            },
          ]}
        />
      </Table.Container>
    </>
  );
}

type ActionsProps = {
  userPendingData: UserPendingData;
};

function Actions({ userPendingData }: ActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { web3Provider, account, contract } = useWeb3Context();

  async function handleIssueCard(userPendingData: UserPendingData) {
    if (!web3Provider || !contract) return;

    const { data, error } = await encryptUserPendingDataAction(userPendingData);

    if (!data) {
      // TODO: handle error
      console.log(error);
      return;
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
          from: account ?? undefined,
          gas: '3000000',
          gasPrice: web3Provider.utils.toWei('10', 'gwei'),
        });

      console.log({
        hashCard: data.encryptedData,
        expDate: expirationDateInTimestamp,
        studentPublicKey: data.userEthAddress,
      });

      await deleteUserPendingDataAction(userPendingData.id);
      await updateUserStatusAction(userPendingData.userId, 'APPROVED');
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
    await updateUserStatusAction(userPendingData.userId, 'REJECTED');
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
                await handleIssueCard(userPendingData);
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
