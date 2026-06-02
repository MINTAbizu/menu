import { Schema, model } from 'mongoose'

const tableSchema = new Schema(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    label: { type: String, required: true, trim: true },
    qrToken: { type: String, required: true, unique: true, index: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  },
)

tableSchema.index({ hotelId: 1, branchId: 1 })

export const TableModel = model('Table', tableSchema)
