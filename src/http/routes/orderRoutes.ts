import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { 
  createOrderController,
  getAllOrdersController,
  getOrderByIdController,
  updateOrderController,
  deleteOrderController,
} from '../controllers/orderController.ts'
import { 
  createOrderSchema,
  updateOrderSchema,
  getOrderParamsSchema,
} from '../validations/orderSchemas.ts'
import { verifyJWT } from '../middlewares/verifyJwt.ts'
import { verifyUserRole } from '../middlewares/verifyUserRole.ts'
import type { CreateOrderType, UpdateOrderType } from '../types/orderTypes.ts'

export const orderRoutes: FastifyPluginCallbackZod = (app) => {
  // Create order
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

  // Get all orders
  app.get(
    '/',
    {
      onRequest: [verifyJWT, verifyUserRole('STORE')],
    },
    getAllOrdersController,
  )

  // Get order by ID
  app.get<{ Params: { id: string } }>(
    '/:id',
    {
      onRequest: [verifyJWT, verifyUserRole('STORE')],
      schema: {
        params: getOrderParamsSchema,
      },
    },
    getOrderByIdController,
  )

  // Update order
  app.put<{ Body: UpdateOrderType }>(
    '/',
    {
      onRequest: [verifyJWT, verifyUserRole('STORE')],
      schema: {
        body: updateOrderSchema,
      },
    },
    updateOrderController,
  )

  // Delete order
  app.delete<{ Params: { id: string } }>(
    '/:id',
    {
      onRequest: [verifyJWT, verifyUserRole('STORE')],
      schema: {
        params: getOrderParamsSchema,
      },
    },
    deleteOrderController,
  )
}
