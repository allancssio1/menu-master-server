/** biome-ignore-all lint/complexity/noForEach: testando for each */
import type {
  CreateProductType,
  ProductType,
  UpdateProductType,
} from '../types/productTypes.ts'
import { schema } from '../../db/schema/index.ts'
import { db } from '../../db/conection.ts'
import { eq as EQ, and as AND } from 'drizzle-orm'
import { Slug } from '../../lib/Slub.ts'
import { ConvertPrice } from '../../lib/ConvertPrice.ts'
import { StoreNotFound } from '../../errors/storeNotFound.ts'
import { ProductTitleAlreadyExists } from '../../errors/productTitleAlreadyExists.ts'
import { ProductNotFound } from '../../errors/productNotFound.ts'
import { DeleteError } from '../../errors/deleteError.ts'

export const createProduct = async ({
  data,
  storeId,
}: {
  data: CreateProductType
  storeId: string
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: this is correct
}) => {
  const storeFound = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.id, storeId),
  })

  if (!storeFound) {
    throw new StoreNotFound()
  }

  const productsError: CreateProductType = []
  const productSuccess: ProductType[] = []

  if (data && data.length > 0) {
    for (const { price, title, description, imageUrl, amount, stock } of data) {
      const productSlug = Slug.createSlugFromText(title)

      // biome-ignore lint/nursery/noAwaitInLoop: this is correct
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
          stock,
        })
        continue
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
            stock: stock ?? false,
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
            stock: productCreated[0].stock,
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
      } catch (_error) {
        productsError.push({
          price,
          title,
          description,
          imageUrl,
          amount,
          stock,
        })
      }
    }
    // data.forEach(
    //   // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: disabled '=>'
    //   async ({ price, title, description, imageUrl, amount, stock }) => {
    //     const productSlug = Slug.createSlugFromText(title)

    //     const productFoundBySlug = await db.query.products.findFirst({
    //       where: (p, { eq }) => eq(p.slug, productSlug.value),
    //     })

    //     if (productFoundBySlug) {
    //       productsError.push({
    //         price,
    //         title,
    //         description,
    //         imageUrl,
    //         amount,
    //         stock,
    //       })
    //       return null
    //     }

    //     try {
    //       const productCreated = await db
    //         .insert(schema.products)
    //         .values({
    //           title,
    //           description: description ?? null,
    //           slug: productSlug.value,
    //           price: ConvertPrice.inInteger({
    //             rawPrice: price,
    //             decimal: 2,
    //           }),
    //           storeId,
    //           imageUrl: imageUrl ?? null,
    //           amount: amount ?? 0,
    //           stock: stock ?? false,
    //         })
    //         .returning()

    //       if (productCreated[0].id) {
    //         productSuccess.push({
    //           id: productCreated[0].id,
    //           title: productCreated[0].title,
    //           description: productCreated[0].description ?? '',
    //           slug: productCreated[0].slug ?? '',
    //           imageUrl: productCreated[0].imageUrl ?? '',
    //           amount: productCreated[0].amount,
    //           stock: productCreated[0].stock,
    //           decimals: productCreated[0].decimals,
    //           storeId: productCreated[0].storeId,
    //           createdAt: productCreated[0].createdAt,
    //           updatedAt: productCreated[0].updatedAt,
    //           price: ConvertPrice.inDecimal({
    //             decimal: productCreated[0].decimals,
    //             rawPrice: productCreated[0].price,
    //           }),
    //         })
    //       }

    //       return productCreated[0]
    //     } catch (_error) {
    //       productsError.push({
    //         price,
    //         title,
    //         description,
    //         imageUrl,
    //         amount,
    //         stock,
    //       })
    //       return null
    //     }
    //   },
    // )
  }

  return { productSuccess, productsError }
}
export const updateProduct = async ({
  data: { id, price, title, amount, description, imageUrl, stock },
  storeId,
}: {
  data: UpdateProductType
  storeId: string
}) => {
  const storeFound = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.id, storeId),
  })

  if (!storeFound) {
    throw new StoreNotFound()
  }

  const productSlug = Slug.createSlugFromText(title)
  if (title) {
    const productFoundBySlug = await db.query.products.findFirst({
      where: (products, { eq, and }) =>
        and(
          eq(products.slug, productSlug.value),
          eq(products.storeId, storeId),
        ),
    })

    if (productFoundBySlug && productFoundBySlug.id !== id) {
      throw new ProductTitleAlreadyExists()
    }
  }

  const productFound = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.id, id),
  })

  if (!productFound) {
    throw new ProductNotFound()
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
      stock: stock ?? productFound.stock,
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
  const store = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.slug, storeSlug),
  })

  if (!store) {
    throw new StoreNotFound()
  }

  const products = await db.query.products.findMany({
    where: (prodducts, { eq }) => eq(prodducts.storeId, store.id),
  })

  return (
    products.map(
      (product): Partial<ProductType> => ({
        amount: product.amount,
        stock: product.stock,
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
    where: (stores, { eq }) => eq(stores.id, id),
  })

  if (!store) {
    throw new StoreNotFound()
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
        stock: product.stock ?? false,
      }),
    ) ?? []

  return products
}

export const deleteProduct = async ({
  id,
  storeId,
}: {
  id: string
  storeId: string
}) => {
  try {
    await db
      .delete(schema.products)
      .where(
        AND(EQ(schema.products.id, id), EQ(schema.products.storeId, storeId)),
      )
      .execute()
  } catch (_error) {
    throw new DeleteError()
  }
}
