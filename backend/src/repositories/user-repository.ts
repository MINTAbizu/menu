import { UserModel } from '../models/index.js'

export const userRepository = {
  findByEmail(email: string) {
    return UserModel.findOne({ email })
      .select('hotelId email fullName passwordHash role isActive')
      .lean({ virtuals: true })
  },

  create(user: {
    hotelId: string
    email: string
    passwordHash: string
    fullName: string
    role: string
    isActive: boolean
    assignedBy: string
  }) {
    return UserModel.create(user)
  },

  findMany(filter: Record<string, string>) {
    return UserModel.find(filter)
      .select('hotelId email fullName role isActive assignedBy')
      .lean({ virtuals: true })
  },
}
