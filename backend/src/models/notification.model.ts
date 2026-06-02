import { Schema, model } from 'mongoose'

const notificationSchema = new Schema(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    audience: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  },
)

notificationSchema.index({ hotelId: 1, createdAt: -1 })

export const NotificationModel = model('Notification', notificationSchema)
