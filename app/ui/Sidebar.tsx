import { identity } from '@/utils/idendity';
import { navItems } from '@/utils/navItems';
import { SignOutIcon } from '@primer/octicons-react';
import { Box, Button, NavList, Text } from '@primer/react';
import { signOutAction } from '../(pages)/(private)/action';
import { NavListItem } from '../components/NavListItem';

export async function Sidebar() {
  const userSignedIn = await identity.getMe();
  const isUserAdmin = userSignedIn && userSignedIn.role === 'ADMIN';
  const userCanUpdateProfile =
    userSignedIn && ['FORGOT_PK', 'REJECTED'].includes(userSignedIn.status);

  return (
    <Box
      as="aside"
      sx={{
        flex: 1,
        py: 3,
        px: 2,
        maxWidth: 'fit-content',
        borderRight: '1px solid',
        borderColor: 'border.default',
        bg: 'canvas.subtle',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <NavList
        sx={{
          '& > ul': {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          },
        }}
      >
        {navItems.map((item) => {
          if (!userSignedIn && item.auth.isPrivate) return null;
          if (userSignedIn && item.auth.onlyNotSignedIn) return null;
          if (!isUserAdmin && item.auth.onlyAdmin) return null;
          if (isUserAdmin && item.auth.onlyStudent) return null;
          if (!userCanUpdateProfile && item.href === '/update-profile')
            return null;

          return <NavListItem key={item.href} item={item} />;
        })}
      </NavList>

      {userSignedIn && (
        <form action={signOutAction}>
          <Button
            type="submit"
            title="Sair"
            sx={{
              marginX: 'auto',
              width: '100%',
              '@media (max-width: 480px)': {
                width: '32px',
              },
            }}
          >
            <Text
              sx={{
                mr: 2,
                '@media (max-width: 480px)': {
                  display: 'none',
                },
              }}
            >
              Sair
            </Text>
            <SignOutIcon />
          </Button>
        </form>
      )}
    </Box>
  );
}
