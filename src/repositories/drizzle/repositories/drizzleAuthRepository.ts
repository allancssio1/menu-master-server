import { db } from '../../../db/drizzle/conection.ts'
import { schema } from '../../../db/drizzle/schema/index.ts'
import type { AuthType } from '../../../http/types/authTypes.ts'
import type { Optional } from '../../../lib/Optional.ts'
import type { AuthReporitory } from '../../authRepository.ts'
import { DrizzleAuthMapper } from '../mappers/drizzleAuthMapper.ts'

export class DrizzleAuthRepository implements AuthReporitory {
  mapper = new DrizzleAuthMapper()

  async createAccount({
    isAdmin,
    password,
    username,
  }: Optional<AuthType, 'id' | 'createdAt' | 'updatedAt'>): Promise<AuthType> {
    const userData = this.mapper.toDrizzle({
      isAdmin,
      password,
      username,
    })
    const user = await db.insert(schema.auth).values(userData).returning()

    return user[0] && this.mapper.toModel(user[0])
  }
  async findUser(username: string): Promise<AuthType | null> {
    const user = await db.query.auth.findFirst({
      where: (auth, { eq }) => eq(auth.username, username),
    })

    return user ? this.mapper.toModel(user) : null
  }
}
