import type { FastifyReply } from 'fastify'
import { createOrder } from '../services/orderServices.ts'
import type { CreateOrderRequest } from '../types/requestsTypes.ts'

export const createOrderController = async (
  req: CreateOrderRequest,
  res: FastifyReply,
) => {
  const { body, user } = req
  const { sub } = user
  const order = await createOrder({ data: body, storeId: sub })
  return res.status(201).send(order)
}
