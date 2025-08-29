import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import {
  loginControler,
  logoutControler,
} from '../controllers/authController.ts'
import { createAdminController } from '../controllers/tempAdminController.ts'
import { authSchema } from '../validations/authSchema.ts'

export const authRoutes: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/login',
    {
      schema: {
        body: authSchema,
      },
    },
    loginControler,
  )
  app.post('/logout', logoutControler)
  
  // Temporary route to create admin (REMOVE IN PRODUCTION)
  app.post(
    '/create-admin',
    {
      schema: {
        body: authSchema,
      },
    },
    createAdminController,
  )
}
