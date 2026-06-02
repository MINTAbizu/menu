import { z } from 'zod'
import { authService } from '../services/auth-service.js'
import { asyncHandler } from '../middleware/async-handler.js'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const authController = {
  login: asyncHandler(async (req, res) => {
    const payload = loginSchema.parse(req.body)
    const session = await authService.login(payload.email, payload.password)

    res.status(200).json(session)
  }),
}
