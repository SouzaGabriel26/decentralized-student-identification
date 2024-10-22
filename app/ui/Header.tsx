import { ThemeSwitcher } from '@/app/components/ThemeSwitcher';
import { constants } from '@/utils/constants';
import { identity } from '@/utils/idendity';
import { Box, BoxProps } from '@primer/react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Logo } from '../components/Logo';
import { UserMenu } from '../components/UserMenu';

async function signOutAction() {
  'use server';

  cookies().delete(constants.access_token_key);

  return redirect('/login');
}

export async function Header({ ...props }: BoxProps) {
  const signedUser = await identity.getMe();

  return (
    <Box
      as="header"
      sx={{
        p: 2,
        display: 'flex',
        width: '100%',
        height: 'fit-content',
        borderBottom: '1px solid',
        borderColor: 'border.default',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      {...props}
    >
      <Logo />

      <Box
        sx={{
          display: 'flex',
          alignContent: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        <ThemeSwitcher />
        {signedUser && (
          <UserMenu name={signedUser.name} signOut={signOutAction} />
        )}
      </Box>
    </Box>
  );
}
