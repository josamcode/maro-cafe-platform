import { z } from 'zod';
export const apiEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.url().refine((value) => /^postgres(?:ql)?:/.test(value)),
  REDIS_URL: z.url().refine((value) => /^rediss?:/.test(value)),
  API_HOST: z.string().default('127.0.0.1'),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  PORT: z.coerce.number().int().min(1).max(65535).optional(),
  WEB_ORIGIN: z.url().default('http://localhost:3100'),
  UPLOAD_DIR: z.string().default('../../.local/uploads'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
});
