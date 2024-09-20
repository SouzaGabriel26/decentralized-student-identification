'use client';

import { KebabHorizontalIcon } from '@primer/octicons-react';
import { ActionList, ActionMenu, Avatar } from '@primer/react';
import { DataTable, Table } from '@primer/react/drafts';
import { UserPendingData } from '@prisma/client';

type PendingTableProps = {
  pendingCards: UserPendingData[];
};

export function PendingTable({ pendingCards }: PendingTableProps) {
  return (
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
              return <Avatar src={row.photoUrl} alt={`foto de ${row.name}`} />;
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
                  <Actions pendingDataId={row.id} userId={row.userId} />
                </Table.Actions>
              );
            },
          },
        ]}
      />
    </Table.Container>
  );
}

type ActionsProps = {
  pendingDataId: string;
  userId: string;
};

function Actions({ pendingDataId, userId }: ActionsProps) {
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
            onClick={() => {
              // TODO: delete from UserPendingData where id = row.id
              console.log(
                `APROVAR:\n- ID: ${pendingDataId}\n- UserID: ${userId}`,
              );
            }}
          >
            Aprovar
          </ActionList.Item>

          <ActionList.Item
            onClick={() => {
              console.log(
                `REJEITAR:\n- ID: ${pendingDataId}\n- UserID: ${userId}`,
              );
            }}
          >
            Rejeitar
          </ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  );
}
