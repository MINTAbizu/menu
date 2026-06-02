import type { RequestHandler } from 'express'
import type { UserRole } from '@prisma/client'
import { forbidden, unauthorized } from '../lib/http.js'

export const requireRoles =
  (...roles: UserRole[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.auth) {
      next(unauthorized())
      return
    }

    if (!roles.includes(req.auth.role)) {
      next(forbidden())
      return
    }

    next()
  }
