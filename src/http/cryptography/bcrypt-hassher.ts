import { hash as hashBcryptjs, compare as compareBcryptjs } from 'bcryptjs'
import type { HashGenerate } from './hasher-generate.ts'
import type { HashCompare } from './hashser-compare.ts'

export class BcryptHasher implements HashGenerate, HashCompare {
  async hash(plain: string): Promise<string> {
    return await hashBcryptjs(plain, 8)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await compareBcryptjs(plain, hash)
  }
}
