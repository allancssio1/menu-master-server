export class ProductTitleAlreadyExists extends Error {
  constructor() {
    super('Product tile already exists in this store')
  }
}
