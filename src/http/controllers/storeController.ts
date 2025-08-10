import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  // changeActiveStore,
  createStore,
  deleteStore,
  getAllStores,
  getByIdStore,
  getBySlugStore,
  updateStore,
} from '../services/storeServices.ts'
import type {
  CreateRequest,
  DeleteRequest,
  // IsActiveRequest,
  UpdateRequest,
  PublicDataRequest,
} from '../types/requestsTypes.ts'

export const createStoreController = async (
  request: CreateRequest,
  reply: FastifyReply,
) => {
  const body = request.body

  const store = await createStore(body)

  return reply.status(201).send({ store })
}

export const updateStoreController = async (
  request: UpdateRequest,
  reply: FastifyReply,
) => {
  const { body, user } = request
  const { sub } = user

  const product = await updateStore(body, sub)

  return reply.status(200).send(product)
}

export const getAllStoresController = async (
  _: FastifyRequest,
  reply: FastifyReply,
) => {
  const stores = await getAllStores()

  return reply.status(200).send(stores)
}

export const getBySlugStoreController = async (
  request: PublicDataRequest,
  reply: FastifyReply,
) => {
  const store = await getBySlugStore(request.params.slug)

  return reply.status(200).send(store)
}

export const getByIdStoreController = async (
  request: UpdateRequest,
  reply: FastifyReply,
) => {
  const { user } = request

  const { sub } = user

  const store = await getByIdStore(sub)

  return reply.status(200).send({ store })
}

export const deleteStoreController = async (
  request: DeleteRequest,
  reply: FastifyReply,
) => {
  const { user } = request
  const { sub } = user

  await deleteStore(sub)

  return reply.status(200).send()
}
