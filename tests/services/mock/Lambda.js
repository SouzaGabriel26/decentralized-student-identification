import crypto from 'node:crypto';

export async function handler(event) {
  const { fileName } = JSON.parse(event.body);

  if (!fileName) {
    return response(400, { message: '"fileName" é obrigatório.' });
  }

  /* if (!process.env.CDN_TO_S3) {
    return response(400, { message: 'Invalid "CDN" environment variable.' });
  } */

  const MOCKED_CDN_TO_S3 = 'https://cdn-to-s3.com';

  const fileNameToSave = `${crypto.randomUUID()}-${fileName}`;
  const fileURL = `${MOCKED_CDN_TO_S3}/uploads/${fileNameToSave}`;

  const s3Client = new S3Client();
  const command = new PutObjectCommand({
    Bucket: 'gbsouza',
    Key: `uploads/${fileNameToSave}`,
  });

  const presigned_url = await getSignedUrl(s3Client, command, {
    expiresIn: 30,
  });

  return response(200, { presigned_url, file_url: fileURL });
}

async function getSignedUrl(_s3Client, _command, _options) {
  return 'https://fake-presigned-url.com';
}

function response(statusCode, body) {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
}

/* Mocked instances of `@aws-sdk/client-s3` library */
class S3Client {}

class PutObjectCommand {
  constructor({ Bucket, Key }) {
    this.Bucket = Bucket;
    this.Key = Key;
  }
}
