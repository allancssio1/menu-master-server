import type z from 'zod'
import type { authSchema, createAuthSchema } from '../validations/authSchema.ts'

export type CreateAuthType = z.infer<typeof createAuthSchema>

export type AuthType = z.infer<typeof authSchema>
