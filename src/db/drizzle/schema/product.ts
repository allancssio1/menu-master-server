import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
} from 'drizzle-orm/pg-core'
import { stores } from './store.ts'

export const products = pgTable('products', {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  description: text(),
  price: integer().notNull(),
  slug: text(),
  stoque: boolean().notNull().default(false),
  amount: integer().notNull().default(0),
  imageUrl: text(),
  decimals: integer().notNull().default(2),
  storeId: uuid()
    .references(() => stores.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
