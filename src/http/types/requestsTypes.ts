import type { FastifyRequest } from 'fastify'
import type { CreateStoreType, UpdateStoreType } from './storeTypes.ts'
import type { CreateProductType, UpdateProductType } from './productTypes.ts'

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

export type CreateProductsRequest = FastifyRequest<{
  Body: CreateProductType
  Params: { slug: string }
}>

export type UpdateProductsRequest = FastifyRequest<{
  Body: UpdateProductType
  Params: { slug: string }
}>

export type ListProductsBySlugStoreRequest = FastifyRequest<{
  Params: { slug: string }
}>

export type ListProductsByStoreIdRequest = FastifyRequest<{
  Params: { id: string; slug: string }
}>

export type DeleteProductsByIdStoreRequest = FastifyRequest<{
  Params: { id: string; slug: string }
}>
