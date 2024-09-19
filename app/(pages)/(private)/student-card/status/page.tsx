import { identity } from '@/utils/idendity';
import { Box, Label, Text } from '@primer/react';
import { redirect, RedirectType } from 'next/navigation';

export default async function Page() {
  const signedUser = await identity.isLoggedIn();
  if (!signedUser || signedUser.role === 'ADMIN') {
    return redirect('/', RedirectType.replace);
  }

  let statusObject = {
    APPROVED: 'Aprovado',
    REJECTED: 'Rejeitado',
    PENDING: 'Pendente',
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Text>Status da carteira:</Text>
      <Label
        variant={
          signedUser.status === 'APPROVED'
            ? 'success'
            : signedUser.status === 'REJECTED'
              ? 'danger'
              : 'attention'
        }
      >
        {statusObject[signedUser.status]}
      </Label>
    </Box>
  );
}
