import { db } from '../../db/conection.ts'
import { schema } from '../../db/schema/index.ts'
import { count, sql } from 'drizzle-orm'

export const getDashboardMetrics = async () => {
  // Contar total de lojas
  const totalStores = await db
    .select({ count: count() })
    .from(schema.stores)

  // Contar total de clientes
  const totalClients = await db
    .select({ count: count() })
    .from(schema.clients)

  // Contar total de produtos
  const totalProducts = await db
    .select({ count: count() })
    .from(schema.products)

  // Contar total de pedidos
  const totalOrders = await db
    .select({ count: count() })
    .from(schema.orders)

  // Pedidos por status
  const ordersByStatus = await db
    .select({
      status: schema.orders.status,
      count: count(),
    })
    .from(schema.orders)
    .groupBy(schema.orders.status)

  // Calcular revenue total (soma dos preços dos order items)
  const totalRevenue = await db
    .select({
      total: sql<number>`COALESCE(SUM(${schema.orderItems.price} * ${schema.orderItems.amount}), 0)`,
    })
    .from(schema.orderItems)

  // Lojas com mais pedidos (top 5)
  const topStores = await db
    .select({
      storeId: schema.orders.storeId,
      storeName: schema.stores.name,
      orderCount: count(),
    })
    .from(schema.orders)
    .innerJoin(schema.stores, sql`${schema.orders.storeId} = ${schema.stores.id}`)
    .groupBy(schema.orders.storeId, schema.stores.name)
    .orderBy(sql`COUNT(*) DESC`)
    .limit(5)

  return {
    overview: {
      totalStores: totalStores[0]?.count || 0,
      totalClients: totalClients[0]?.count || 0,
      totalProducts: totalProducts[0]?.count || 0,
      totalOrders: totalOrders[0]?.count || 0,
      totalRevenue: totalRevenue[0]?.total || 0,
    },
    ordersByStatus: ordersByStatus || [],
    topStores: topStores || [],
  }
}