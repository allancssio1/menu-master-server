/** biome-ignore-all lint/suspicious/useAwait: disconsidere */
import type { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(roleToVerify: 'ADMIN' | 'STORE') {
  console.log('🚀 ~ verifyUserRole ~ roleToVerify:', roleToVerify)
  return (request: FastifyRequest, reply: FastifyReply) => {
    const { user } = request
    console.log('🚀 ~ return ~ user:', user)
    const { role } = user

    if (role !== roleToVerify) {
      console.log('🚀 ~ return ~ role !== roleToVerify:', role !== roleToVerify)
      return reply.status(401).send({
        message: 'Unauthorized',
      })
    }
    console.log('done')
  }
}
