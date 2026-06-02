import { HotelModel } from '../models/index.js'

export const hotelRepository = {
  findPublicTenantBySlug(slug: string) {
    return HotelModel.findOne({
      $or: [{ slug }, { subdomain: slug }],
    })
      .select('name slug subdomain logoUrl primaryColor secondaryColor defaultLanguage')
      .lean({ virtuals: true })
  },

  findTenantIdentityBySlug(slug: string) {
    return HotelModel.findOne({
      $or: [{ slug }, { subdomain: slug }],
    })
      .select('name slug')
      .lean({ virtuals: true })
  },
}
