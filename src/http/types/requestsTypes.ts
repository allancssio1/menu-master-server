import type { FastifyRequest } from 'fastify'
import type { CreateStoreType, UpdateStoreType } from './storeTypes.ts'

export type CreateRequest = FastifyRequest<{
  Body: CreateStoreType
}>

export type UpdateRequest = FastifyRequest<{
  Body: UpdateStoreType
}>
export type IsActiveRequest = FastifyRequest

export type DeleteRequest = FastifyRequest

export type PublicDataRequest = FastifyRequest<{
  Params: { slug: string }
}>

export type LoginRequest = FastifyRequest<{
  Body: { username: string; password: string }
}>
