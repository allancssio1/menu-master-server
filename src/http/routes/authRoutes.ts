import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import {
  loginControler,
  logoutControler,
} from '../controllers/authController.ts'
import { createAuthSchema } from '../validations/authSchema.ts'

export const authRoutes: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/login',
    {
      schema: {
        body: createAuthSchema,
      },
    },
    loginControler,
  )
  app.post('/logout', logoutControler)
}
