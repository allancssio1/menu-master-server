export class SlugAlreadyExists extends Error {
  constructor() {
    super('Slug already exists')
  }
}
