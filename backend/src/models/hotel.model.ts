import { Schema, model } from 'mongoose'

const hotelSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subdomain: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    logoUrl: { type: String },
    primaryColor: { type: String, default: '#0f766e' },
    secondaryColor: { type: String, default: '#111815' },
    defaultLanguage: { type: String, default: 'en' },
    subscriptionStatus: { type: String, default: 'trial' },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  },
)

export const HotelModel = model('Hotel', hotelSchema)
