import { BranchModel, HotelModel } from '../models/index.js'

const publicTenantFields = 'name slug subdomain logoUrl primaryColor secondaryColor defaultLanguage subscriptionStatus'

export const hotelRepository = {
  async listPublicTenants() {
    const hotels = await HotelModel.find({})
      .select(publicTenantFields)
      .sort({ name: 1 })
      .lean({ virtuals: true })

    const branchCounts = await BranchModel.aggregate<{ _id: string; count: number }>([
      { $group: { _id: '$hotelId', count: { $sum: 1 } } },
    ])

    const branchesByHotel = new Map(
      branchCounts.map((item) => [String(item._id), item.count]),
    )

    return hotels.map((hotel) => ({
      ...hotel,
      branchCount: branchesByHotel.get(String(hotel._id)) ?? 0,
    }))
  },

  findPublicTenantBySlug(slug: string) {
    return HotelModel.findOne({
      $or: [{ slug }, { subdomain: slug }],
    })
      .select(publicTenantFields)
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
