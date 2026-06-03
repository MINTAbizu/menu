import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'
import { errorHandler } from './middleware/error-handler.js'
import { apiRateLimit } from './middleware/rate-limit.js'
import { tenantMiddleware } from './middleware/tenant.js'
import { authRoutes } from './routes/auth-routes.js'
import { healthRoutes } from './routes/health-routes.js'
import { menuRoutes } from './routes/menu-routes.js'
import { orderRoutes } from './routes/order-routes.js'
import { serviceRequestRoutes } from './routes/service-request-routes.js'
import { tenantRoutes } from './routes/tenant-routes.js'
import { userRoutes } from './routes/user-routes.js'

export const createApp = () => {
  const app = express()

  app.disable('x-powered-by')
  app.use(helmet())
  app.use(
    cors({
      origin: env.FRONTEND_ORIGIN,
      credentials: true,
    }),
  )
  app.use(compression())
  app.use(cookieParser())
  app.use(express.json({ limit: '1mb' }))
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))
  app.use(apiRateLimit)
  app.use(tenantMiddleware)

  app.use('/health', healthRoutes)
  app.use('/api/v1/auth', authRoutes)
  app.use('/api/v1/tenants', tenantRoutes)
  app.use('/api/v1/menu', menuRoutes)
  app.use('/api/v1/orders', orderRoutes)
  app.use('/api/v1/service-requests', serviceRequestRoutes)
  app.use('/api/v1/users', userRoutes)

  app.use(errorHandler)

  return app
}
