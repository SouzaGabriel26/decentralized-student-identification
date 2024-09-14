import { Box } from '@primer/react';
import { LoginForm } from './components/LoginForm';

export default function Page() {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LoginForm />
    </Box>
  );
}
