import 'dotenv/config'
import { z } from 'zod'

const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(3000),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

const parsed = EnvSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('[env] Invalid environment variables:', z.treeifyError(parsed.error))
  process.exit(1)
}

export const env = {
  ...parsed.data,
  corsOrigins: parsed.data.CORS_ORIGIN.split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  isDev: parsed.data.NODE_ENV === 'development',
  isProd: parsed.data.NODE_ENV === 'production',
} as const
