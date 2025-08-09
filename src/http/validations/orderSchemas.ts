import z from 'zod'

export const createOrderSchema = z.object({
  clientId: z.string(),
  products: z.array(
    z.object({
      id: z.string(),
      amount: z.number(),
    }),
  ),
})

export const updateOrderSchema = z.object({
  id: z.string(),
  products: z.array(
    z.object({
      id: z.string(),
      amount: z.number(),
      price: z.number(),
    }),
  ),
  status: z
    .enum(['CREATED', 'ATTENDING', 'DELIVERED', 'COMPLETED', 'CANCELED'])
    .default('CREATED'),
  reason: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
