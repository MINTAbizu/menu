import type { RequestHandler } from 'express'
import { forbidden, unauthorized } from '../lib/http.js'
import type { UserRole } from '../types/domain.js'

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
