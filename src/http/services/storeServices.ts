import type { CreateStoreType } from '../types/storeTypes.ts'
import { schema } from '../../db/schema/index.ts'
import { db } from '../../db/conection.ts'
import { Slug } from '../../lib/Slub.ts'
import { eq as EQ } from 'drizzle-orm'
import { createAccount } from './authService.ts'

export const createStore = async (data: CreateStoreType) => {
  const {
    address,
    cnpj,
    confirmPassword,
    email,
    name,
    password,
    phone,
    responsibleName,
  } = data

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match')
  }

  const emailAlreadyExists = await db.query.auth.findFirst({
    where: (auth, { eq }) => eq(auth.username, email),
  })

  if (emailAlreadyExists) {
    throw new Error('Email already exists')
  }

  const slug = Slug.createSlugFromText(name)

  const storeAlreadyExists = await db.query.stores.findFirst({
    where: (stores, { eq, or }) =>
      or(eq(stores.cnpj, cnpj), eq(stores.slug, slug.value)),
  })

  if (storeAlreadyExists) {
    throw new Error('Store already exists')
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
  { address, phone, responsibleName, name }: Partial<CreateStoreType>,
  id: string,
) => {
  const storeFound = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.id, id),
  })

  if (!storeFound) {
    throw new Error('Store not found')
  }

  if (name) {
    const slug = Slug.createSlugFromText(name ?? storeFound.name)

    const slugAlreadyExists = await db.query.stores.findFirst({
      where: (stores, { eq }) => eq(stores.slug, slug.value),
    })

    if (slugAlreadyExists) {
      throw new Error('Slug already exists')
    }
  }

  await db
    .update(schema.stores)
    .set({
      city: address?.city ?? storeFound.city,
      district: address?.district ?? storeFound.district,
      number: address?.number ?? storeFound.number,
      state: address?.state ?? storeFound.state,
      street: address?.street ?? storeFound.street,
      zipCode: address?.zipCode ?? storeFound.zipCode,
      complement: address?.complement ?? storeFound.complement,
      phone: phone ?? storeFound.phone,
      responsibleName,
      name: name ?? storeFound.name,
    })
    .where(EQ(schema.stores.id, id))
    .execute()
}
export const changeActiveStore = async (id: string) => {
  const storeFound = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.id, id),
  })

  if (!storeFound) {
    throw new Error('Store not found')
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
export const getBySlugStore = async (slug: string) => {
  const store = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.slug, slug),
  })

  if (!store) {
    throw new Error('Store not found')
  }

  return {
    primaryColor: store.primaryColor,
    secondaryColor: store.secondaryColor,
  }
}
export const getByIdStore = async (id: string) => {
  const store = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.id, id),
  })

  if (!store) {
    throw new Error('Store not found')
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
