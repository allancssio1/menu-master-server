import z from 'zod'

export const createOrderSchema = z.array(
  z.object({
    title: z.string().min(2, 'Order name must have at least 2 characters'),
    description: z.string().optional().default(''),
    price: z.coerce.number().min(0, 'Price must be greater than 0'),
    imageUrl: z.string().optional().default(''),
    stoque: z.boolean().optional().default(false),
    amount: z.coerce.number().optional().default(0),
  }),
)

export const updateOrderSchema = z.object({
  id: z.string(),
  title: z.string().min(2, 'Order name must have at least 2 characters'),
  description: z.string().optional().default(''),
  price: z.coerce.number().min(0, 'Price must be greater than 0'),
  imageUrl: z.string().optional().default(''),
  stoque: z.boolean().optional().default(false),
  amount: z.coerce.number().optional().default(0),
})

export const orderSchema = updateOrderSchema.extend({
  slug: z.string(),
  storeId: z.string(),
  decimals: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const deleteOrderSchema = z.object({
  id: z.string(),
  slug: z.string(),
})
