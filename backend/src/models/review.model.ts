import { Schema, model } from 'mongoose'

const reviewSchema = new Schema(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  },
)

reviewSchema.index({ hotelId: 1, rating: 1 })

export const ReviewModel = model('Review', reviewSchema)
