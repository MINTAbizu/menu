import { Schema, model } from 'mongoose'
import { orderStatuses } from '../types/domain.js'

const orderItemSchema = new Schema(
  {
    menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    nameSnapshot: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    notes: { type: String },
  },
  { _id: false },
)

const orderSchema = new Schema(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    guestId: { type: Schema.Types.ObjectId, ref: 'User' },
    staffId: { type: Schema.Types.ObjectId, ref: 'User' },
    tableId: { type: Schema.Types.ObjectId, ref: 'Table' },
    roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
    status: { type: String, enum: orderStatuses, default: 'RECEIVED', index: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0 },
    serviceFee: { type: Number, default: 0 },
    total: { type: Number, required: true, min: 0 },
    notes: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  },
)

orderSchema.index({ hotelId: 1, status: 1, createdAt: -1 })
orderSchema.index({ branchId: 1, createdAt: -1 })

export const OrderModel = model('Order', orderSchema)
