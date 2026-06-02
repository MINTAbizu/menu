import { Schema, model } from 'mongoose'

const loyaltyPointSchema = new Schema(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    points: { type: Number, required: true },
    reason: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  },
)

loyaltyPointSchema.index({ hotelId: 1, userId: 1 })

export const LoyaltyPointModel = model('LoyaltyPoint', loyaltyPointSchema)
