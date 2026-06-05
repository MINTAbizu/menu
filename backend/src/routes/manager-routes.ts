import { Router } from 'express'
import { managerController } from '../controllers/manager-controller.js'
import { authMiddleware } from '../middleware/auth.js'
import { requireRoles } from '../middleware/rbac.js'

export const managerRoutes = Router()

managerRoutes.get(
  '/dashboard',
  authMiddleware,
  requireRoles('HOTEL_OWNER', 'HOTEL_MANAGER', 'SUPER_ADMIN'),
  managerController.dashboard,
)
