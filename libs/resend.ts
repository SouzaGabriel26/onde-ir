import { Resend } from 'resend';

import { env } from '@/src/utils/env';

export const resend = new Resend(env.resend_api_key);
