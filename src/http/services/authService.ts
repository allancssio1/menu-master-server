import { db } from '../../db/conection.ts'
import { compare, hash } from 'bcryptjs'
import { schema } from '../../db/schema/index.ts'
import { InvalidCredentials } from '../../errors/invalidCredentials.ts'
import { UserAlreadyExists } from '../../errors/userAlreadyExists.ts'

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
    throw new InvalidCredentials()
  }

  const passwordMatch = await compare(password, userAuth.password)

  if (!passwordMatch) {
    throw new InvalidCredentials()
  }

  // Se for ADMIN, retornar diretamente sem verificar loja
  if (userAuth.role === 'ADMIN') {
    return {
      id: userAuth.id,
      role: userAuth.role,
    }
  }

  // Para STORE, verificar se tem loja associada
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
    throw new UserAlreadyExists()
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
