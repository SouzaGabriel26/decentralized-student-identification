import { ThemeSwitcher } from '@/app/components/ThemeSwitcher';
import { identity } from '@/utils/idendity';
import { Box, BoxProps } from '@primer/react';
import Link from 'next/link';
import { signOutAction } from '../(pages)/(private)/action';
import { Logo } from '../components/Logo';
import { UserMenu } from '../components/UserMenu';

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
      <Link href="/" style={{ textDecoration: 'none' }}>
        <Logo />
      </Link>
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
