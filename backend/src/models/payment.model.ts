import { Schema, model } from 'mongoose'
import { paymentStatuses } from '../types/domain.js'

const paymentSchema = new Schema(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    provider: { type: String, required: true },
    status: { type: String, enum: paymentStatuses, default: 'PENDING', index: true },
    amount: { type: Number, required: true, min: 0 },
    reference: { type: String, unique: true, sparse: true },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  },
)

paymentSchema.index({ hotelId: 1, status: 1 })

export const PaymentModel = model('Payment', paymentSchema)
