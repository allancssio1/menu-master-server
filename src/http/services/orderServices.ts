/** biome-ignore-all lint/complexity/noForEach: testando for each */
import type { CreateOrderType, UpdateOrderType } from '../types/orderTypes.ts'
import { schema } from '../../db/schema/index.ts'
import { db } from '../../db/conection.ts'
import { eq as EQ, and as AND } from 'drizzle-orm'
import type { CreateOrderItemType } from '../types/orderItemType.ts'
import { StoreNotFound } from '../../errors/storeNotFound.ts'
import { ProductNotFound } from '../../errors/productNotFound.ts'
import { OrderNotFound } from '../../errors/orderNotFound.ts'
import { DeleteError } from '../../errors/deleteError.ts'
import { ClientNotFound } from '../../errors/clientNotFound.ts'

export const createOrder = async ({
  data,
  storeId,
}: {
  data: CreateOrderType
  storeId: string
}) => {
  const storeFound = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.id, storeId),
  })

  if (!storeFound) {
    throw new StoreNotFound()
  }

  const clientFound = await db.query.clients.findFirst({
    where: (clients, { eq }) => eq(clients.id, data.clientId),
  })

  if (!clientFound) {
    throw new ClientNotFound()
  }

  const productPromises = data.products.map(
    async (product) =>
      await db.query.products.findFirst({
        where: (prods, { eq }) => eq(prods.id, product.id),
      }),
  )

  const products = await Promise.all(productPromises)

  const orderItem: CreateOrderItemType[] = []
  try {
    await db.transaction(async (tx) => {
      const orderId = await tx
        .insert(schema.orders)
        .values({
          clientId: data.clientId,
          status: 'CREATED',
          storeId,
        })
        .returning()

      for (const product of products) {
        if (!product) {
          throw new ProductNotFound()
        }

        const amount =
          data.products.find((p) => p.id === product.id)?.amount ?? 0
        orderItem.push({
          amount,
          orderId: orderId[0].id,
          productId: product.id,
          price: product.price,
          decimals: product.decimals,
        })
      }
      await tx.insert(schema.orderItems).values(orderItem)
    })

    return { orderItem }
  } catch (_error) {
    return null
  }
}
export const updateOrder = async ({
  data,
  storeId,
}: {
  data: UpdateOrderType
  storeId: string
}) => {
  const storeFound = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.id, storeId),
  })

  if (!storeFound) {
    throw new StoreNotFound()
  }

  const orderFound = await db.query.orders.findFirst({
    where: (order, { eq, and }) =>
      and(eq(order.id, data.id), eq(order.storeId, storeId)),
  })

  if (!orderFound) {
    throw new OrderNotFound()
  }

  const updatedOrder = await db
    .update(schema.orders)
    .set({
      status: data.status,
      reason: data.reason,
      updatedAt: new Date(),
    })
    .where(
      AND(EQ(schema.orders.id, data.id), EQ(schema.orders.storeId, storeId)),
    )
    .returning()

  return updatedOrder[0]
}

export const getAllOrders = async ({ storeId }: { storeId: string }) => {
  const storeFound = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.id, storeId),
  })

  if (!storeFound) {
    throw new StoreNotFound()
  }

  try {
    const orders = await db
      .select({
        orderId: schema.orders.id,
        clientId: schema.orders.clientId,
        status: schema.orders.status,
        reason: schema.orders.reason,
        createdAt: schema.orders.createdAt,
        updatedAt: schema.orders.updatedAt,
        storeId: schema.orders.storeId,
      })
      .from(schema.orders)
      .where(EQ(schema.orders.storeId, storeId))

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await db
          .select({
            orderItemId: schema.orderItems.id,
            productId: schema.orderItems.productId,
            amount: schema.orderItems.amount,
            price: schema.orderItems.price,
            decimals: schema.orderItems.decimals,
          })
          .from(schema.orderItems)
          .where(EQ(schema.orderItems.orderId, order.orderId))

        return {
          ...order,
          orderItems,
        }
      }),
    )

    return ordersWithItems
  } catch (_error) {
    return []
  }
}

export const getOrderById = async ({
  id,
  storeId,
}: {
  id: string
  storeId: string
}) => {
  const storeFound = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.id, storeId),
  })

  if (!storeFound) {
    throw new StoreNotFound()
  }

  const order = await db.query.orders.findFirst({
    where: (orderTable, { eq, and }) =>
      and(eq(orderTable.id, id), eq(orderTable.storeId, storeId)),
    with: {
      client: true,
      orderItems: {
        with: {
          product: true,
        },
      },
    },
  })

  if (!order) {
    throw new OrderNotFound()
  }

  return order
}

export const deleteOrder = async ({
  id,
  storeId,
}: {
  id: string
  storeId: string
}) => {
  try {
    await db
      .delete(schema.orders)
      .where(AND(EQ(schema.orders.id, id), EQ(schema.orders.storeId, storeId)))
      .execute()
  } catch (_error) {
    throw new DeleteError()
  }
}
