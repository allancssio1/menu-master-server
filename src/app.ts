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
import { productRoutes } from './http/routes/productRoutes.ts'
import { clientRoutes } from './http/routes/clientRoutes.ts'
import { orderRoutes } from './http/routes/orderRoutes.ts'
import { adminRoutes } from './http/routes/adminRoutes.ts'
import { fromZodError } from 'zod-validation-error'
import { ZodError } from 'zod/v4'

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
app.register(productRoutes, {
  prefix: 'store/:slug/product',
})
app.register(orderRoutes, {
  prefix: 'store/:slug/order',
})
app.register(clientRoutes, {
  prefix: 'client',
})
app.register(adminRoutes, {
  prefix: 'admin',
})

app.setErrorHandler((error, _request, reply) => {
  console.log('🚀 ~ error:', error)
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      errors: fromZodError(error),
    })
  }

  if (env.NODE_ENV !== 'production') {
    // biome-ignore lint/suspicious/noConsole: <console to dev>
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})

export { app }
