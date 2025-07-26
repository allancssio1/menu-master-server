import type { CreateStoreModelType } from '../../http/types/storeTypes.ts'
import { Slug } from '../../lib/Slub.ts'
import type { StoreReporitory } from '../../repositories/storeRepository.ts'

export class StoreModels {
  private storeRepository: StoreReporitory

  constructor(storeRepository: StoreReporitory) {
    this.storeRepository = storeRepository
  }
  async createStore({
    address,
    cnpj,
    email,
    name,
    phone,
    responsibleName,
    userId,
  }: CreateStoreModelType) {
    const slug = Slug.createSlugFromText(name)
    const storeAlreadyExists = await this.storeRepository.getStore({
      slug: slug.value,
      cnpj,
    })

    if (storeAlreadyExists) {
      throw new Error('Store already exists')
    }

    const store = await this.storeRepository.createStore({
      address,
      cnpj,
      email,
      name,
      phone,
      responsibleName,
      slug: slug.value,
      userId,
    })

    return store
  }
}
