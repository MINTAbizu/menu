import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { HttpError } from '../lib/http.js'
import { env } from '../config/env.js'

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(422).json({
      error: 'Validation failed',
      issues: error.issues,
    })
    return
  }

  if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      error: error.message,
      details: error.details,
    })
    return
  }

  res.status(500).json({
    error: 'Internal server error',
    details: env.NODE_ENV === 'development' ? String(error) : undefined,
  })
}
