import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', ['ADMIN', 'STORE'])

export const auth = pgTable('auth', {
  id: uuid().primaryKey().defaultRandom(),
  username: text().notNull(),
  password: text().notNull(),
  role: roleEnum().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
