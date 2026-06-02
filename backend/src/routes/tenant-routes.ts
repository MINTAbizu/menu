import { Router } from 'express'
import { tenantController } from '../controllers/tenant-controller.js'

export const tenantRoutes = Router()

tenantRoutes.get('/resolve/:slug', tenantController.resolve)
