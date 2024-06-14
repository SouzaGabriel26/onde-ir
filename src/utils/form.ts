function sanitizeData<T>(formData: FormData) {
  const data = Object.fromEntries(formData);

  const sanitizedData = Object.entries(data)
    .filter(([_key, value]) => value)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  return sanitizedData as T;
}

export const form = Object.freeze({
  sanitizeData,
});
