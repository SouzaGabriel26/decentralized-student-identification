import { identity } from '@/utils/idendity';
import { navItems } from '@/utils/navItems';
import { Box, NavList } from '@primer/react';
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
        pt: 3,
        maxWidth: 'fit-content',
        borderRight: '1px solid',
        borderColor: 'border.default',
        bg: 'canvas.subtle',
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
    </Box>
  );
}
