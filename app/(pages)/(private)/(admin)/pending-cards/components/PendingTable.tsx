'use client';

import { useWeb3Context } from '@/app/contexts/Web3Context';
import { KebabHorizontalIcon } from '@primer/octicons-react';
import { ActionList, ActionMenu, Avatar, Box, Text } from '@primer/react';
import { DataTable, Table } from '@primer/react/drafts';
import { UserPendingData } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { encryptUserPendingDataAction } from '../action';

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
  const { web3Provider, account, contract } = useWeb3Context();
  const router = useRouter();

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
      const result = await contract.methods
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

      console.log({ result });

      router.refresh();
    } catch (error) {
      // TODO: handle error
      console.log(error);
    }
  }

  return (
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

              // TODO: delete from UserPendingData where id = row.id
            }}
          >
            Aprovar
          </ActionList.Item>

          <ActionList.Item
            onClick={() => {
              console.log('REJEITAR:');
            }}
          >
            Rejeitar
          </ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  );
}
