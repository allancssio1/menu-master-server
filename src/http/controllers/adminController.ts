import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  getDashboardMetrics,
  getAllStoresAdmin,
  getStoreByIdAdmin,
  updateStoreStatusAdmin,
  deleteStoreAdmin,
  getAllClientsAdmin,
  getClientByIdAdmin,
  deleteClientAdmin,
  getStoresReport,
  getClientsReport,
} from '../services/adminService.ts'
import { StoreNotFound } from '../../errors/storeNotFound.ts'
import { ClientNotFound } from '../../errors/clientNotFound.ts'

export const getDashboardController = async (
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  const metrics = await getDashboardMetrics()

  return reply.status(200).send({
    message: 'Dashboard metrics retrieved successfully',
    data: metrics,
  })
}

// Controladores de Lojas para Admin
export const getAllStoresController = async (
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  const stores = await getAllStoresAdmin()

  return reply.status(200).send({
    message: 'Stores retrieved successfully',
    data: stores,
  })
}

export const getStoreByIdController = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params
    const store = await getStoreByIdAdmin(id)

    return reply.status(200).send({
      message: 'Store retrieved successfully',
      data: store,
    })
  } catch (error) {
    if (error instanceof StoreNotFound) {
      return reply.status(404).send(error.message)
    }
    throw error
  }
}

export const updateStoreStatusController = async (
  request: FastifyRequest<{
    Params: { id: string }
    Body: { isActive: boolean }
  }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params
    const { isActive } = request.body

    const result = await updateStoreStatusAdmin(id, isActive)

    return reply.status(200).send({
      message: result.message,
      data: result,
    })
  } catch (error) {
    if (error instanceof StoreNotFound) {
      return reply.status(404).send(error.message)
    }
    throw error
  }
}

export const deleteStoreController = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params
    const result = await deleteStoreAdmin(id)

    return reply.status(200).send({
      message: result.message,
      data: result,
    })
  } catch (error) {
    if (error instanceof StoreNotFound) {
      return reply.status(404).send(error.message)
    }
    throw error
  }
}

// Controladores de Clientes para Admin
export const getAllClientsController = async (
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  const clients = await getAllClientsAdmin()

  return reply.status(200).send({
    message: 'Clients retrieved successfully',
    data: clients,
  })
}

export const getClientByIdController = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params
    const client = await getClientByIdAdmin(id)

    return reply.status(200).send({
      message: 'Client retrieved successfully',
      data: client,
    })
  } catch (error) {
    if (error instanceof ClientNotFound) {
      return reply.status(404).send(error.message)
    }
    throw error
  }
}

export const deleteClientController = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params
    const result = await deleteClientAdmin(id)

    if (!result.canDelete) {
      return reply.status(400).send({
        message: result.message,
        data: result,
      })
    }

    return reply.status(200).send({
      message: result.message,
      data: result,
    })
  } catch (error) {
    if (error instanceof ClientNotFound) {
      return reply.status(404).send(error.message)
    }
    throw error
  }
}

// Controladores de Relatórios
export const getStoresReportController = async (
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  const report = await getStoresReport()

  return reply.status(200).send({
    message: 'Stores report retrieved successfully',
    data: report,
  })
}

export const getClientsReportController = async (
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  const report = await getClientsReport()

  return reply.status(200).send({
    message: 'Clients report retrieved successfully',
    data: report,
  })
}
