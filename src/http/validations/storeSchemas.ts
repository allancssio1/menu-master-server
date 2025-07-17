import z from 'zod'

export const createStoreSchema = z
  .object({
    cnpj: z
      .string()
      .min(14, 'CNPJ min has 14 digits')
      .max(18, 'CNPJ max have 18 digits'),
    name: z.string().min(2, 'Store name must have at least 2 characters'),
    responsibleName: z
      .string()
      .min(2, 'Responsible name must have at least 2 characters'),
    email: z.string(),
    password: z.string().min(6, 'Password must have at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Password confirmation must have at least 6 characters'),
    phone: z.string().min(10, 'Phone must have at least 10 digits'),
    address: z.object({
      zipCode: z
        .string()
        .min(8, 'ZIP code must have 8 digits')
        .max(8, 'ZIP code must have 8 digits'),
      street: z.string().min(2, 'Street must have at least 2 characters'),
      number: z.string().min(1, 'Number is required'),
      district: z.string().min(2, 'District must have at least 2 characters'),
      city: z.string().min(2, 'City must have at least 2 characters'),
      state: z.string().min(2, 'State must have at least 2 characters'),
      complement: z.string().optional(),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const updateStoreSchema = z.object({
  name: z.string().min(2, 'Store name must have at least 2 characters'),
  responsibleName: z
    .string()
    .min(2, 'Responsible name must have at least 2 characters'),
  email: z.string(),
  phone: z.string().min(10, 'Phone must have at least 10 digits'),
  address: z.object({
    zipCode: z
      .string()
      .min(8, 'ZIP code must have 8 digits')
      .max(8, 'ZIP code must have 8 digits'),
    street: z.string().min(2, 'Street must have at least 2 characters'),
    number: z.string().min(1, 'Number is required'),
    district: z.string().min(2, 'District must have at least 2 characters'),
    city: z.string().min(2, 'City must have at least 2 characters'),
    state: z.string().min(2, 'State must have at least 2 characters'),
    complement: z.string().optional(),
  }),
})

export const storeSchema = updateStoreSchema.extend({
  id: z.string(),
  cnpj: z.string(),
  slug: z.string(),
  userId: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
