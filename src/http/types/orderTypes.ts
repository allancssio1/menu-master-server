import type z from 'zod'
import type {
  createOrderSchema,
  updateOrderSchema,
} from '../validations/orderSchemas.ts'

export type CreateOrderType = z.infer<typeof createOrderSchema>

export type UpdateOrderType = z.infer<typeof updateOrderSchema>
