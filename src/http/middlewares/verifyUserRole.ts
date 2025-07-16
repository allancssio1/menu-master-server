/** biome-ignore-all lint/suspicious/useAwait: disconsidere */
import type { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(roleToVerify: 'ADMIN' | 'STORE') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { user } = request
    const { role } = user

    if (role !== roleToVerify) {
      return reply.status(401).send({
        message: 'Unauthorized',
      })
    }
  }
}
