// Actual lambda function implementation

export function response(statusCode, body) {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
}
