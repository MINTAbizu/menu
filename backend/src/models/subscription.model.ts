import { Schema, model } from 'mongoose'

const subscriptionSchema = new Schema(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    plan: { type: String, required: true },
    status: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    renewsAt: { type: Date, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  },
)

subscriptionSchema.index({ hotelId: 1, status: 1 })

export const SubscriptionModel = model('Subscription', subscriptionSchema)
