import { Schema, model } from 'mongoose'

const branchSchema = new Schema(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    timezone: { type: String, default: 'Africa/Addis_Ababa' },
    address: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  },
)

branchSchema.index({ hotelId: 1, name: 1 })

export const BranchModel = model('Branch', branchSchema)
