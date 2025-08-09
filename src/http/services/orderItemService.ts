import { db } from '../../db/conection.ts'
import { schema } from '../../db/schema/index.ts'
import { ConvertPrice } from '../../lib/ConvertPrice.ts'

export const createOrderItem = async ({
  data,
}: {
  data: {
    oderId: string
    productId: string
    amount: number
    price: number
    decimals: number
  }
}) => {
  const price = ConvertPrice.inInteger({
    rawPrice: data.price,
    decimal: data.decimals,
  })

  const orderItem = await db
    .insert(schema.orderItems)
    .values({
      amount: data.amount,
      orderId: data.oderId,
      productId: data.productId,
      price,
    })
    .returning()

  return {
    ...orderItem[0],
    price: ConvertPrice.inDecimal({
      rawPrice: orderItem[0].price,
      decimal: orderItem[0].decimals,
    }),
  }
}
