import { Schema, model } from 'mongoose'

const analyticsEventSchema = new Schema(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    name: { type: String, required: true, index: true },
    payload: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  },
)

analyticsEventSchema.index({ hotelId: 1, name: 1, createdAt: -1 })

export const AnalyticsEventModel = model('AnalyticsEvent', analyticsEventSchema)
