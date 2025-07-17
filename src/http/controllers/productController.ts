import type { FastifyReply } from 'fastify'
import {
  createProduct,
  deleteProduct,
  getAllProductsByStore,
  getAllProductsByStoreId,
  updateProduct,
} from '../services/productServices.ts'
import type {
  CreateProductsRequest,
  UpdateProductsRequest,
  ListProductsBySlugStoreRequest,
  DeleteProductsByIdStoreRequest,
  ListProductsByStoreIdRequest,
} from '../types/requestsTypes.ts'

export const createProductController = async (
  request: CreateProductsRequest,
  reply: FastifyReply,
) => {
  const { body, user } = request
  const { sub } = user

  const result = await createProduct({ data: body, storeId: sub })

  return reply.status(201).send(result)
}

export const updateProductController = async (
  request: UpdateProductsRequest,
  reply: FastifyReply,
) => {
  const { body, user } = request
  const { sub } = user

  await updateProduct({ data: body, storeId: sub })

  return reply.status(200).send(body)
}

export const getAllProductByStoreController = async (
  request: ListProductsBySlugStoreRequest,
  reply: FastifyReply,
) => {
  const { slug } = request.params

  const products = await getAllProductsByStore({ storeSlug: slug })

  return reply.status(200).send(products)
}

export const getAllProductByStoreIdController = async (
  request: ListProductsByStoreIdRequest,
  reply: FastifyReply,
) => {
  const { id } = request.params

  const products = await getAllProductsByStoreId({ id })

  return reply.status(200).send(products)
}

export const deleteProductController = async (
  request: DeleteProductsByIdStoreRequest,
  reply: FastifyReply,
) => {
  const { id } = request.params

  await deleteProduct(id)

  return reply.status(200).send()
}
