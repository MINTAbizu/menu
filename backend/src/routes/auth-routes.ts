import { Router } from 'express'
import { authController, loginSchema } from '../controllers/auth-controller.js'
import { authRateLimit } from '../middleware/rate-limit.js'
import { validateBody } from '../middleware/validate.js'

export const authRoutes = Router()

authRoutes.post('/login', authRateLimit, validateBody(loginSchema), authController.login)
