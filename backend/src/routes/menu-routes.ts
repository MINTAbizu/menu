import { Router } from 'express'
import { menuController } from '../controllers/menu-controller.js'

export const menuRoutes = Router()

menuRoutes.get('/', menuController.listPublicMenu)
