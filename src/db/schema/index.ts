/** biome-ignore-all assist/source/organizeImports: <no> */
import { stores } from './store.ts'
import { products } from './product.ts'
import { auth } from './auth.ts'
import { orders } from './order.ts'
import { orderItems } from './orderItem.ts'
import { clients } from './client.ts'

export const schema = {
  stores,
  products,
  auth,
  orders,
  orderItems,
  clients,
}
