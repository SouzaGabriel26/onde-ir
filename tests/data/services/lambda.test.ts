import { handler } from '@/data/services/src/uploadFileWithPresignedURL';

describe('Testing lambda function actual implementation with fake data', () => {
  test('Should return a object with "presigned_url" and "file_url"', async () => {
    const event = {
      body: JSON.stringify({
        fileName: 'test.jpg',
      }),
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(200);

    const responseBody = JSON.parse(response.body);

    expect(responseBody).toStrictEqual({
      presigned_url: expect.any(String),
      file_url: expect.any(String),
    });
    expect(responseBody.presigned_url).toContain('test.jpg');
    expect(responseBody.file_url).toContain('test.jpg');
  });

  test('Should return a error message when fileName is not provided', async () => {
    const event = {
      body: JSON.stringify({}),
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(400);

    const responseBody = JSON.parse(response.body);

    expect(responseBody).toStrictEqual({
      message: '"fileName" é obrigatório.',
    });
  });
});
