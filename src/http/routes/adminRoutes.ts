import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { verifyAdmin } from '../middlewares/verifyAdmin.ts'
import { 
  getDashboardController,
  getAllStoresController,
  getStoreByIdController,
  updateStoreStatusController,
  deleteStoreController,
  getAllClientsController,
  getClientByIdController,
  deleteClientController,
  getStoresReportController,
  getClientsReportController
} from '../controllers/adminController.ts'
import z from 'zod'

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

  // Rotas de gerenciamento de lojas
  app.get('/stores', getAllStoresController)
  
  app.get('/stores/:id', {
    schema: {
      params: z.object({
        id: z.string().uuid(),
      }),
    },
  }, getStoreByIdController)
  
  app.put('/stores/:id/status', {
    schema: {
      params: z.object({
        id: z.string().uuid(),
      }),
      body: z.object({
        isActive: z.boolean(),
      }),
    },
  }, updateStoreStatusController)
  
  app.delete('/stores/:id', {
    schema: {
      params: z.object({
        id: z.string().uuid(),
      }),
    },
  }, deleteStoreController)

  // Rotas de gerenciamento de clientes
  app.get('/clients', getAllClientsController)
  
  app.get('/clients/:id', {
    schema: {
      params: z.object({
        id: z.string().uuid(),
      }),
    },
  }, getClientByIdController)
  
  app.delete('/clients/:id', {
    schema: {
      params: z.object({
        id: z.string().uuid(),
      }),
    },
  }, deleteClientController)

  // Rotas de relatórios
  app.get('/reports/stores', getStoresReportController)
  app.get('/reports/clients', getClientsReportController)
}