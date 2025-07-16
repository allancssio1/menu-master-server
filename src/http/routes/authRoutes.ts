import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import {
  loginControler,
  logoutControler,
} from '../controllers/authController.ts'
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
}
