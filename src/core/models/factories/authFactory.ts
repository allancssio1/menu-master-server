import { BcryptHasher } from '../../../http/cryptography/bcrypt-hassher.ts'
import { DrizzleAuthRepository } from '../../../repositories/drizzle/repositories/drizzleAuthRepository.ts'
import { AuthModels } from '../authModel.ts'

const repository = new DrizzleAuthRepository()
const cryptography = new BcryptHasher()
const authModel = new AuthModels(repository, cryptography)

export const createAccountModel = authModel.createAccount
export const findUserByUsernameModel = authModel.findAccountByUsername
