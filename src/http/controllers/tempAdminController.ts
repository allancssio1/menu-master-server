import type { FastifyReply, FastifyRequest } from 'fastify'
import { createAccount } from '../services/authService.ts'

interface CreateAdminBody {
  username: string
  password: string
}

export const createAdminController = async (
  request: FastifyRequest<{ Body: CreateAdminBody }>,
  reply: FastifyReply,
) => {
  try {
    const { username, password } = request.body
    
    const admin = await createAccount({
      username,
      password,
      isAdmin: true,
    })
    
    return reply.status(201).send({
      message: 'Admin created successfully',
      data: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error('Error creating admin:', error)
    return reply.status(500).send({
      message: 'Internal server error while creating admin',
    })
  }
}