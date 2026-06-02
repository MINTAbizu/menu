import type { RequestHandler } from 'express'
import type { z } from 'zod'

export const validateBody =
  <Schema extends z.ZodType>(schema: Schema): RequestHandler =>
  (req, _res, next) => {
    req.body = schema.parse(req.body)
    next()
  }

export const validateQuery =
  <Schema extends z.ZodType>(schema: Schema): RequestHandler =>
  (req, _res, next) => {
    req.query = schema.parse(req.query) as never
    next()
  }
