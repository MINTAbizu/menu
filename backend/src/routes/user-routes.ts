import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { requireRoles } from '../middleware/rbac.js'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { userController, createUserSchema, listUsersSchema } from '../controllers/user-controller.js'

export const userRoutes = Router()

userRoutes.post(
  '/',
  authMiddleware,
  requireRoles('SUPER_ADMIN', 'HOTEL_OWNER', 'HOTEL_MANAGER'),
  validateBody(createUserSchema),
  userController.create,
)

userRoutes.get(
  '/',
  authMiddleware,
  requireRoles('SUPER_ADMIN', 'HOTEL_OWNER', 'HOTEL_MANAGER'),
  validateQuery(listUsersSchema),
  userController.list,
)
