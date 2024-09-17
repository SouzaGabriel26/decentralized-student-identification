export const constants = Object.freeze({
  access_token_key: 'std-id:accesstoken',
  user_id_header_key: 'x-user-id',
  lambda_function_url: process.env.LAMBDA_FUNCTION_URL!,
  jwt_secret: process.env.JWT_SECRET!,
});

getConstants();

function getConstants() {
  if (!constants.lambda_function_url || !constants.jwt_secret) {
    console.warn(`
      Missing environment variables:
        - LAMBDA_FUNCTION_URL
        - JWT_SECRET
    `);
  }
}
