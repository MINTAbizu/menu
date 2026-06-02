import { Schema, model } from 'mongoose'

const modifierSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    priceDelta: { type: Number, default: 0 },
  },
  { _id: false },
)

const menuItemSchema = new Schema(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'MenuCategory', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String },
    arAssetUrl: { type: String },
    tags: [{ type: String }],
    modifiers: [modifierSchema],
    isAvailable: { type: Boolean, default: true },
    prepMinutes: { type: Number, default: 15 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  },
)

menuItemSchema.index({ hotelId: 1, categoryId: 1 })
menuItemSchema.index({ hotelId: 1, isAvailable: 1 })
menuItemSchema.index({ name: 'text', description: 'text', tags: 'text' })

export const MenuItemModel = model('MenuItem', menuItemSchema)
