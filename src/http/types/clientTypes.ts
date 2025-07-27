import type z from 'zod'
import type {
  clientSchema,
  createClientSchema,
  updateClientSchema,
} from '../validations/clientSchema.ts'

export type ClientType = z.infer<typeof clientSchema>

export type CreateClientType = z.infer<typeof createClientSchema>

export type UpdateClientType = z.infer<typeof updateClientSchema>
