import { createUserRepository } from '@/repositories/userRepository';
import { identity } from '@/utils/idendity';
import { Box } from '@primer/react';
import { UserStatus } from '@prisma/client';
import { redirect, RedirectType } from 'next/navigation';
import { EditUserRegisterForm } from './components/EditUserRegisterForm';

export default async function Page() {
  const signedUser = await identity.getMe();
  const acceptedUserStatus: UserStatus[] = ['FORGOT_PK', 'REJECTED'];

  if (
    !signedUser ||
    !acceptedUserStatus.includes(signedUser.status) ||
    signedUser.role === 'ADMIN'
  ) {
    return redirect('/', RedirectType.replace);
  }

  const userRepository = createUserRepository();
  const userPendingData = await userRepository.findPendingDataByUserId(
    signedUser.id,
  );

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <EditUserRegisterForm
        userPendingData={userPendingData}
        user={{
          id: signedUser.id,
          name: signedUser.name,
          email: signedUser.email,
          status: signedUser.status as 'FORGOT_PK' | 'REJECTED',
        }}
      />
    </Box>
  );
}
