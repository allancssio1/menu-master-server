import z from 'zod'

export const createClientSchema = z.object({
  name: z.string(),
  phone: z.string(),
  zipCode: z.string(),
  street: z.string(),
  number: z.string(),
  district: z.string(),
  city: z.string(),
  state: z.string(),
  complement: z.string().optional(),
})

export const updateClientSchema = z.object({
  name: z.string(),
  phone: z.string(),
  zipCode: z.string(),
  street: z.string(),
  number: z.string(),
  district: z.string(),
  city: z.string(),
  state: z.string(),
  complement: z.string().optional(),
})

export const clientSchema = createClientSchema.extend({
  id: z.string(),
})
