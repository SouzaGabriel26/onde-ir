import { config } from 'dotenv';

config();

export const env = Object.freeze({
  db_user: process.env.DEFAULT_POSTGRES_USER!,
  db_password: process.env.DEFAULT_POSTGRES_PASSWORD!,
  db_host: process.env.DEFAULT_POSTGRES_HOST!,
  db_port: process.env.DEFAULT_POSTGRES_PORT!,
  default_db: process.env.DEFAULT_POSTGRES_DB!,
  jwt_secret: process.env.JWT_SECRET_KEY!,
  reset_password_jwt_secret: process.env.RESET_PASSWORD_JWT_SECRET_KEY!,
});
