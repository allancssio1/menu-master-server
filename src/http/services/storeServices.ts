import type { CreateStoreType, StoreType } from '../types/storeTypes.ts'
import { schema } from '../../db/schema/index.ts'
import { db } from '../../db/conection.ts'
import { Slug } from '../../lib/Slub.ts'
import { eq as EQ } from 'drizzle-orm'
import { createAccount } from './authService.ts'
import { StoreNotFound } from '../../errors/storeNotFound.ts'
import { EmailAlreadyExists } from '../../errors/emailAlreadyExists.ts'
import { SlugAlreadyExists } from '../../errors/slugAlreadyExists.ts'
import { StoreAlreadyExists } from '../../errors/storeAlreadyExists.ts'

export const createStore = async (data: CreateStoreType) => {
  const { address, cnpj, email, name, password, phone, responsibleName } = data

  const emailAlreadyExists = await db.query.auth.findFirst({
    where: (auth, { eq }) => eq(auth.username, email),
  })

  if (emailAlreadyExists) {
    throw new EmailAlreadyExists()
  }

  const slug = Slug.createSlugFromText(name)

  const storeAlreadyExists = await db.query.stores.findFirst({
    where: (stores, { eq, or }) =>
      or(eq(stores.cnpj, cnpj), eq(stores.slug, slug.value)),
  })

  if (storeAlreadyExists) {
    throw new StoreAlreadyExists()
  }

  const authStore = await createAccount({
    username: email,
    password,
  })

  const store = await db
    .insert(schema.stores)
    .values({
      userId: authStore.id,
      name,
      cnpj,
      slug: slug.value,
      email,
      responsibleName,
      phone,
      city: address.city,
      district: address.district,
      number: address.number,
      state: address.state,
      street: address.street,
      zipCode: address.zipCode,
      complement: address.complement ?? '',
    })
    .returning()

  return store[0]
}
export const updateStore = async (
  data: Partial<CreateStoreType>,
  id: string,
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: permition
) => {
  const storeFound = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.id, id),
  })

  if (!storeFound) {
    throw new StoreNotFound()
  }

  const slug = Slug.createSlugFromText(data.name ?? storeFound.name)
  if (data.name) {
    const slugAlreadyExists = await db.query.stores.findFirst({
      where: (stores, { eq }) => eq(stores.slug, slug.value),
    })

    if (slugAlreadyExists) {
      throw new SlugAlreadyExists()
    }
  }
  const updatedStoreData = {
    city: data.address?.city ?? storeFound.city,
    district: data.address?.district ?? storeFound.district,
    number: data.address?.number ?? storeFound.number,
    state: data.address?.state ?? storeFound.state,
    street: data.address?.street ?? storeFound.street,
    zipCode: data.address?.zipCode ?? storeFound.zipCode,
    complement: data.address?.complement ?? storeFound.complement,
    slug: slug.value,
    phone: data.phone ?? storeFound.phone,
    responsibleName: data.responsibleName ?? storeFound.responsibleName,
    name: data.name ?? storeFound.name,
  }

  await db
    .update(schema.stores)
    .set(updatedStoreData)
    .where(EQ(schema.stores.id, id))
    .execute()

  return {
    id: storeFound.id,
    isActive: storeFound.isActive,
    userId: storeFound.userId,
    createdAt: storeFound.createdAt,
    updatedAt: storeFound.updatedAt,
    responsibleName: updatedStoreData.responsibleName,
    email: storeFound.email,
    cnpj: storeFound.cnpj,
    phone: updatedStoreData.phone,
    name: updatedStoreData.name,
    slug: updatedStoreData.slug,
    address: {
      city: updatedStoreData.city,
      district: updatedStoreData.district,
      number: updatedStoreData.number,
      state: updatedStoreData.state,
      street: updatedStoreData.street,
      zipCode: updatedStoreData.zipCode,
      complement: updatedStoreData.complement ?? '',
    },
  }
}
export const changeActiveStore = async (id: string) => {
  const storeFound = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.id, id),
  })

  if (!storeFound) {
    throw new StoreNotFound()
  }

  await db
    .update(schema.stores)
    .set({ isActive: !storeFound.isActive })
    .where(EQ(schema.stores.id, id))
    .execute()
}
export const getAllStores = async () => {
  const stores = await db.query.stores.findMany()

  return stores ?? []
}
export const getBySlugStore = async (
  slug: string,
): Promise<
  Omit<
    StoreType,
    | 'userId'
    | 'email'
    | 'responsibleName'
    | 'createdAt'
    | 'updatedAt'
    | 'updatedAt'
  >
> => {
  const store = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.slug, slug),
  })

  if (!store) {
    throw new StoreNotFound()
  }

  return {
    id: store.id,
    isActive: store.isActive,
    cnpj: store.cnpj,
    name: store.name,
    phone: store.phone,
    slug: store.slug,
    imageUrl: store.imageUrl ?? '',
    accentColor: store.accentColor,
    primaryColor: store.primaryColor,
    secondaryColor: store.secondaryColor,
    address: {
      city: store.city,
      district: store.district,
      number: store.number,
      state: store.state,
      street: store.street,
      zipCode: store.zipCode,
      complement: store.complement ?? '',
    },
  }
}
export const getByIdStore = async (id: string) => {
  const store = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.id, id),
  })

  if (!store) {
    throw new StoreNotFound()
  }

  return store
}
export const deleteStore = async (id: string) => {
  const store = await db
    .delete(schema.stores)
    .where(EQ(schema.stores.id, id))
    .execute()

  return store
}
