import { createUserRepository } from '@/repositories/userRepository';
import { identity } from '@/utils/idendity';
import { Box, Label, Text } from '@primer/react';
import { UserStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';

export default async function Page() {
  const signedUser = await identity.getMe();
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

  const statusObject: Record<UserStatus, string> = {
    APPROVED: 'Aprovado',
    REJECTED: 'Rejeitado',
    PENDING: 'Pendente',
    FORGOT_PK: 'Esqueceu a chave privada',
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

      {signedUser.status === 'FORGOT_PK' && (
        <Box>
          <Text>
            Você esqueceu a chave privada. Para gerar uma nova carteira, siga os
            seguintes passos:
          </Text>

          <ol>
            <li>
              preencha novamente o
              <Link href="/update-profile"> formulário </Link>
              com seus dados.
            </li>

            <li>Envie o formulário.</li>

            <li>Guarde sua chave nova chave privada em um local seguro.</li>

            <li>Aguarde a aprovação de um administrador.</li>
          </ol>
        </Box>
      )}
    </Box>
  );
}
