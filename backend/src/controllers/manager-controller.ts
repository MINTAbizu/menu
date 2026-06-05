import { notFound } from '../lib/http.js'
import { asyncHandler } from '../middleware/async-handler.js'
import {
  MenuCategoryModel,
  MenuItemModel,
  OrderModel,
  ReservationModel,
  RoomModel,
  ServiceRequestModel,
  TableModel,
  UserModel,
} from '../models/index.js'

export const managerController = {
  dashboard: asyncHandler(async (req, res) => {
    const hotelId = req.auth?.hotelId ?? req.tenant?.hotelId

    if (!hotelId) {
      throw notFound('Hotel scope is required')
    }

    const [
      reservations,
      rooms,
      tables,
      categories,
      menuItems,
      orders,
      serviceRequests,
      users,
    ] = await Promise.all([
      ReservationModel.find({ hotelId }).sort({ startsAt: 1 }).limit(50).lean({ virtuals: true }),
      RoomModel.find({ hotelId }).sort({ floor: 1, number: 1 }).lean({ virtuals: true }),
      TableModel.find({ hotelId }).sort({ label: 1 }).lean({ virtuals: true }),
      MenuCategoryModel.find({ hotelId }).sort({ sortOrder: 1 }).lean({ virtuals: true }),
      MenuItemModel.find({ hotelId }).sort({ name: 1 }).lean({ virtuals: true }),
      OrderModel.find({ hotelId })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate('tableId')
        .populate('roomId')
        .lean({ virtuals: true }),
      ServiceRequestModel.find({ hotelId })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate('tableId')
        .populate('roomId')
        .lean({ virtuals: true }),
      UserModel.find({ hotelId })
        .select('email fullName role isActive createdAt')
        .sort({ role: 1, fullName: 1 })
        .lean({ virtuals: true }),
    ])

    const activeOrders = orders.filter((order) =>
      ['RECEIVED', 'PREPARING', 'COOKING', 'READY', 'DELIVERING'].includes(order.status),
    )
    const openServiceRequests = serviceRequests.filter((request) => request.isOpen)

    res.status(200).json({
      summary: {
        reservations: reservations.length,
        rooms: rooms.length,
        availableRooms: rooms.filter((room) => room.isActive).length,
        tables: tables.length,
        menuItems: menuItems.length,
        activeOrders: activeOrders.length,
        openServiceRequests: openServiceRequests.length,
        users: users.length,
      },
      reservations,
      rooms,
      tables,
      categories,
      menuItems,
      orders,
      kitchenOrders: activeOrders,
      serviceRequests,
      users,
    })
  }),
}
