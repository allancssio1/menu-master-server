import { reset, seed } from 'drizzle-seed'
import { db, sql } from './conection.ts'
import { schema } from './schema/index.ts'

await reset(db, schema)
await seed(db, schema).refine((f) => {
  return {}
})

await sql.end()
