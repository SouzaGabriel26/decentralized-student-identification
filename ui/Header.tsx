import { ThemeSwitcher } from '@/app/components/ThemeSwitcher';
import { Box, BoxProps, Text } from '@primer/react';

export function Header({ ...props }: BoxProps) {
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
      <ThemeSwitcher />
    </Box>
  );
}
