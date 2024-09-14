import { CustomInput } from '@/app/components/CustomInput';
import { LoadingButton } from '@/app/components/LoadingButton';
import { Box } from '@primer/react';

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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 400,
          width: '100%',
        }}
      >
        <CustomInput label="Email" name="email" type="email" />
        <CustomInput label="Senha" name="password" type="password" />

        <LoadingButton>Entrar</LoadingButton>
      </Box>
    </Box>
  );
}
