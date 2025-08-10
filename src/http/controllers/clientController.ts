import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  createClientService,
  deleteClientService,
  getAllClientsService,
  updateClientService,
} from '../services/clientService.ts'
import type {
  CreateClientsRequest,
  UpdateClientsRequest,
  DeleteClientsByIdRequest,
} from '../types/requestsTypes.ts'

export const createClientController = async (
  request: CreateClientsRequest,
  reply: FastifyReply,
) => {
  const { body } = request

  const result = await createClientService(body)

  return reply.status(201).send(result)
}

export const updateClientController = async (
  request: UpdateClientsRequest,
  reply: FastifyReply,
) => {
  const { body, params } = request

  await updateClientService({
    data: body,
    id: params.id,
  })

  return reply.status(200).send(body)
}

export const listClientController = async (
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  const clients = await getAllClientsService()

  return reply.status(200).send(clients)
}

export const deleteClientController = async (
  request: DeleteClientsByIdRequest,
  reply: FastifyReply,
) => {
  const { id } = request.params

  await deleteClientService(id)

  return reply.status(200).send()
}
