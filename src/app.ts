import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import {
  serializerCompiler,
  type ZodTypeProvider,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { storeRoutes } from './http/routes/storeRoutes.ts'
import { authRoutes } from './http/routes/authRoutes.ts'
import fastifyJwt from '@fastify/jwt'
import { env } from './env/index.ts'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '1d',
  },
})

app.get('/health', () => {
  return { status: 'ok' }
})

app.register(storeRoutes, {
  prefix: 'store',
})
app.register(authRoutes, {
  prefix: 'auth',
})

export { app }
