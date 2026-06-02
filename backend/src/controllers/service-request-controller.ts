import { notFound } from '../lib/http.js'
import { asyncHandler } from '../middleware/async-handler.js'
import {
  createServiceRequestSchema,
  serviceRequestService,
} from '../services/service-request-service.js'

export const serviceRequestController = {
  create: asyncHandler(async (req, res) => {
    const hotelId = req.tenant?.hotelId

    if (!hotelId) {
      throw notFound('Tenant is required to request service')
    }

    const payload = createServiceRequestSchema.parse(req.body)
    const serviceRequest = await serviceRequestService.create(hotelId, payload)

    req.app.get('io')?.to(`hotel:${hotelId}:service`).emit('service.requested', serviceRequest)
    res.status(201).json({ serviceRequest })
  }),

  listOpen: asyncHandler(async (req, res) => {
    const hotelId = req.auth?.hotelId ?? req.tenant?.hotelId

    if (!hotelId) {
      throw notFound('Hotel scope is required')
    }

    const serviceRequests = await serviceRequestService.listOpen(hotelId)

    res.status(200).json({ serviceRequests })
  }),
}
