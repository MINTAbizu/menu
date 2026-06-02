import { Router } from 'express'

export const healthRoutes = Router()

healthRoutes.get('/', (_req, res) => {
  res.status(200).json({
    ok: true,
    service: 'hospitality-os-api',
    timestamp: new Date().toISOString(),
  })
})
