import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { createOrderController } from '../controllers/orderController.ts'
import { createOrderSchema } from '../validations/orderSchemas.ts'
import { verifyJWT } from '../middlewares/verifyJwt.ts'
import { verifyUserRole } from '../middlewares/verifyUserRole.ts'
import type { CreateOrderType } from '../types/orderTypes.ts'

export const orderRoutes: FastifyPluginCallbackZod = (app) => {
  app.post<{ Body: CreateOrderType }>(
    '/',
    {
      onRequest: [verifyJWT, verifyUserRole('STORE')],
      schema: {
        body: createOrderSchema,
      },
    },
    createOrderController,
  )
}
