import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { auth } from './auth.ts'

export const stores = pgTable('stores', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .references(() => auth.id)
    .notNull(),
  name: text().notNull(),
  cnpj: text().notNull().unique(),
  slug: text().notNull().unique(),
  email: text().notNull().unique(),
  phone: text().notNull(),
  responsibleName: text().notNull(),
  zipCode: text().notNull(),
  street: text().notNull(),
  number: text().notNull(),
  district: text().notNull(),
  city: text().notNull(),
  state: text().notNull(),
  complement: text(),
  imageUrl: text(),
  primaryColor: text().default('#ff6b35').notNull(),
  secondaryColor: text().default('#10b981').notNull(),
  accentColor: text().default('#f59e0b').notNull(),
  isActive: boolean().default(false).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
})
