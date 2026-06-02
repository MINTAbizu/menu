import { Router } from 'express'
import { serviceRequestController } from '../controllers/service-request-controller.js'
import { authMiddleware } from '../middleware/auth.js'
import { requireRoles } from '../middleware/rbac.js'

export const serviceRequestRoutes = Router()

serviceRequestRoutes.post('/', serviceRequestController.create)
serviceRequestRoutes.get(
  '/',
  authMiddleware,
  requireRoles('HOTEL_OWNER', 'HOTEL_MANAGER', 'WAITER', 'RECEPTIONIST'),
  serviceRequestController.listOpen,
)
