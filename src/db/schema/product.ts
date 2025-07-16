import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { stores } from './store.ts'

export const products = pgTable('products', {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  description: text(),
  price: text().notNull(),
  storeId: uuid()
    .references(() => stores.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
