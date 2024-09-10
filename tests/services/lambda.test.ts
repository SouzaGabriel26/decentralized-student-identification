import { handler } from '@/tests/services/mock/Lambda';

describe('> Lambda Service [mocked implementation]', () => {
  it('should return a error when "fileName" is not provided', async () => {
    const event = {
      body: JSON.stringify({}),
    };

    const result = await handler(event);

    expect(result).toStrictEqual({
      statusCode: 400,
      body: JSON.stringify({
        message: '"fileName" é obrigatório.',
      }),
    });
  });

  it('should return a object containing "presigned_url" and "file_url" properties', async () => {
    const event = {
      body: JSON.stringify({
        fileName: 'example.jpg',
      }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toHaveProperty('presigned_url');
    expect(JSON.parse(result.body)).toHaveProperty('file_url');
  });
});
