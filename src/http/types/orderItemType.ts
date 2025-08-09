import type z from 'zod'
import type {
  orderItemSchema,
  createOrderItemSchema,
} from '../validations/orderItemSchemas.ts'

export type OrderItemType = z.infer<typeof orderItemSchema>

export type CreateOrderItemType = z.infer<typeof createOrderItemSchema>
