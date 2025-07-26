import type { schema } from '../../../db/drizzle/schema/index.ts'
import type { StoreType } from '../../../http/types/storeTypes.ts'

export class DrizzleStoreMapper {
  toDrizzle(raw: StoreType): typeof schema.stores.$inferInsert {
    return {
      name: raw.name,
      responsibleName: raw.responsibleName,
      cnpj: raw.cnpj,
      slug: raw.slug,
      accentColor: raw.accentColor,
      imageUrl: raw.imageUrl ?? '',
      primaryColor: raw.primaryColor,
      secondaryColor: raw.secondaryColor,
      email: raw.email,
      userId: raw.userId ?? '',
      phone: raw.phone,
      city: raw.address.city,
      district: raw.address.district,
      number: raw.address.number,
      state: raw.address.state,
      street: raw.address.street,
      zipCode: raw.address.zipCode,
      complement: raw.address.complement ?? null,
      isActive: false,
    }
  }
  toModel(raw: typeof schema.stores.$inferSelect): StoreType {
    return {
      id: raw.id,
      isActive: raw.isActive,
      name: raw.name,
      responsibleName: raw.responsibleName,
      cnpj: raw.cnpj,
      slug: raw.slug,
      accentColor: raw.accentColor,
      imageUrl: raw.imageUrl ?? '',
      primaryColor: raw.primaryColor,
      secondaryColor: raw.secondaryColor,
      email: raw.email,
      userId: raw.userId,
      phone: raw.phone,
      address: {
        city: raw.city,
        district: raw.district,
        number: raw.number,
        state: raw.state,
        street: raw.street,
        zipCode: raw.zipCode,
        complement: raw.complement ?? '',
      },
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }
}
