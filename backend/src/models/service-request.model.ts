import { Schema, model } from 'mongoose'
import { serviceRequestTypes } from '../types/domain.js'

const serviceRequestSchema = new Schema(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    tableId: { type: Schema.Types.ObjectId, ref: 'Table' },
    roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
    type: { type: String, enum: serviceRequestTypes, required: true },
    isOpen: { type: Boolean, default: true, index: true },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  },
)

serviceRequestSchema.index({ hotelId: 1, isOpen: 1, createdAt: -1 })

export const ServiceRequestModel = model('ServiceRequest', serviceRequestSchema)
