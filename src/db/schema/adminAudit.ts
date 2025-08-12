import { pgTable, text, timestamp, uuid, json } from 'drizzle-orm/pg-core'
import { auth } from './auth.ts'

export const adminAuditLog = pgTable('admin_audit_log', {
  id: uuid().primaryKey().defaultRandom(),
  adminId: uuid().notNull().references(() => auth.id, { onDelete: 'cascade' }),
  action: text().notNull(), // 'CREATE_STORE', 'DELETE_CLIENT', 'UPDATE_PRODUCT', etc
  resourceType: text().notNull(), // 'store', 'client', 'product', 'order', 'user'
  resourceId: uuid().notNull(),
  metadata: json(), // Dados extras da ação (dados antigos, novos, etc)
  timestamp: timestamp().defaultNow().notNull(),
})