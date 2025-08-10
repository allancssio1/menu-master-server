import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from '../services/orderServices.ts'
import type {
  CreateOrderRequest,
  UpdateOrderRequest,
} from '../types/requestsTypes.ts'

export const createOrderController = async (
  req: CreateOrderRequest,
  res: FastifyReply,
) => {
  const { body } = req
  console.log('🚀 ~ createOrderController ~ body:', body)
  const order = await createOrder({ data: body, storeId: body.storeId })
  return res.status(201).send(order)
}

export const getAllOrdersController = async (
  req: FastifyRequest & { user: { sub: string } },
  res: FastifyReply,
) => {
  const { user } = req
  console.log('🚀 ~ getAllOrdersController ~ user:', user)
  const { sub } = user
  const orders = await getAllOrders({ storeId: sub })
  console.log('🚀 ~ getAllOrdersController ~ orders:', orders)
  return res.status(200).send(orders)
}

export const getOrderByIdController = async (
  req: FastifyRequest & { user: { sub: string }; params: { id: string } },
  res: FastifyReply,
) => {
  const { user, params } = req
  const { sub: storeId } = user
  const { id } = params
  const order = await getOrderById({ id, storeId })
  return res.status(200).send(order)
}

export const updateOrderController = async (
  req: UpdateOrderRequest,
  res: FastifyReply,
) => {
  const { body, user } = req
  const { sub: storeId } = user
  const updatedOrder = await updateOrder({ data: body, storeId })
  return res.status(200).send(updatedOrder)
}

export const deleteOrderController = async (
  req: FastifyRequest & { user: { sub: string }; params: { id: string } },
  res: FastifyReply,
) => {
  const { user, params } = req
  const { sub: storeId } = user
  const { id } = params
  const result = await deleteOrder({ id, storeId })
  return res.status(200).send(result)
}
