export const constants = Object.freeze({
  access_token_key: 'std-id:accesstoken',
  user_id_header_key: 'x-user-id',
  lambda_function_url: process.env.LAMBDA_FUNCTION_URL!,
  jwt_secret: process.env.JWT_SECRET!,
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
