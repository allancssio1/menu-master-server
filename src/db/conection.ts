// biome-ignore assist/source/organizeImports: <this>
import postgres from 'postgres'
import { env } from '../env/index.ts'
import { drizzle } from 'drizzle-orm/postgres-js'
import { schema } from './schema/index.ts'

export const sql = postgres(
  `postgresql://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`,
)
export const db = drizzle(sql, {
  schema,
  casing: 'snake_case',
})
