import { CustomInput } from '@/app/components/CustomInput';
import { CustomSelect } from '@/app/components/CustomSelect';
import { Box, Button } from '@primer/react';

export default function Page() {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <h1>Preencher Matrícula</h1>

      <Box
        as="form"
        sx={{
          maxWidth: 400,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
          }}
        >
          <CustomInput label="Nome" name="name" required />
          <CustomInput label="Email" type="email" name="email" required />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
          }}
        >
          <CustomInput label="Senha" name="password" required />
          <CustomInput
            label="Confirmar Senha"
            name="confirm_password"
            required
          />
        </Box>

        <CustomInput label="CPF" name="cpf" required />

        <label
          htmlFor="course"
          style={{ fontWeight: 'bold', cursor: 'pointer' }}
        >
          Curso desejado
        </label>

        <CustomSelect
          id="course"
          name="course"
          required
          options={[
            { value: '', label: '' },
            { value: '0001', label: 'Ciência da Computação' },
            { value: '0002', label: 'Engenharia de Software' },
            { value: '0003', label: 'Sistemas de Informação' },
          ]}
        />

        <Button variant="primary" type="submit">
          Enviar solicitação de matrícula
        </Button>
      </Box>
    </Box>
  );
}
