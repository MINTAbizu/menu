import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { unauthorized } from '../lib/http.js'
import type { UserRole } from '../types/domain.js'

type AccessTokenPayload = {
  sub: string
  hotelId: string | null
  role: string
}

export const authMiddleware: RequestHandler = (req, _res, next) => {
  const header = req.header('authorization')
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined

  if (!token) {
    next(unauthorized())
    return
  }

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload

    req.auth = {
      userId: payload.sub,
      hotelId: payload.hotelId,
      role: payload.role as UserRole,
    }

    next()
  } catch {
    next(unauthorized('Invalid or expired token'))
  }
}
