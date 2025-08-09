import z from 'zod'

export const createOrderItemSchema = z.object({
  productId: z.string(),
  orderId: z.string(),
  amount: z.number(),
  price: z.number(),
  decimals: z.number().optional().default(2),
})

export const updateOrderItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  orderId: z.string(),
  amount: z.number(),
  price: z.number(),
  decimals: z.number().optional().default(2),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const orderItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  orderId: z.string(),
  amount: z.number(),
  price: z.number(),
  decimals: z.number().optional().default(2),
  createdAt: z.date(),
  updatedAt: z.date(),
})
