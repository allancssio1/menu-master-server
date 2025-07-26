import { compare } from 'bcryptjs'
import {
  createAccountModel,
  findUserByUsernameModel,
} from '../models/factories/authFactory.ts'
import { db } from '../../db/drizzle/conection.ts'
import type { AuthType, CreateAuthType } from '../../http/types/authTypes.ts'

export const login = async ({
  password,
  username,
}: {
  username: string
  password: string
}): Promise<{ id: string; role: 'ADMIN' | 'STORE' } | null> => {
  const userAuth = await db.query.auth.findFirst({
    where: (auth, { eq }) => eq(auth.username, username),
  })

  if (!userAuth) {
    throw new Error('Invalid credentials')
  }

  const passwordMatch = await compare(password, userAuth.password)

  if (!passwordMatch) {
    throw new Error('Invalid credentials')
  }

  const store = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.userId, userAuth.id),
  })

  return store
    ? {
        id: store.id,
        role: userAuth.role,
      }
    : null
}

export const createAccountService = async ({
  isAdmin,
  password,
  username,
}: CreateAuthType): Promise<AuthType> => {
  const userAlreadyExists = await findUserByUsernameModel(username)

  if (userAlreadyExists) {
    throw new Error('User already exists')
  }

  const user = await createAccountModel({
    isAdmin,
    password,
    username,
  })

  if (!user || (user && !user.id)) {
    throw new Error('error creating user account')
  }

  return { ...user, password: '' }
}
