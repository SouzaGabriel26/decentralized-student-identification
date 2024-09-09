import { CustomInput } from '@/app/components/CustomInput';
import { CustomSelect } from '@/app/components/CustomSelect';
import { Box, Button, Text } from '@primer/react';

export default function Page() {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            '@media (max-width: 480px)': {
              flexDirection: 'column',
            },
          }}
        >
          <CustomInput label="Nome" name="name" required />
          <CustomInput label="Email" type="email" name="email" required />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            '@media (max-width: 480px)': {
              flexDirection: 'column',
            },
          }}
        >
          <CustomInput label="Senha" name="password" required />
          <CustomInput
            label="Confirmar Senha"
            name="confirm_password"
            required
          />
        </Box>

        <Text
          sx={{
            mt: 2,
          }}
        >
          Sobre o aluno:
        </Text>

        <CustomInput label="CPF" name="cpf" type="number" required />

        <CustomInput label="Cep" name="cep" type="number" required />

        <CustomInput label="Endereço" name="address" required />

        <CustomInput label="Número" name="number" required />

        <CustomInput label="Complemento" name="complement" />

        <label
          htmlFor="course"
          style={{ fontWeight: 'bold', cursor: 'pointer', fontSize: 14 }}
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

        <label
          htmlFor="photo"
          style={{ fontWeight: 'bold', cursor: 'pointer', fontSize: 14 }}
        >
          Foto do aluno
        </label>
        <input type="file" name="photo" id="photo" />

        <Button
          variant="primary"
          type="submit"
          sx={{
            mt: 2,
          }}
        >
          Enviar solicitação de matrícula
        </Button>
      </form>
    </Box>
  );
}
