import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { verifyAdmin } from '../middlewares/verifyAdmin.ts'
import { getDashboardController } from '../controllers/adminController.ts'

export const adminRoutes: FastifyPluginCallbackZod = (app) => {
  // Aplicar middleware de admin em todas as routes
  app.addHook('preHandler', verifyAdmin)

  // Dashboard endpoint
  app.get('/dashboard', getDashboardController)

  // Health check específico para admin
  app.get('/health', async (request, reply) => {
    return reply.status(200).send({
      message: 'Admin API is healthy',
      user: request.user,
      timestamp: new Date().toISOString(),
    })
  })
}