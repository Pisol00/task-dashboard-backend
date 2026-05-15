export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(status: number, message: string, details?: unknown) {
    super(message)
    this.status = status
    this.details = details
  }

  static notFound(message = 'Not found') {
    return new ApiError(404, message)
  }

  static badRequest(message = 'Bad request', details?: unknown) {
    return new ApiError(400, message, details)
  }
}
