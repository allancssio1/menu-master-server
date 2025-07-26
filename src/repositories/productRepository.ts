import type {
  CreateProductType,
  ProductType,
  UpdateProductType,
} from '../http/types/productTypes.ts'

export interface ProductReporitory {
  createProduct(data: CreateProductType): Promise<ProductType>
  updateProduct(data: UpdateProductType): Promise<void>
  deleteProduct(id: string): Promise<void>
  getAllProductsByStore(storeSlug: string): Promise<ProductType[]>
  getAllProductsByStoreId(id: string): Promise<ProductType[]>
}
