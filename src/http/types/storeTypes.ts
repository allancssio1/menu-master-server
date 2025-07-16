import type z from 'zod'
import type {
  createStoreSchema,
  updateStoreSchema,
} from '../validations/storeSchemas.ts'

export type CreateStoreType = z.infer<typeof createStoreSchema>

export type UpdateStoreType = z.infer<typeof updateStoreSchema>
