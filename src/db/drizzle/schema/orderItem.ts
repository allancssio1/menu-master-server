import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { products } from './product.ts'
import { orders } from './order.ts'

export const orderItems = pgTable('orderItems', {
  id: uuid().primaryKey().defaultRandom(),
  productId: uuid()
    .references(() => products.id)
    .notNull(),
  orderId: uuid()
    .references(() => orders.id)
    .notNull(),
  amount: text().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
