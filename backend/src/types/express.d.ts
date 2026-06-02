import type { UserRole } from './domain.js'

declare global {
  namespace Express {
    interface Request {
      tenant?: {
        hotelId: string
        slug: string
        name: string
      }
      auth?: {
        userId: string
        hotelId: string | null
        role: UserRole
      }
    }
  }
}

export {}
