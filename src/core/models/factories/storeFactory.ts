import { DrizzleStoreRepository } from '../../../repositories/drizzle/repositories/drizzleStoreRepository.ts'
import { StoreModels } from '../storeModel.ts'

const repository = new DrizzleStoreRepository()
const storeModel = new StoreModels(repository)

export const createStoreModel = storeModel.createStore
