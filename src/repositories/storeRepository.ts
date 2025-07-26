import type { StoreType, UpdateStoreType } from '../http/types/storeTypes.ts'
import type { Optional } from '../lib/Optional.ts'

export interface StoreReporitory {
  createStore(
    data: Optional<
      StoreType,
      | 'id'
      | 'imageUrl'
      | 'primaryColor'
      | 'secondaryColor'
      | 'accentColor'
      | 'isActive'
      | 'createdAt'
      | 'updatedAt'
    >,
  ): Promise<StoreType>
  updateStore(data: UpdateStoreType): Promise<StoreType>
  deleteStore(id: string): Promise<void>
  changeActiveStoreid(id: string): Promise<void>
  getAllStores(): Promise<StoreType[]>
  getBySlugStore(slug: string): Promise<StoreType | null>
  getStore(data: { slug: string; cnpj: string }): Promise<StoreType | null>
  getByIdStore(id: string): Promise<StoreType | null>
  findBySlugStore(slug: string): Promise<StoreType | null>
}
