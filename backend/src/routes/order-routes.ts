import { Router } from 'express'
import { orderController } from '../controllers/order-controller.js'
import { authMiddleware } from '../middleware/auth.js'
import { requireRoles } from '../middleware/rbac.js'

export const orderRoutes = Router()

orderRoutes.post('/', orderController.create)
orderRoutes.get(
  '/kitchen',
  authMiddleware,
  requireRoles('HOTEL_OWNER', 'HOTEL_MANAGER', 'KITCHEN_STAFF'),
  orderController.kitchenQueue,
)
