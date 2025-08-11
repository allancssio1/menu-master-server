import { z } from 'zod/v4'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().startsWith('postgresql://'),
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
})

export const env = envSchema.parse(process.env)
