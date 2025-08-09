/** biome-ignore-all lint/complexity/noForEach: testando for each */
import type { CreateOrderType, UpdateOrderType } from '../types/orderTypes.ts'
import { schema } from '../../db/schema/index.ts'
import { db } from '../../db/conection.ts'
import { eq as EQ, and as AND } from 'drizzle-orm'
import type { CreateOrderItemType } from '../types/orderItemType.ts'

export const createOrder = async ({
  data,
  storeId,
}: {
  data: CreateOrderType
  storeId: string
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: this is correct
}) => {
  const storeFound = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.id, storeId),
  })

  if (!storeFound) {
    throw new Error('Store not found')
  }

  const clientFound = await db.query.clients.findFirst({
    where: (clients, { eq }) => eq(clients.id, data.clientId),
  })

  if (!clientFound) {
    throw new Error('Client not found')
  }

  const productPromises = data.products.map(
    async (product) =>
      await db.query.products.findFirst({
        where: (prods, { eq }) => eq(prods.id, product.id),
      }),
  )

  const products = await Promise.all(productPromises)

  const orderItem: CreateOrderItemType[] = []
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
        throw new Error('Product not found')
      }

      const amount = data.products.find((p) => p.id === product.id)?.amount ?? 0
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
    throw new Error('Store not found')
  }
  return { data, storeId }
}

export const getAllOrdersByStore = async ({
  storeSlug,
}: {
  storeSlug: string
}) => {
  const store = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.slug, storeSlug),
  })

  if (!store) {
    throw new Error('Store not found')
  }

  return null
}

export const getAllOrdersByStoreId = async ({ id }: { id: string }) => {
  const store = await db.query.orders.findFirst({
    where: (stores, { eq }) => eq(stores.id, id),
  })

  if (!store) {
    throw new Error('Store not found')
  }

  return null
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
    throw new Error('Error deleting store or Store not found')
  }
}
