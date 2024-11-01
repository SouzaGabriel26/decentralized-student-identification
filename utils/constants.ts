export const constants = Object.freeze({
  access_token_key: 'std-id:accesstoken',
  user_id_header_key: 'x-user-id',
  lambda_function_url: process.env.LAMBDA_FUNCTION_URL!,
  jwt_secret: process.env.JWT_SECRET!,
  smart_contract_address: '0xb4d514ec4a871841da92dc710caeadc86f90669e',
  ganache_url: 'http://localhost:8545',
  seed: {
    admin_email: process.env.ADMIN_EMAIL!,
    admin_raw_password: process.env.ADMIN_RAW_PASSWORD!,
  },
});

getConstants();

function getConstants() {
  const missingEnvs: string[] = [];

  if (!constants.lambda_function_url) {
    missingEnvs.push('LAMBDA_FUNCTION_URL');
  }

  if (!constants.jwt_secret) {
    missingEnvs.push('JWT_SECRET');
  }

  if (Object.values(constants.seed).length === 0) {
    missingEnvs.push('SEED: ADMIN_EMAIL, ADMIN_RAW_PASSWORD');
  }

  if (missingEnvs.length > 0) {
    const isDevelopmentEnv = process.env.NODE_ENV === 'development';
    isDevelopmentEnv &&
      console.warn(`
      Missing environment variables:
        ${missingEnvs.join(', ')}
    `);
  }
}
