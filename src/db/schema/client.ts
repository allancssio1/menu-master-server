import { pgTable, text, uuid } from 'drizzle-orm/pg-core'

export const clients = pgTable('clients', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  phone: text().notNull(),
  zipCode: text().notNull(),
  street: text().notNull(),
  number: text().notNull(),
  district: text().notNull(),
  city: text().notNull(),
  state: text().notNull(),
  complement: text(),
})
