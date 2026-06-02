import bcrypt from 'bcryptjs'
import { unauthorized } from '../lib/http.js'
import { tokenService } from './token-service.js'
import { userRepository } from '../repositories/user-repository.js'

export const authService = {
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email.toLowerCase())

    if (!user || !user.isActive) {
      throw unauthorized('Invalid email or password')
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash)

    if (!passwordMatches) {
      throw unauthorized('Invalid email or password')
    }

    const tokens = tokenService.issuePair(user)

    return {
      user: {
        id: String(user._id),
        hotelId: user.hotelId ? String(user.hotelId) : null,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      tokens,
    }
  },
}
