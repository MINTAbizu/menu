export class HttpError extends Error {
  statusCode: number
  details?: unknown

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message)
    this.statusCode = statusCode
    this.details = details
  }
}

export const unauthorized = (message = 'Authentication required') => new HttpError(401, message)

export const forbidden = (message = 'You do not have permission for this action') =>
  new HttpError(403, message)

export const notFound = (message = 'Resource not found') => new HttpError(404, message)
