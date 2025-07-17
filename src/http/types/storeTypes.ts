import type z from 'zod'
import type {
  createStoreSchema,
  storeSchema,
  updateStoreSchema,
} from '../validations/storeSchemas.ts'

export type CreateStoreType = z.infer<typeof createStoreSchema>

export type UpdateStoreType = z.infer<typeof updateStoreSchema>

export type StoreType = z.infer<typeof storeSchema>
