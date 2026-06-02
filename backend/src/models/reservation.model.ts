import { Schema, model } from 'mongoose'

const reservationSchema = new Schema(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', index: true },
    guestName: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    startsAt: { type: Date, required: true },
    partySize: { type: Number, required: true, min: 1 },
    notes: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  },
)

reservationSchema.index({ hotelId: 1, startsAt: 1 })

export const ReservationModel = model('Reservation', reservationSchema)
