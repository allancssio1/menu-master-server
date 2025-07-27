/** biome-ignore-all lint/complexity/noForEach: testando for each */
import type {
  CreateOrderType,
  OrderType,
  UpdateOrderType,
} from '../types/orderTypes.ts'
import { schema } from '../../db/schema/index.ts'
import { db } from '../../db/conection.ts'
import { eq as EQ, and as AND } from 'drizzle-orm'

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

  return { data, storeId }
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
