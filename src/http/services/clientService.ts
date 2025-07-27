import { db } from '../../db/conection.ts'
import { eq as EQ } from 'drizzle-orm'
import { schema } from '../../db/schema/index.ts'
import type {
  CreateClientType,
  UpdateClientType,
} from '../types/clientTypes.ts'

export const createClientService = async (data: CreateClientType) => {
  const clientAlreadyExists = await db.query.clients.findFirst({
    where: (clients, { eq }) => eq(clients.phone, data.phone),
  })

  if (clientAlreadyExists) {
    throw new Error('Client already exists')
  }

  const client = await db
    .insert(schema.clients)
    .values({
      ...data,
      phone: data.phone.replace(/\D/g, ''),
      zipCode: data.zipCode.replace(/\D/g, ''),
    })
    .returning()

  return client[0]
}

export const getAllClientsService = async () => {
  return (await db.select().from(schema.clients)) ?? []
}

export const updateClientService = async ({
  data,
  id,
}: {
  data: UpdateClientType
  id: string
}) => {
  const clientFound = await db.query.clients.findFirst({
    where: (clients, { eq }) => eq(clients.id, id),
  })

  if (!clientFound) {
    throw new Error('Client not found')
  }

  await db
    .update(schema.clients)
    .set({
      ...data,
      phone: data.phone ? data.phone.replace(/\D/g, '') : clientFound.phone,
      zipCode: data.zipCode
        ? data.zipCode.replace(/\D/g, '')
        : clientFound.zipCode,
    })
    .where(EQ(schema.clients.id, id))
    .execute()
}

export const findClientByIdService = async (id: string) => {
  const client = await db
    .select()
    .from(schema.clients)
    .where(EQ(schema.clients.id, id))

  return client ?? null
}

export const findClientByPhoneService = async (phone: string) => {
  const client = await db
    .select()
    .from(schema.clients)
    .where(EQ(schema.clients.phone, phone))

  return client ?? null
}

export const deleteClientService = async (id: string) => {
  console.log('🚀 ~ deleteClientService ~ id:', id)
  const client = await db
    .select()
    .from(schema.clients)
    .where(EQ(schema.clients.id, id))

  if (!client) {
    throw new Error('Client not found')
  }

  await db.delete(schema.clients).where(EQ(schema.clients.id, id)).execute()

  return id
}
