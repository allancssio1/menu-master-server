import { db } from '../../db/conection.ts'
import { compare, hash } from 'bcryptjs'
import { schema } from '../../db/schema/index.ts'

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

export const createAccount = async ({
  username,
  password,
  isAdmin = false,
}: {
  username: string
  password: string
  isAdmin?: boolean
}) => {
  const userAlreadyExists = await db.query.auth.findFirst({
    where: (auth, { eq }) => eq(auth.username, username),
  })

  if (userAlreadyExists) {
    throw new Error('User already exists')
  }

  const passwordHash = await hash(password, 8)

  const user = await db
    .insert(schema.auth)
    .values({
      username,
      password: passwordHash,
      role: isAdmin ? 'ADMIN' : 'STORE',
    })
    .returning()

  return user[0]
}
