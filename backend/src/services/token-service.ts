import jwt, { type SignOptions } from 'jsonwebtoken'
import { env } from '../config/env.js'
import type { UserRole } from '../types/domain.js'

type TokenUser = {
  id: string
  hotelId: string | null
  role: UserRole
}

const sign = (user: TokenUser, secret: string, expiresIn: string) => {
  const options: SignOptions = { expiresIn: expiresIn as SignOptions['expiresIn'] }

  return jwt.sign(
    {
      hotelId: user.hotelId,
      role: user.role,
    },
    secret,
    {
      ...options,
      subject: user.id,
    },
  )
}

export const tokenService = {
  issuePair(user: TokenUser) {
    return {
      accessToken: sign(user, env.JWT_ACCESS_SECRET, env.ACCESS_TOKEN_TTL),
      refreshToken: sign(user, env.JWT_REFRESH_SECRET, env.REFRESH_TOKEN_TTL),
    }
  },
}
