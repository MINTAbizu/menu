import { notFound } from '../lib/http.js'
import { asyncHandler } from '../middleware/async-handler.js'
import { hotelRepository } from '../repositories/hotel-repository.js'

export const tenantController = {
  resolve: asyncHandler(async (req, res) => {
    const requestedSlug = req.params.slug ?? req.header('x-tenant-slug')
    const slug = Array.isArray(requestedSlug) ? requestedSlug[0] : requestedSlug

    if (!slug) {
      throw notFound('Tenant slug is required')
    }

    const tenant = await hotelRepository.findPublicTenantBySlug(slug)

    if (!tenant) {
      throw notFound('Tenant not found')
    }

    res.status(200).json({ tenant })
  }),
}
