import { ThemeSwitcher } from '@/app/components/ThemeSwitcher';
import { identity } from '@/utils/idendity';
import { Box, BoxProps, Text } from '@primer/react';

export async function Header({ ...props }: BoxProps) {
  const signedUser = await identity.isLoggedIn();

  return (
    <Box
      as="header"
      sx={{
        p: 4,
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
      <Text
        sx={{
          fontWeight: 'bold',
        }}
      >
        Logo FAESA
      </Text>

      <Box
        sx={{
          display: 'flex',
          alignContent: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        <ThemeSwitcher />
        {signedUser && <Text>{signedUser.name}</Text>}
      </Box>
    </Box>
  );
}
