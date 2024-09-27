export const constants = Object.freeze({
  access_token_key: 'std-id:accesstoken',
  user_id_header_key: 'x-user-id',
  lambda_function_url: process.env.LAMBDA_FUNCTION_URL!,
  jwt_secret: process.env.JWT_SECRET!,
  smart_contract_address: '0xb4d514ec4a871841da92dc710caeadc86f90669e',
  ganache_url: 'http://localhost:8545',
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

  if (missingEnvs.length > 0) {
    console.warn(`
      Missing environment variables:
        ${missingEnvs.join(', ')}
    `);
  }
}
