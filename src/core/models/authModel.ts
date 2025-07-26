import type { BcryptHasher } from '../../http/cryptography/bcrypt-hassher.ts'
import type { AuthType, CreateAuthType } from '../../http/types/authTypes.ts'
import type { AuthReporitory } from '../../repositories/authRepository.ts'

export class AuthModels {
  private authRepository: AuthReporitory
  private hashGenerage: BcryptHasher

  constructor(authRepository: AuthReporitory, hashGenerage: BcryptHasher) {
    this.authRepository = authRepository
    this.hashGenerage = hashGenerage
  }

  async createAccount({
    isAdmin,
    password,
    username,
  }: CreateAuthType): Promise<AuthType | null> {
    const passwordHash = await this.hashGenerage.hash(password)

    const user = await this.authRepository.createAccount({
      isAdmin,
      password: passwordHash,
      username,
    })

    return user ?? null
  }

  async findAccountByUsername(username: string): Promise<AuthType | null> {
    return await this.authRepository.findUser(username)
  }
}
