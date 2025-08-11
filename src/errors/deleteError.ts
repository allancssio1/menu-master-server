export class DeleteError extends Error {
  constructor(message = 'Error deleting store or Store not found') {
    super(message)
  }
}
