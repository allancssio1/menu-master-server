import { db } from '../../db/conection.ts'
import { schema } from '../../db/schema/index.ts'
import { count, sql, eq as EQ, desc } from 'drizzle-orm'
import { StoreNotFound } from '../../errors/storeNotFound.ts'
import { ClientNotFound } from '../../errors/clientNotFound.ts'

export const getDashboardMetrics = async () => {
  // Contar total de lojas
  const totalStores = await db.select({ count: count() }).from(schema.stores)

  // Contar total de clientes
  const totalClients = await db.select({ count: count() }).from(schema.clients)

  // Contar total de produtos
  const totalProducts = await db
    .select({ count: count() })
    .from(schema.products)

  // Contar total de pedidos
  const totalOrders = await db.select({ count: count() }).from(schema.orders)

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
    .innerJoin(
      schema.stores,
      sql`${schema.orders.storeId} = ${schema.stores.id}`,
    )
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

// CRUD de Lojas para Admin
export const getAllStoresAdmin = async () => {
  const stores = await db
    .select({
      id: schema.stores.id,
      name: schema.stores.name,
      slug: schema.stores.slug,
      cnpj: schema.stores.cnpj,
      email: schema.stores.email,
      phone: schema.stores.phone,
      responsibleName: schema.stores.responsibleName,
      isActive: schema.stores.isActive,
      city: schema.stores.city,
      state: schema.stores.state,
      createdAt: schema.stores.createdAt,
      updatedAt: schema.stores.updatedAt,
    })
    .from(schema.stores)
    .orderBy(desc(schema.stores.createdAt))

  return stores
}

export const getStoreByIdAdmin = async (storeId: string) => {
  const store = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.id, storeId),
  })

  if (!store) {
    throw new StoreNotFound()
  }

  // Buscar métricas da loja
  const totalProducts = await db
    .select({ count: count() })
    .from(schema.products)
    .where(EQ(schema.products.storeId, storeId))

  const totalOrders = await db
    .select({ count: count() })
    .from(schema.orders)
    .where(EQ(schema.orders.storeId, storeId))

  const totalRevenue = await db
    .select({
      total: sql<number>`COALESCE(SUM(${schema.orderItems.price} * ${schema.orderItems.amount}), 0)`,
    })
    .from(schema.orderItems)
    .innerJoin(schema.orders, eq(schema.orders.id, schema.orderItems.orderId))
    .where(EQ(schema.orders.storeId, storeId))

  return {
    ...store,
    address: {
      zipCode: store.zipCode,
      street: store.street,
      number: store.number,
      district: store.district,
      city: store.city,
      state: store.state,
      complement: store.complement,
    },
    metrics: {
      totalProducts: totalProducts[0]?.count || 0,
      totalOrders: totalOrders[0]?.count || 0,
      totalRevenue: totalRevenue[0]?.total || 0,
    },
  }
}

export const updateStoreStatusAdmin = async (
  storeId: string,
  isActive: boolean,
) => {
  const store = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.id, storeId),
  })

  if (!store) {
    throw new StoreNotFound()
  }

  await db
    .update(schema.stores)
    .set({
      isActive,
      updatedAt: new Date(),
    })
    .where(EQ(schema.stores.id, storeId))

  return {
    id: storeId,
    isActive,
    message: `Loja ${isActive ? 'ativada' : 'desativada'} com sucesso`,
  }
}

export const deleteStoreAdmin = async (storeId: string) => {
  const store = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.id, storeId),
  })

  if (!store) {
    throw new StoreNotFound()
  }

  // Primeiro, deletar produtos associados
  await db.delete(schema.products).where(EQ(schema.products.storeId, storeId))

  // Depois, deletar a loja
  await db.delete(schema.stores).where(EQ(schema.stores.id, storeId))

  return {
    id: storeId,
    message: 'Loja deletada com sucesso',
  }
}

// CRUD de Clientes para Admin
export const getAllClientsAdmin = async () => {
  const clients = await db
    .select({
      id: schema.clients.id,
      name: schema.clients.name,
      phone: schema.clients.phone,
      city: schema.clients.city,
      state: schema.clients.state,
      zipCode: schema.clients.zipCode,
      street: schema.clients.street,
      number: schema.clients.number,
      district: schema.clients.district,
      complement: schema.clients.complement,
    })
    .from(schema.clients)
    .orderBy(desc(schema.clients.name))

  return clients
}

export const getClientByIdAdmin = async (clientId: string) => {
  const client = await db.query.clients.findFirst({
    where: (clients, { eq }) => eq(clients.id, clientId),
  })

  if (!client) {
    throw new ClientNotFound()
  }

  // Buscar métricas do cliente - pedidos feitos
  const totalOrders = await db
    .select({ count: count() })
    .from(schema.orders)
    .where(EQ(schema.orders.clientId, clientId))

  const totalSpent = await db
    .select({
      total: sql<number>`COALESCE(SUM(${schema.orderItems.price} * ${schema.orderItems.amount}), 0)`,
    })
    .from(schema.orderItems)
    .innerJoin(schema.orders, eq(schema.orders.id, schema.orderItems.orderId))
    .where(EQ(schema.orders.clientId, clientId))

  // Pedidos recentes (últimos 5)
  const recentOrders = await db
    .select({
      id: schema.orders.id,
      status: schema.orders.status,
      createdAt: schema.orders.createdAt,
      storeName: schema.stores.name,
      total: sql<number>`COALESCE(SUM(${schema.orderItems.price} * ${schema.orderItems.amount}), 0)`,
    })
    .from(schema.orders)
    .innerJoin(schema.stores, EQ(schema.stores.id, schema.orders.storeId))
    .innerJoin(
      schema.orderItems,
      EQ(schema.orderItems.orderId, schema.orders.id),
    )
    .where(EQ(schema.orders.clientId, clientId))
    .groupBy(
      schema.orders.id,
      schema.orders.status,
      schema.orders.createdAt,
      schema.stores.name,
    )
    .orderBy(desc(schema.orders.createdAt))
    .limit(5)

  return {
    ...client,
    address: {
      zipCode: client.zipCode,
      street: client.street,
      number: client.number,
      district: client.district,
      city: client.city,
      state: client.state,
      complement: client.complement,
    },
    metrics: {
      totalOrders: totalOrders[0]?.count || 0,
      totalSpent: totalSpent[0]?.total || 0,
      recentOrders: recentOrders || [],
    },
  }
}

export const deleteClientAdmin = async (clientId: string) => {
  const client = await db.query.clients.findFirst({
    where: (clients, { eq }) => eq(clients.id, clientId),
  })

  if (!client) {
    throw new ClientNotFound()
  }

  // Verificar se o cliente tem pedidos
  const hasOrders = await db
    .select({ count: count() })
    .from(schema.orders)
    .where(EQ(schema.orders.clientId, clientId))

  if (hasOrders[0]?.count > 0) {
    return {
      id: clientId,
      message: 'Cliente não pode ser deletado pois possui pedidos associados',
      canDelete: false,
    }
  }

  // Deletar cliente se não tiver pedidos
  await db.delete(schema.clients).where(EQ(schema.clients.id, clientId))

  return {
    id: clientId,
    message: 'Cliente deletado com sucesso',
    canDelete: true,
  }
}

// Relatórios/Métricas Expandidas
export const getStoresReport = async () => {
  // Lojas ativas vs inativas
  const storesByStatus = await db
    .select({
      isActive: schema.stores.isActive,
      count: count(),
    })
    .from(schema.stores)
    .groupBy(schema.stores.isActive)

  // Top 10 lojas por número de pedidos
  const topStoresByOrders = await db
    .select({
      storeId: schema.orders.storeId,
      storeName: schema.stores.name,
      storeSlug: schema.stores.slug,
      city: schema.stores.city,
      state: schema.stores.state,
      isActive: schema.stores.isActive,
      totalOrders: count(),
    })
    .from(schema.orders)
    .innerJoin(schema.stores, EQ(schema.stores.id, schema.orders.storeId))
    .groupBy(
      schema.orders.storeId,
      schema.stores.name,
      schema.stores.slug,
      schema.stores.city,
      schema.stores.state,
      schema.stores.isActive,
    )
    .orderBy(desc(count()))
    .limit(10)

  // Top 10 lojas por receita
  const topStoresByRevenue = await db
    .select({
      storeId: schema.orders.storeId,
      storeName: schema.stores.name,
      storeSlug: schema.stores.slug,
      totalRevenue: sql<number>`COALESCE(SUM(${schema.orderItems.price} * ${schema.orderItems.amount}), 0)`,
    })
    .from(schema.orders)
    .innerJoin(schema.stores, EQ(schema.stores.id, schema.orders.storeId))
    .innerJoin(
      schema.orderItems,
      EQ(schema.orderItems.orderId, schema.orders.id),
    )
    .groupBy(schema.orders.storeId, schema.stores.name, schema.stores.slug)
    .orderBy(
      sql`SUM(${schema.orderItems.price} * ${schema.orderItems.amount}) DESC`,
    )
    .limit(10)

  // Distribuição por estados
  const storesByState = await db
    .select({
      state: schema.stores.state,
      count: count(),
    })
    .from(schema.stores)
    .groupBy(schema.stores.state)
    .orderBy(desc(count()))

  return {
    overview: {
      total: storesByStatus.reduce((acc, curr) => acc + curr.count, 0),
      active: storesByStatus.find((s) => s.isActive)?.count || 0,
      inactive: storesByStatus.find((s) => !s.isActive)?.count || 0,
    },
    topStoresByOrders: topStoresByOrders || [],
    topStoresByRevenue: topStoresByRevenue || [],
    storesByState: storesByState || [],
  }
}

export const getClientsReport = async () => {
  // Top 10 clientes por número de pedidos
  const topClientsByOrders = await db
    .select({
      clientId: schema.orders.clientId,
      clientName: schema.clients.name,
      clientPhone: schema.clients.phone,
      clientCity: schema.clients.city,
      clientState: schema.clients.state,
      totalOrders: count(),
    })
    .from(schema.orders)
    .innerJoin(schema.clients, EQ(schema.clients.id, schema.orders.clientId))
    .groupBy(
      schema.orders.clientId,
      schema.clients.name,
      schema.clients.phone,
      schema.clients.city,
      schema.clients.state,
    )
    .orderBy(desc(count()))
    .limit(10)

  // Top 10 clientes por valor gasto
  const topClientsBySpending = await db
    .select({
      clientId: schema.orders.clientId,
      clientName: schema.clients.name,
      clientPhone: schema.clients.phone,
      totalSpent: sql<number>`COALESCE(SUM(${schema.orderItems.price} * ${schema.orderItems.amount}), 0)`,
    })
    .from(schema.orders)
    .innerJoin(schema.clients, EQ(schema.clients.id, schema.orders.clientId))
    .innerJoin(
      schema.orderItems,
      EQ(schema.orderItems.orderId, schema.orders.id),
    )
    .groupBy(schema.orders.clientId, schema.clients.name, schema.clients.phone)
    .orderBy(
      sql`SUM(${schema.orderItems.price} * ${schema.orderItems.amount}) DESC`,
    )
    .limit(10)

  // Distribuição de clientes por estado
  const clientsByState = await db
    .select({
      state: schema.clients.state,
      count: count(),
    })
    .from(schema.clients)
    .groupBy(schema.clients.state)
    .orderBy(desc(count()))

  // Distribuição de clientes por cidade (top 10)
  const clientsByCity = await db
    .select({
      city: schema.clients.city,
      state: schema.clients.state,
      count: count(),
    })
    .from(schema.clients)
    .groupBy(schema.clients.city, schema.clients.state)
    .orderBy(desc(count()))
    .limit(10)

  const totalClients = await db.select({ count: count() }).from(schema.clients)

  return {
    overview: {
      totalClients: totalClients[0]?.count || 0,
    },
    topClientsByOrders: topClientsByOrders || [],
    topClientsBySpending: topClientsBySpending || [],
    clientsByState: clientsByState || [],
    clientsByCity: clientsByCity || [],
  }
}
