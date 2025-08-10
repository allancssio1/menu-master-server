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

export const updateOrderSchema = z
  .object({
    id: z.string().uuid('Order ID must be a valid UUID'),
    status: z.enum(['CREATED', 'ATTENDING', 'DELIVERED', 'COMPLETED', 'CANCELED']),
    reason: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.status === 'CANCELED') {
        return data.reason && data.reason.trim().length > 0
      }
      return true
    },
    {
      message: 'Reason is required when status is CANCELED',
      path: ['reason'],
    }
  )

export const getOrderParamsSchema = z.object({
  id: z.string().uuid('ID must be a valid UUID'),
})
