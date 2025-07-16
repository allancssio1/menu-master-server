import type { FastifyReply, FastifyRequest } from 'fastify'
import type { LoginRequest } from '../types/requestsTypes.ts'
import { login } from '../services/authService.ts'

export const loginControler = async (req: LoginRequest, res: FastifyReply) => {
  const { password, username } = req.body
  const data = await login({ password, username })
  if (!data) {
    return res.status(401).send()
  }

  const token = await res.jwtSign(
    {
      role: data.role,
    },
    {
      sign: {
        sub: data.id,
      },
    },
  )
  return res.status(200).send({ access_token: token })
}

export const logoutControler = async (
  request: FastifyRequest,
  res: FastifyReply,
) => {
  await request.jwtVerify()

  try {
    await request.jwtVerify()
  } catch (error) {
    throw new Error('Unauthorized')
  }
  const { user } = request
  const { sub } = user

  return res.status(200).send()
}
