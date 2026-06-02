import { Schema, model } from 'mongoose'

const promotionSchema = new Schema(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    rules: { type: Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  },
)

promotionSchema.index({ hotelId: 1, startsAt: 1, endsAt: 1 })

export const PromotionModel = model('Promotion', promotionSchema)
