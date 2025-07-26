import type { AuthType } from '../http/types/authTypes.ts'
import type { Optional } from '../lib/Optional.ts'

export interface AuthReporitory {
  createAccount(
    data: Optional<AuthType, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AuthType>
  findUser(username: string): Promise<AuthType | null>
}
