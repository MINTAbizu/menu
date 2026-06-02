import { notFound } from '../lib/http.js'
import { asyncHandler } from '../middleware/async-handler.js'
import { createOrderSchema, orderService } from '../services/order-service.js'

export const orderController = {
  create: asyncHandler(async (req, res) => {
    const hotelId = req.tenant?.hotelId

    if (!hotelId) {
      throw notFound('Tenant is required to place an order')
    }

    const payload = createOrderSchema.parse(req.body)
    const order = await orderService.createGuestOrder(hotelId, payload)

    req.app.get('io')?.to(`hotel:${hotelId}:kitchen`).emit('order.created', order)
    res.status(201).json({ order })
  }),

  kitchenQueue: asyncHandler(async (req, res) => {
    const hotelId = req.auth?.hotelId ?? req.tenant?.hotelId

    if (!hotelId) {
      throw notFound('Hotel scope is required')
    }

    const orders = await orderService.listActiveKitchenOrders(hotelId)

    res.status(200).json({ orders })
  }),
}
