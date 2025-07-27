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
  app.post<{ Body: CreateProductType; Params: { slug: string } }>(
    '/',
    {
      onRequest: [verifyJWT, verifyUserRole('STORE')],
      schema: {
        body: createProductSchema,
        params: z.object({
          slug: z.string(),
        }),
      },
    },
    createProductController,
  )

  app.put<{ Body: UpdateProductType; Params: { slug: string } }>(
    '/',
    {
      onRequest: [verifyJWT, verifyUserRole('STORE')],
      schema: {
        body: updateProductSchema,
        params: z.object({
          slug: z.string(),
        }),
      },
    },
    updateProductController,
  )

  app.get<{ Params: { slug: string } }>(
    '/',
    {
      schema: {
        params: z.object({
          slug: z.string(),
        }),
      },
    },
    getAllProductByStoreController,
  )

  app.get<{ Params: { id: string; slug: string } }>(
    '/:id',
    {
      onRequest: [verifyJWT, verifyUserRole('STORE')],

      schema: {
        params: z.object({
          id: z.string(),
          slug: z.string(),
        }),
      },
    },
    getAllProductByStoreIdController,
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
