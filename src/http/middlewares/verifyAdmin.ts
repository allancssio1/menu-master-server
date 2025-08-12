import type { FastifyReply, FastifyRequest } from 'fastify'
import { UnauthorizedError } from '../../errors/unauthorizedError.ts'

export async function verifyAdmin(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
    
    const { user } = request
    const { role } = user

    if (role !== 'ADMIN') {
      throw new UnauthorizedError()
    }
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error
    }
    
    return reply.status(401).send({
      message: 'Unauthorized - Invalid token',
    })
  }
}