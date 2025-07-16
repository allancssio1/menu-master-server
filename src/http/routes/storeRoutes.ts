import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import {
  createStoreSchema,
  updateStoreSchema,
} from '../validations/storeSchemas.ts'
import {
  changeIsActiveStoreController,
  createStoreController,
  deleteStoreController,
  getAllStoresController,
  getBySlugStoreController,
  updateStoreController,
} from '../controllers/storeController.ts'
import { verifyJWT } from '../middlewares/verifyJwt.ts'
import { verifyUserRole } from '../middlewares/verifyUserRole.ts'
import type { UpdateStoreType } from '../types/storeTypes.ts'

export const storeRoutes: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/',
    {
      schema: {
        body: createStoreSchema,
      },
    },
    createStoreController,
  )
  app.get('/:slug', getBySlugStoreController)
  app.get('/', getAllStoresController)
  app.put<{ Body: UpdateStoreType }>(
    '/',
    {
      onRequest: [verifyJWT, verifyUserRole('STORE')],
      schema: {
        body: updateStoreSchema,
      },
    },
    updateStoreController,
  )
  app.patch(
    '/',
    {
      onRequest: [verifyJWT, verifyUserRole('STORE')],
    },
    changeIsActiveStoreController,
  )
  app.delete(
    '/',
    {
      onRequest: [verifyJWT, verifyUserRole('STORE')],
    },
    deleteStoreController,
  )
}
