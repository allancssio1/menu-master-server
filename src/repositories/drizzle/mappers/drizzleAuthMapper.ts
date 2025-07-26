import type { schema } from '../../../db/drizzle/schema/index.ts'
import type { AuthType } from '../../../http/types/authTypes.ts'
import type { Optional } from '../../../lib/Optional.ts'

export class DrizzleAuthMapper {
  toDrizzle(
    raw: Optional<AuthType, 'createdAt' | 'id' | 'updatedAt'>,
  ): typeof schema.auth.$inferInsert {
    return {
      username: raw.username,
      password: raw.password,
      role: raw.isAdmin ? 'ADMIN' : 'STORE',
    }
  }
  toModel(raw: typeof schema.auth.$inferSelect): AuthType {
    return {
      id: raw.id,
      isAdmin: raw.role === 'ADMIN',
      username: raw.username,
      password: raw.password ? '' : '',
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }
}
