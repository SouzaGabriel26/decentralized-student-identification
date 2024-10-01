import { createUserRepository } from '@/repositories/userRepository';
import { identity } from '@/utils/idendity';
import { Box, Label, Text } from '@primer/react';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';

export default async function Page() {
  const signedUser = await identity.isLoggedIn();
  if (!signedUser || signedUser.role === 'ADMIN') {
    return redirect('/', RedirectType.replace);
  }

  let rejectionReason = '';
  if (signedUser.status === 'REJECTED') {
    const userRepository = createUserRepository();
    const pendingUserData = await userRepository.findPendingDataByUserId(
      signedUser.id,
    );

    rejectionReason = pendingUserData?.rejection_reason ?? '';
    revalidatePath('/student-card/status');
  }

  const statusObject = {
    APPROVED: 'Aprovado',
    REJECTED: 'Rejeitado',
    PENDING: 'Pendente',
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Box>
        <Text sx={{ mr: 2 }}>Status da carteira:</Text>
        <Label
          size="large"
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

      {signedUser.status === 'REJECTED' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Text sx={{ mr: 2 }}>Justificativa: {rejectionReason}</Text>

          <Link href="/update-profile">Atualizar informações</Link>
        </Box>
      )}
    </Box>
  );
}
