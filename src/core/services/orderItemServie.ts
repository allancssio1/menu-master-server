// import { db } from '../../db/conection.ts'
// import { schema } from '../../db/schema/index.ts'

export const createOrder = ({
  items,
}: {
  items: {
    productId: string
    amount: number
  }[]
}) => {
  return items
}

// biome-ignore lint/correctness/noUnusedFunctionParameters: <return temp>
export const deleteOrder = ({ orderId }: { orderId: string }): null => {
  return null
}
