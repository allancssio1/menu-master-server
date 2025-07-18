import type { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (_error) {
    reply.status(401).send({
      message: 'Unauthorized',
    })
  }
}
