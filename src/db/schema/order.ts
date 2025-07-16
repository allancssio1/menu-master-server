import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { stores } from './store.ts'
import { clients } from './client.ts'

export const orders = pgTable('orders', {
  id: uuid().primaryKey().defaultRandom(),
  storeId: uuid()
    .references(() => stores.id)
    .notNull(),
  clientId: uuid()
    .references(() => clients.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
