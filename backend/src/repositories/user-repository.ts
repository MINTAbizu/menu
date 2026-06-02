import { UserModel } from '../models/index.js'

export const userRepository = {
  findByEmail(email: string) {
    return UserModel.findOne({ email })
      .select('hotelId email fullName passwordHash role isActive')
      .lean({ virtuals: true })
  },
}
