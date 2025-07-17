import type z from 'zod'
import type {
  createProductSchema,
  deleteProductSchema,
  productSchema,
  updateProductSchema,
} from '../validations/productSchemas.ts'

export type CreateProductType = z.infer<typeof createProductSchema>

export type UpdateProductType = z.infer<typeof updateProductSchema>

export type DeleteProductType = z.infer<typeof deleteProductSchema>

export type ProductType = z.infer<typeof productSchema>
