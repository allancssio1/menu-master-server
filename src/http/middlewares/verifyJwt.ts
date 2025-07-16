import type { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
    console.log('verifyJWT')
  } catch (_error) {
    console.log('🚀 ~ verifyJWT ~ _error:', _error)
    reply.status(401).send({
      message: 'Unauthorized',
    })
  }
}
