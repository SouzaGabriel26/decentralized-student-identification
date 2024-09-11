import { Box } from '@primer/react';
import { RegisterForm } from './components/RegisterForm';

export default function Page() {
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
      <RegisterForm />
    </Box>
  );
}
