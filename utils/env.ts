import dotenv from 'dotenv';
import { z } from 'zod';

// @ts-expect-error - workaround to make the dotenv work with the GH Actions
const envPath = process.env.NODE_ENV === 'GH_ACTIONS' ? '.env' : '.env.local';

dotenv.config({
  path: envPath,
});

const envSchema = z.object({
  DEFAULT_POSTGRES_USER: z.string(),
  DEFAULT_POSTGRES_PASSWORD: z.string(),
  DEFAULT_POSTGRES_HOST: z.string(),
  DEFAULT_POSTGRES_PORT: z.string(),
  DEFAULT_POSTGRES_DB: z.string(),
  DEFAULT_DATABASE_URL: z.string(),
  JWT_SECRET_KEY: z.string(),
  RESET_PASSWORD_JWT_SECRET_KEY: z.string(),
  RESEND_API_KEY: z.string(),
  LAMBDA_FUNCTION_URL: z.string(),
  NODE_ENV: z
    .enum(['development', 'production', 'test', 'GH_ACTIONS'])
    .default('development'),
});

const envValidation = envSchema.safeParse(process.env);

if (!envValidation.success) {
  console.error(
    'Environment variables validation error: ',
    envValidation.error.format(),
  );

  throw new Error('Environment variables validation error.');
}

export const env = envValidation.data;
