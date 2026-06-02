import type { RequestHandler } from 'express'
import { notFound } from '../lib/http.js'
import { hotelRepository } from '../repositories/hotel-repository.js'

const getSubdomain = (hostname: string) => {
  const cleanHost = hostname.split(':')[0] ?? hostname
  const parts = cleanHost.split('.')
  return parts.length > 2 ? parts[0] : undefined
}

export const tenantMiddleware: RequestHandler = async (req, _res, next) => {
  const headerSlug = req.header('x-tenant-slug')
  const subdomain = getSubdomain(req.hostname)
  const slug = headerSlug ?? subdomain

  if (!slug || slug === 'localhost' || slug === '127') {
    next()
    return
  }

  const hotel = await hotelRepository.findTenantIdentityBySlug(slug)

  if (!hotel) {
    next(notFound('Tenant not found'))
    return
  }

  req.tenant = {
    hotelId: String(hotel._id),
    slug: hotel.slug,
    name: hotel.name,
  }

  next()
}
