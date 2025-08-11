import type { FastifyReply, FastifyRequest } from 'fastify'
import { getDashboardMetrics } from '../services/adminService.ts'

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