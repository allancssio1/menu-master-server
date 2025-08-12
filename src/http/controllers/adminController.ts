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

export const getDashboardController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const metrics = await getDashboardMetrics()

    return reply.status(200).send({
      message: 'Dashboard metrics retrieved successfully',
      data: metrics,
    })
  } catch (error) {
    return reply.status(500).send({
      message: 'Internal server error while fetching dashboard metrics',
    })
  }
}

// Controladores de Lojas para Admin
export const getAllStoresController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const stores = await getAllStoresAdmin()

    return reply.status(200).send({
      message: 'Stores retrieved successfully',
      data: stores,
    })
  } catch (error) {
    return reply.status(500).send({
      message: 'Internal server error while fetching stores',
    })
  }
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
    if (error.message === 'Store not found') {
      return reply.status(404).send({
        message: 'Store not found',
      })
    }
    return reply.status(500).send({
      message: 'Internal server error while fetching store',
    })
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
    if (error.message === 'Store not found') {
      return reply.status(404).send({
        message: 'Store not found',
      })
    }
    return reply.status(500).send({
      message: 'Internal server error while updating store status',
    })
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
    if (error.message === 'Store not found') {
      return reply.status(404).send({
        message: 'Store not found',
      })
    }
    return reply.status(500).send({
      message: 'Internal server error while deleting store',
    })
  }
}

// Controladores de Clientes para Admin
export const getAllClientsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const clients = await getAllClientsAdmin()

    return reply.status(200).send({
      message: 'Clients retrieved successfully',
      data: clients,
    })
  } catch (error) {
    return reply.status(500).send({
      message: 'Internal server error while fetching clients',
    })
  }
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
    if (error.message === 'Client not found') {
      return reply.status(404).send({
        message: 'Client not found',
      })
    }
    return reply.status(500).send({
      message: 'Internal server error while fetching client',
    })
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
    if (error.message === 'Client not found') {
      return reply.status(404).send({
        message: 'Client not found',
      })
    }
    return reply.status(500).send({
      message: 'Internal server error while deleting client',
    })
  }
}

// Controladores de Relatórios
export const getStoresReportController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const report = await getStoresReport()

    return reply.status(200).send({
      message: 'Stores report retrieved successfully',
      data: report,
    })
  } catch (error) {
    return reply.status(500).send({
      message: 'Internal server error while fetching stores report',
    })
  }
}

export const getClientsReportController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const report = await getClientsReport()

    return reply.status(200).send({
      message: 'Clients report retrieved successfully',
      data: report,
    })
  } catch (error) {
    return reply.status(500).send({
      message: 'Internal server error while fetching clients report',
    })
  }
}
