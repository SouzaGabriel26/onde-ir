import { ValidationSchemaKeys } from '@/models/validator';

export function setInputError(
  inputName: ValidationSchemaKeys,
  error: {
    fields?: string[];
    message?: string;
  },
) {
  if (!error.fields || error.fields.length === 0) return '';

  if (error.fields.includes(inputName)) return error.message;
}
