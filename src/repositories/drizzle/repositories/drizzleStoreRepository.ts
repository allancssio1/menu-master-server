import { db } from '../../../db/drizzle/conection.ts'
import { schema } from '../../../db/drizzle/schema/index.ts'
import type {
  StoreType,
  UpdateStoreType,
} from '../../../http/types/storeTypes.ts'
import type { Optional } from '../../../lib/Optional.ts'
import type { StoreReporitory } from '../../storeRepository.ts'
import { DrizzleStoreMapper } from '../mappers/drizzleStoreMapper.ts'

export class DrizzleStoreRepository implements StoreReporitory {
  mapper = new DrizzleStoreMapper()

  async createStore({
    address,
    cnpj,
    email,
    name,
    phone,
    responsibleName,
    slug,
    userId,
  }: Optional<
    StoreType,
    | 'id'
    | 'imageUrl'
    | 'primaryColor'
    | 'secondaryColor'
    | 'accentColor'
    | 'isActive'
    | 'createdAt'
    | 'updatedAt'
  >): Promise<StoreType> {
    const store = await db
      .insert(schema.stores)
      .values({
        userId: userId ?? '',
        name,
        cnpj,
        slug: slug ?? '',
        email,
        responsibleName,
        phone,
        city: address.city,
        district: address.district,
        number: address.number,
        state: address.state,
        street: address.street,
        zipCode: address.zipCode,
        complement: address.complement ?? '',
      })
      .returning()

    return store[0] && this.mapper.toModel(store[0])
  }
  updateStore(data: UpdateStoreType): Promise<StoreType> {
    throw new Error('Method not implemented.')
  }
  findBySlugStore(slug: string): Promise<StoreType> {
    throw new Error('Method not implemented.')
  }
  deleteStore(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  changeActiveStoreid(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  getAllStores(): Promise<StoreType[]> {
    throw new Error('Method not implemented.')
  }
  async getStore({
    slug,
    cnpj,
  }: {
    slug: string
    cnpj: string
  }): Promise<StoreType | null> {
    const storeAlreadyExists = await db.query.stores.findFirst({
      where: (stores, { eq, or }) =>
        or(eq(stores.cnpj, cnpj), eq(stores.slug, slug)),
    })
    return storeAlreadyExists ? this.mapper.toModel(storeAlreadyExists) : null
  }
  getBySlugStore(slug: string): Promise<StoreType | null> {
    throw new Error('Method not implemented.')
  }
  getByIdStore(id: string): Promise<StoreType | null> {
    throw new Error('Method not implemented.')
  }
}
