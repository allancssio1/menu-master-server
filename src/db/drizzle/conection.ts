import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { schema } from './schema/index.ts'
import { env } from '../../env/index.ts'

export const sql = postgres(env.DATABASE_URL)
export const db = drizzle(sql, {
  schema,
  casing: 'snake_case',
})
