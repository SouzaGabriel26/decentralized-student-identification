import { createUserRepository } from '@/repositories/userRepository';
import { identity } from '@/utils/idendity';
import { Box } from '@primer/react';
import { redirect, RedirectType } from 'next/navigation';
import { EditUserRegisterForm } from './components/EditUserRegisterForm';

export default async function Page() {
  const signedUser = await identity.isLoggedIn();
  if (
    !signedUser ||
    signedUser.status !== 'REJECTED' ||
    signedUser.role == 'ADMIN'
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
      <EditUserRegisterForm userPendingData={userPendingData} />
    </Box>
  );
}
