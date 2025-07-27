import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import {
  createClientController,
  deleteClientController,
  listClientController,
  updateClientController,
} from '../controllers/clientController.ts'
import type {
  CreateClientType,
  UpdateClientType,
} from '../types/clientTypes.ts'
import {
  createClientSchema,
  updateClientSchema,
} from '../validations/clientSchema.ts'
import z from 'zod'

export const clientRoutes: FastifyPluginCallbackZod = (app) => {
  app.post<{ Body: CreateClientType; Params: { slug: string } }>(
    '/',
    {
      schema: {
        body: createClientSchema,
      },
    },
    createClientController,
  )

  app.put<{ Body: UpdateClientType; Params: { id: string } }>(
    '/:id',
    {
      schema: {
        body: updateClientSchema,
        params: z.object({
          id: z.string(),
        }),
      },
    },
    updateClientController,
  )

  app.get('/', listClientController)

  app.delete<{ Params: { id: string } }>(
    '/:id',
    {
      schema: {
        params: { id: z.string() },
      },
    },
    deleteClientController,
  )
}
