import { z } from 'zod'
import { ServiceRequestModel } from '../models/index.js'
import { serviceRequestTypes } from '../types/domain.js'

export const createServiceRequestSchema = z.object({
  tableId: z.string().min(1).optional(),
  roomId: z.string().min(1).optional(),
  type: z.enum(serviceRequestTypes),
})

export const serviceRequestService = {
  create(hotelId: string, payload: z.infer<typeof createServiceRequestSchema>) {
    return ServiceRequestModel.create({
      hotelId,
      tableId: payload.tableId,
      roomId: payload.roomId,
      type: payload.type,
    })
  },

  listOpen(hotelId: string) {
    return ServiceRequestModel.find({ hotelId, isOpen: true })
      .sort({ createdAt: 1 })
      .populate('tableId')
      .populate('roomId')
      .lean({ virtuals: true })
  },
}
