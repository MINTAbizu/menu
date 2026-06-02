import { z } from 'zod'
import { notFound } from '../lib/http.js'
import { OrderModel } from '../models/index.js'
import { menuRepository } from '../repositories/menu-repository.js'

export const createOrderSchema = z.object({
  branchId: z.string().min(1),
  tableId: z.string().min(1).optional(),
  roomId: z.string().min(1).optional(),
  notes: z.string().max(1000).optional(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1),
        quantity: z.number().int().positive().max(20),
        notes: z.string().max(500).optional(),
      }),
    )
    .min(1),
})

export const orderService = {
  async createGuestOrder(hotelId: string, payload: z.infer<typeof createOrderSchema>) {
    const itemIds = payload.items.map((item) => item.menuItemId)
    const menuItems = await menuRepository.findItemsByIds(hotelId, itemIds)
    const priceById = new Map(menuItems.map((item) => [String(item._id), item.price]))
    const nameById = new Map(menuItems.map((item) => [String(item._id), item.name]))

    if (menuItems.length !== itemIds.length) {
      throw notFound('One or more menu items were not found')
    }

    const subtotal = payload.items.reduce(
      (sum, item) => sum + (priceById.get(item.menuItemId) ?? 0) * item.quantity,
      0,
    )

    const tax = Number((subtotal * 0.15).toFixed(2))
    const serviceFee = Number((subtotal * 0.05).toFixed(2))
    const total = Number((subtotal + tax + serviceFee).toFixed(2))

    return OrderModel.create({
      hotelId,
      branchId: payload.branchId,
      tableId: payload.tableId,
      roomId: payload.roomId,
      notes: payload.notes,
      subtotal,
      tax,
      serviceFee,
      total,
      items: payload.items.map((item) => ({
        menuItemId: item.menuItemId,
        nameSnapshot: nameById.get(item.menuItemId) ?? 'Menu item',
        quantity: item.quantity,
        unitPrice: priceById.get(item.menuItemId) ?? 0,
        notes: item.notes,
      })),
    })
  },

  listActiveKitchenOrders(hotelId: string) {
    return OrderModel.find({
      hotelId,
      status: { $in: ['RECEIVED', 'PREPARING', 'COOKING', 'READY', 'DELIVERING'] },
    })
      .sort({ createdAt: 1 })
      .populate('tableId')
      .populate('roomId')
      .lean({ virtuals: true })
  },
}
