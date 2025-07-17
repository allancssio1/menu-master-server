import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import {
  createProductSchema,
  deleteProductSchema,
  updateProductSchema,
} from '../validations/productSchemas.ts'
import { verifyJWT } from '../middlewares/verifyJwt.ts'
import { verifyUserRole } from '../middlewares/verifyUserRole.ts'
import type {
  CreateProductType,
  DeleteProductType,
  UpdateProductType,
} from '../types/productTypes.ts'
import {
  createProductController,
  deleteProductController,
  getAllProductByStoreController,
  getAllProductByStoreIdController,
  updateProductController,
} from '../controllers/productController.ts'
import { z } from 'zod'

export const productRoutes: FastifyPluginCallbackZod = (app) => {
  app.post<{ Body: CreateProductType[] }>(
    '/',
    {
      onRequest: [verifyJWT, verifyUserRole('STORE')],
      schema: {
        body: z.array(createProductSchema),
      },
    },
    createProductController,
  )

  app.get<{ Params: { slug: string } }>(
    '/:slug',
    {
      schema: {
        params: z.object({
          slug: z.string(),
        }),
      },
    },
    getAllProductByStoreController,
  )

  app.get<{ Params: { id: string } }>(
    '/store/:id',
    {
      onRequest: [verifyJWT, verifyUserRole('STORE')],

      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    getAllProductByStoreIdController,
  )

  app.put<{ Body: UpdateProductType }>(
    '/',
    {
      onRequest: [verifyJWT, verifyUserRole('STORE')],
      schema: {
        body: updateProductSchema,
      },
    },
    updateProductController,
  )

  app.delete<{ Params: DeleteProductType }>(
    '/:id',
    {
      onRequest: [verifyJWT, verifyUserRole('STORE')],
      schema: {
        params: deleteProductSchema,
      },
    },
    deleteProductController,
  )
}
