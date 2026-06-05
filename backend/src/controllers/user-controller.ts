import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { asyncHandler } from '../middleware/async-handler.js'
import { forbidden } from '../lib/http.js'
import { passwordPolicyMessage, validateStrongPassword } from '../lib/password-policy.js'
import { hotelRepository } from '../repositories/hotel-repository.js'
import { userRepository } from '../repositories/user-repository.js'
import type { UserRole } from '../types/domain.js'

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().refine(validateStrongPassword, passwordPolicyMessage),
  fullName: z.string().min(3),
  role: z.enum(['HOTEL_OWNER', 'HOTEL_MANAGER', 'WAITER', 'KITCHEN_STAFF', 'RECEPTIONIST']),
  hotelSlug: z.string().min(1).optional(),
})

const listUsersSchema = z.object({
  role: z.string().optional(),
})

const roleCreateMap: Record<UserRole, string[]> = {
  SUPER_ADMIN: ['HOTEL_OWNER'],
  HOTEL_OWNER: ['HOTEL_MANAGER'],
  HOTEL_MANAGER: ['WAITER', 'KITCHEN_STAFF', 'RECEPTIONIST'],
  WAITER: [],
  KITCHEN_STAFF: [],
  RECEPTIONIST: [],
  GUEST: [],
}

export const userController = {
  create: asyncHandler(async (req, res) => {
    const payload = createUserSchema.parse(req.body)
    const auth = req.auth

    if (!auth) {
      throw forbidden('Authentication required')
    }

    const allowedRoles = roleCreateMap[auth.role] || []
    if (!allowedRoles.includes(payload.role)) {
      throw forbidden('You are not allowed to create users with this role')
    }

    let hotelId = auth.hotelId

    if (auth.role === 'SUPER_ADMIN') {
      if (payload.hotelSlug) {
        const hotel = await hotelRepository.findTenantIdentityBySlug(payload.hotelSlug)

        if (!hotel) {
          throw forbidden('Target hotel was not found')
        }

        hotelId = String(hotel._id)
      } else {
        hotelId = req.tenant?.hotelId ?? auth.hotelId
      }
    } else if (req.tenant?.hotelId && req.tenant.hotelId !== auth.hotelId) {
      throw forbidden('You can only manage users for your assigned hotel')
    }

    if (!hotelId) {
      throw forbidden('Hotel context is required to create this user')
    }

    const passwordHash = await bcrypt.hash(payload.password, 12)

    const user = await userRepository.create({
      hotelId,
      email: payload.email.toLowerCase(),
      passwordHash,
      fullName: payload.fullName,
      role: payload.role,
      isActive: true,
      assignedBy: auth.userId,
    })

    res.status(201).json({
      user: {
        id: String(user._id),
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        hotelId: user.hotelId,
      },
    })
  }),

  list: asyncHandler(async (req, res) => {
    const query = listUsersSchema.parse(req.query)
    const auth = req.auth

    if (!auth) {
      throw forbidden('Authentication required')
    }

    const hotelId = auth.role === 'SUPER_ADMIN' ? req.tenant?.hotelId : auth.hotelId
    const filter: Record<string, string> = {}

    if (auth.role !== 'SUPER_ADMIN' && req.tenant?.hotelId && req.tenant.hotelId !== auth.hotelId) {
      throw forbidden('You can only view users for your assigned hotel')
    }

    if (hotelId) {
      filter.hotelId = hotelId
    }

    if (query.role) {
      filter.role = query.role
    }

    const users = await userRepository.findMany(filter)
    res.status(200).json({ users })
  }),
}

export { createUserSchema, listUsersSchema }
