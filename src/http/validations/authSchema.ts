import z from 'zod'

export const createAuthSchema = z.object({
  username: z.string(),
  password: z.string().min(6),
  isAdmin: z.boolean().optional().default(false),
})

export const authSchema = z.object({
  id: z.string(),
  password: z.string(),
  username: z.string(),
  isAdmin: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
})
