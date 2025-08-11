export class StoreAlreadyExists extends Error {
  constructor() {
    super('Store already exists')
  }
}
