import { Schema, model } from 'mongoose'

const menuCategorySchema = new Schema(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    name: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  },
)

menuCategorySchema.index({ hotelId: 1, sortOrder: 1 })

export const MenuCategoryModel = model('MenuCategory', menuCategorySchema)
