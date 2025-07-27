import type z from 'zod'
import type {
  createOrderSchema,
  deleteOrderSchema,
  orderSchema,
  updateOrderSchema,
} from '../validations/orderSchemas.ts'

export type CreateOrderType = z.infer<typeof createOrderSchema>

export type UpdateOrderType = z.infer<typeof updateOrderSchema>

export type DeleteOrderType = z.infer<typeof deleteOrderSchema>

export type OrderType = z.infer<typeof orderSchema>
