import type {
  CreateProductType,
  ProductType,
  UpdateProductType,
} from '../types/productTypes.ts'
import { schema } from '../../db/schema/index.ts'
import { db } from '../../db/conection.ts'
import { eq as EQ } from 'drizzle-orm'
import { Slug } from '../../lib/Slub.ts'
import { ConvertPrice } from '../../lib/ConvertPrice.ts'

export const createProduct = async ({
  data,
  storeId,
}: {
  data: CreateProductType[]
  storeId: string
}) => {
  const storeFound = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.id, storeId),
  })

  if (!storeFound) {
    throw new Error('Store not found')
  }

  const productsError: CreateProductType[] = []
  const productSuccess: ProductType[] = []

  data &&
    data.length > 0 &&
    data.map(
      async ({ price, title, description, imageUrl, amount, stoque }) => {
        const productSlug = Slug.createSlugFromText(title)

        const productFoundBySlug = await db.query.products.findFirst({
          where: (p, { eq }) => eq(p.slug, productSlug.value),
        })

        if (productFoundBySlug) {
          productsError.push({
            price,
            title,
            description,
            imageUrl,
            amount,
            stoque,
          })
          return null
        }

        try {
          const productCreated = await db
            .insert(schema.products)
            .values({
              title,
              description: description ?? null,
              slug: productSlug.value,
              price: ConvertPrice.inInteger({
                rawPrice: price,
                decimal: 2,
              }),
              storeId,
              imageUrl: imageUrl ?? null,
              amount: amount ?? 0,
              stoque: stoque ?? false,
            })
            .returning()

          if (productCreated[0].id) {
            productSuccess.push({
              id: productCreated[0].id,
              title: productCreated[0].title,
              description: productCreated[0].description ?? '',
              slug: productCreated[0].slug ?? '',
              imageUrl: productCreated[0].imageUrl ?? '',
              amount: productCreated[0].amount,
              stoque: productCreated[0].stoque,
              decimals: productCreated[0].decimals,
              storeId: productCreated[0].storeId,
              createdAt: productCreated[0].createdAt,
              updatedAt: productCreated[0].updatedAt,
              price: ConvertPrice.inDecimal({
                decimal: productCreated[0].decimals,
                rawPrice: productCreated[0].price,
              }),
            })
          }

          return productCreated[0]
        } catch (_error) {
          productsError.push({
            price,
            title,
            description,
            imageUrl,
            amount,
            stoque,
          })
          return null
        }
      },
    )

  return { productSuccess, productsError }
}
export const updateProduct = async ({
  data: { id, price, title, amount, description, imageUrl, stoque },
  storeId,
}: {
  data: UpdateProductType
  storeId: string
}) => {
  const storeFound = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.id, storeId),
  })

  if (!storeFound) {
    throw new Error('Store not found')
  }

  const productSlug = Slug.createSlugFromText(title)
  const productFoundBySlug = await db.query.products.findFirst({
    where: (products, { eq, and }) =>
      and(eq(products.slug, productSlug.value), eq(products.storeId, storeId)),
  })

  if (productFoundBySlug) {
    throw new Error('Product tile already exists in this store')
  }

  const productFound = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.id, id),
  })

  if (!productFound) {
    throw new Error('Product not found')
  }

  await db
    .update(schema.products)
    .set({
      title,
      description: description ?? productFound.description,
      price: ConvertPrice.inInteger({
        rawPrice: price,
        decimal: 2,
      }),
      slug: productSlug.value,
      amount: amount ?? productFound.amount,
      stoque: stoque ?? productFound.stoque,
      storeId,
      imageUrl: imageUrl ?? productFound.imageUrl,
    })
    .where(EQ(schema.products.id, id))
    .execute()
}

export const getAllProductsByStore = async ({
  storeSlug,
}: {
  storeSlug: string
}) => {
  const store = await db.query.products.findFirst({
    where: (stores, { eq }) => eq(stores.slug, storeSlug),
  })

  if (!store) {
    throw new Error('Store not found')
  }

  const products = await db.query.products.findMany({
    where: (prodducts, { eq }) => eq(prodducts.storeId, store.id),
  })

  return (
    products.map(
      (product): Partial<ProductType> => ({
        amount: product.amount,
        stoque: product.stoque,
        id: product.id,
        title: product.title,
        description: product.description ?? '',
        storeId: product.storeId,
        slug: product.slug ?? '',
        imageUrl: product.imageUrl ?? '',
        price: ConvertPrice.inDecimal({
          rawPrice: product.price,
          decimal: product.decimals,
        }),
      }),
    ) ?? []
  )
}

export const getAllProductsByStoreId = async ({ id }: { id: string }) => {
  const store = await db.query.products.findFirst({
    where: (stores, { eq }) => eq(stores.slug, id),
  })

  if (!store) {
    throw new Error('Store not found')
  }

  const products =
    (
      await db.query.products.findMany({
        where: (prodducts, { eq }) => eq(prodducts.storeId, store.id),
      })
    ).map(
      (product): ProductType => ({
        ...product,
        description: product.description ?? '',
        slug: product.slug ?? '',
        imageUrl: product.imageUrl ?? '',
        price: ConvertPrice.inDecimal({
          rawPrice: product.price,
          decimal: product.decimals,
        }),
      }),
    ) ?? []

  return products
}

export const deleteProduct = async (id: string) => {
  try {
    await db.delete(schema.stores).where(EQ(schema.stores.id, id)).execute()
  } catch (_error) {
    throw new Error('Error deleting store or Store not found')
  }
}
