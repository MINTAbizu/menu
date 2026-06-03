import { Schema, model } from 'mongoose'
import { userRoles, type UserRole } from '../types/domain.js'

export type UserDocument = {
  id: string
  hotelId?: string | null
  assignedBy?: string | null
  email: string
  passwordHash: string
  fullName: string
  role: UserRole
  isActive: boolean
}

const userSchema = new Schema(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', index: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true, trim: true },
    role: { type: String, enum: userRoles, required: true, index: true },
    isActive: { type: Boolean, default: true },
    preferences: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  },
)

userSchema.index({ hotelId: 1, role: 1 })

export const UserModel = model('User', userSchema)
