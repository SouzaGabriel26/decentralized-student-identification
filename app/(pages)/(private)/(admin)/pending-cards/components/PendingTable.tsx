'use client';

import { CheckIcon, XIcon } from '@primer/octicons-react';
import { Avatar, Button } from '@primer/react';
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
                  <Button
                    variant="primary"
                    title="Aprovar solicitação"
                    onClick={() => {
                      // TODO: delete from UserPendingData where id = row.id
                      console.log(
                        `APROVAR:\n- ID: ${row.id}\n- UserID: ${row.userId}`,
                      );
                    }}
                  >
                    <CheckIcon />
                  </Button>

                  <Button
                    variant="danger"
                    title="Rejeitar solicitação"
                    onClick={() => {
                      console.log(
                        `REJEITAR:\n- ID: ${row.id}\n- UserID: ${row.userId}`,
                      );
                    }}
                  >
                    <XIcon />
                  </Button>
                </Table.Actions>
              );
            },
          },
        ]}
      />
    </Table.Container>
  );
}
